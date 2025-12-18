'use server';

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { File } from 'node:buffer';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import ffmpeg from 'fluent-ffmpeg';

// Use system ffmpeg (installed via apk)
ffmpeg.setFfmpegPath('ffmpeg');

// @ts-ignore
if (typeof globalThis.File === 'undefined') {
    // @ts-ignore
    globalThis.File = File;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function splitAudio(filePath: string, chunkDuration: number = 600): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const outputPattern = path.join(path.dirname(filePath), `chunk-%03d${path.extname(filePath)}`);
        const chunkPaths: string[] = [];

        ffmpeg(filePath)
            .outputOptions([
                `-f segment`,
                `-segment_time ${chunkDuration}`, // Split every X seconds
                `-c copy` // Copy codec to avoid re-encoding overhead
            ])
            .output(outputPattern)
            .on('end', () => {
                // Find all generated chunks
                const dir = path.dirname(filePath);
                const files = fs.readdirSync(dir)
                    .filter(f => f.startsWith('chunk-') && f.endsWith(path.extname(filePath)))
                    .sort()
                    .map(f => path.join(dir, f));
                resolve(files);
            })
            .on('error', (err) => reject(err))
            .run();
    });
}

export async function processConsultationAudio(formData: FormData) {
    try {
        const audioFile = formData.get('audio') as unknown as File;
        if (!audioFile) {
            throw new Error('No audio file provided');
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const originalName = audioFile.name || 'audio.webm';
        const extension = path.extname(originalName) || '.webm';
        // Use a unique folder for this request to avoid collisions
        const requestId = Date.now().toString();
        const tempDir = path.join(os.tmpdir(), `vetos-${requestId}`);
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const tempFilePath = path.join(tempDir, `original${extension}`);
        fs.writeFileSync(tempFilePath, buffer);

        const fileSizeInBytes = fs.statSync(tempFilePath).size;
        const limitBytes = 24 * 1024 * 1024; // 24MB safety limit (OpenAI is 25MB)

        let transcriptText = '';

        if (fileSizeInBytes < limitBytes) {
            console.log(`Processing small file: ${fileSizeInBytes / 1024 / 1024} MB`);
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: 'whisper-1',
                language: 'pt',
            });
            transcriptText = transcription.text;
        } else {
            console.log(`Processing large file: ${fileSizeInBytes / 1024 / 1024} MB. Splitting...`);
            // Split into 10-minute chunks (600s). Most formats/bitrates will fit 10min in 25MB.
            // If high bitrate wav, might need smaller chunks. Assuming webm/mp3/mp4.
            const chunks = await splitAudio(tempFilePath, 600);
            console.log(`Split into ${chunks.length} chunks.`);

            // Process chunks sequentially to respect rate limits and order
            for (const chunkPath of chunks) {
                console.log(`Transcribing chunk: ${path.basename(chunkPath)}`);
                const chunkTrans = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(chunkPath),
                    model: 'whisper-1',
                    language: 'pt',
                });
                transcriptText += chunkTrans.text + ' ';
            }
        }

        console.log('Full Transcript Length:', transcriptText.length);

        // Clean up temp dir
        fs.rmSync(tempDir, { recursive: true, force: true });

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
                    - physicalExam: (String) Objective findings (general state, mucous membranes, etc).
                    - vitalSigns: (Object) Extract specific values if present:
                        - temperature: (Number or String) e.g. 38.5
                        - weight: (Number or String) e.g. 10.5
                        - heartRate: (Number or String) e.g. 120
                        - respiratoryRate: (Number or String) e.g. 30
                        - capillaryRefill: (String) e.g. "2s"
                        - hydration: (String) e.g. "Normal"
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
        // Better error message for debugging
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Stack Trace:`, error instanceof Error ? error.stack : 'No stack');

        return {
            success: false,
            error: errorMessage
        };
    }
}
