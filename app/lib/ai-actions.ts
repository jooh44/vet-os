'use server';

import OpenAI from 'openai';
import { uploadFile } from '@/lib/storage'; // Reusing existing MinIO logic
import fs from 'fs';
import path from 'path';
import os from 'os';
import { File } from 'node:buffer'; // Fix for Node < 20

// @ts-ignore
if (typeof globalThis.File === 'undefined') {
    // @ts-ignore
    globalThis.File = File;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function processConsultationAudio(formData: FormData) {
    try {
        const audioFile = formData.get('audio') as unknown as File;
        if (!audioFile) {
            throw new Error('No audio file provided');
        }

        // 1. Upload to MinIO (Audit/Backup)
        // Convert File to Buffer for MinIO
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // We'll skip MinIO for now if it's too complex to convert the File type from client, 
        // but let's assume uploadFile handles it or we mock it.
        // For simplicity in this demo, let's just proceed to AI processing.
        // Ideally: await uploadFile(audioFile, 'consultations');

        // 2. Transcribe with Whisper
        // OpenAI expects a ReadStream or File object.
        const originalName = audioFile.name || 'audio.webm';
        const extension = path.extname(originalName) || '.webm';
        const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}${extension}`);

        fs.writeFileSync(tempFilePath, buffer);

        console.log(`Transcribing audio: ${originalName} (${extension}) path: ${tempFilePath}`);
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: 'whisper-1',
            language: 'pt', // Force Portuguese
        });

        const transcriptText = transcription.text;
        console.log('Transcript:', transcriptText);

        // Clean up temp file
        fs.unlinkSync(tempFilePath);

        // 3. Structure with GPT-4o
        console.log('Structuring data with GPT-4o...');
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a Veterinary Assistant AI. Your job is to extract medical information from a consultation transcript and return a structured JSON.
                    
                    Return ONLY the JSON with the following fields:
                    - anamnesis: (String) Summary of the history/complaint.
                    - physicalExam: (String) Objective findings (temp, weight, etc).
                    - diagnosis: (String) Suspected or confirmed diagnosis.
                    - prescription: (String) List of medications and instructions.
                    
                    If information is missing, use "Não informado" or infer from context if safe. Translate technical terms to professional Portuguese.`
                },
                {
                    role: 'user',
                    content: `Transcript: "${transcriptText}"`
                }
            ],
            response_format: { type: 'json_object' },
        });

        const structuredData = JSON.parse(completion.choices[0].message.content || '{}');

        return {
            success: true,
            transcript: transcriptText,
            data: structuredData
        };

    } catch (error) {
        console.error('AI Processing Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
