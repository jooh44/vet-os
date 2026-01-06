// Gemini 2.0 migration
'use server';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { File } from 'node:buffer';

// @ts-ignore
if (typeof globalThis.File === 'undefined') {
    // @ts-ignore
    globalThis.File = File;
}

// Define the schema for the output
const consultationSchema = z.object({
    anamnesis: z.string().describe("Summary of the history/complaint"),
    physicalExam: z.string().describe("Objective findings (general state, mucous membranes, etc)"),
    vitalSigns: z.object({
        temperature: z.union([z.number(), z.string(), z.null()]).describe("e.g. 38.5"),
        weight: z.union([z.number(), z.string(), z.null()]).describe("e.g. 10.5"),
        heartRate: z.union([z.number(), z.string(), z.null()]).describe("e.g. 120"),
        respiratoryRate: z.union([z.number(), z.string(), z.null()]).describe("e.g. 30"),
        capillaryRefill: z.union([z.string(), z.null()]).describe('e.g. "2s"'),
        hydration: z.union([z.string(), z.null()]).describe('e.g. "Normal"')
    }).partial(),
    diagnosis: z.string().describe("Suspected or confirmed diagnosis"),
    prescription: z.string().describe("List of medications and instructions")
});

export async function processConsultationAudio(formData: FormData) {
    try {
        console.log("Starting Gemini 2.0 Flash processing via AI SDK...");
        const audioFile = formData.get('audio') as unknown as File;
        if (!audioFile) {
            throw new Error('No audio file provided');
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Audio size:", buffer.length);
        console.log("Mime Type:", audioFile.type || 'audio/mp3');

        // Check size limit for inline data (approx 20MB limit for Gemini API inline)
        if (buffer.length > 19 * 1024 * 1024) {
            console.warn("Warning: File size is close to inline limit. If it fails, we might need File API implementation (requires new package).");
        }

        const result = await generateObject({
            model: google('gemini-2.0-flash-exp', {
                structuredOutputs: false // Loose mode for experimental models
            }),
            schema: consultationSchema,
            prompt: 'You are a Veterinary Assistant AI. Listen to this consultation audio and extract medical information into a structured JSON. If information is missing, infer reasonably from context or use "Não informado". Translate technical terms to professional Portuguese.',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Analyze this audio consultation:' },
                        { type: 'file', data: buffer, mimeType: audioFile.type || 'audio/mp3' }
                    ]
                }
            ]
        });

        console.log("Gemini processing complete!");

        return {
            success: true,
            transcript: "Processado via Gemini 2.0 Flash (Áudio Direto)",
            data: result.object
        };

    } catch (error) {
        console.error('AI Processing Error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: errorMessage
        };
    }
}
