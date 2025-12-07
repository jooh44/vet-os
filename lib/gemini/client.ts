import { GoogleGenAI } from "@google/genai";

// Using the experimental 2.0 Flash as the most advanced "Flash" model available currently.
// User requested "gemini-2.5-flash".
export const GEMINI_MODEL_NAME = "gemini-2.5-flash";

let genAIInstance: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
    if (genAIInstance) return genAIInstance;

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    // New SDK initialization
    genAIInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return genAIInstance;
}
