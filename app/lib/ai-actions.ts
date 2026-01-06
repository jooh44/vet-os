'use server';

import fs from 'fs';
import path from 'path';
import os from 'os';
import { File } from 'node:buffer';

// @ts-ignore
if (typeof globalThis.File === 'undefined') {
    // @ts-ignore
    globalThis.File = File;
}

export async function processConsultationAudio(formData: FormData) {
    try {
        console.log("Starting Gemini 1.5 Flash processing via Direct Fetch...");
        const audioFile = formData.get('audio') as unknown as File;
        if (!audioFile) {
            throw new Error('No audio file provided');
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString('base64');
        // Gemini API expects mime_type, defaulting to mp3 but trying to use original
        // Valid types: audio/wav, audio/mp3, audio/aiff, audio/aac, audio/ogg, audio/flac
        let mimeType = audioFile.type || 'audio/mp3';
        if (mimeType === 'audio/mpeg') mimeType = 'audio/mp3';

        console.log("Audio size:", buffer.length);
        console.log("Mime Type:", mimeType);

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

        const prompt = `You are a Veterinary Assistant AI. Your job is to listen to this consultation audio and extract medical information into a structured JSON.
        
        Return ONLY the JSON object with the following fields:
        - anamnesis: (String) Summary of the history/complaint.
        - physicalExam: (String) Objective findings (general state, mucous membranes, etc).
        - vitalSigns: (Object) Extract specific values if present (use null or "Não informado" if missing):
            - temperature: (Number or String)
            - weight: (Number or String)
            - heartRate: (Number or String)
            - respiratoryRate: (Number or String)
            - capillaryRefill: (String)
            - hydration: (String)
        - diagnosis: (String) Suspected or confirmed diagnosis.
        - prescription: (String) List of medications and instructions.
        
        If information is missing, infer reasonably from context or use "Não informado". Translate technical terms to professional Portuguese.`;

        // URL for Gemini 1.5 Flash (Stable, Free Tier available)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Audio
                            }
                        }
                    ]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Safety check for candidates
        if (!data.candidates || data.candidates.length === 0) {
            // Check for safety ratings blocking
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`Blocked by safety filter: ${data.promptFeedback.blockReason}`);
            }
            throw new Error("Gemini returned no candidates (empty response)");
        }

        let contentText = data.candidates[0].content.parts[0].text;
        console.log("Gemini Raw Response Length:", contentText.length);

        // Clean markdown code blocks if present (although response_mime_type: json usually avoids this)
        contentText = contentText.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        let structuredData;
        try {
            structuredData = JSON.parse(contentText);
        } catch (e) {
            console.error("Failed to parse JSON:", contentText);
            throw new Error("Invalid JSON response from Gemini");
        }

        return {
            success: true,
            transcript: "Processado via Gemini 2.0 Flash (Fetch)",
            data: structuredData
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
