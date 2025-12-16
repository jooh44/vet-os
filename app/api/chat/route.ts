import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, context } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            throw new Error("Invalid messages format: expected an array.");
        }

        const systemContext = context ? `\n\nCURRENT PAGE CONTEXT (Trust this over general queries):\n${JSON.stringify(context, null, 2)}` : '';

        const result = await streamText({
            model: google('gemini-2.5-flash'),
            messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
            system: `You are Fred, the Clinical Copilot for VET.OS.
        Your goal is to assist veterinarians with diagnostics, documentation, and patient history.
        
        You have direct access to the clinic's database.
        When a user asks about a patient, ALWAYS check the Context first or use 'searchPatients'/'getPatientHistory'.
        
        If analyzing symptoms, start by checking if there's a recent consultation in history for this pet.
        Provide differential diagnoses when asked, but always add a disclaimer.
        
        Language: Portuguese (Brazil).
        Tone: Professional, Clinical, Efficient.
        ${systemContext}`,
            maxSteps: 5,
            tools: {
                getPatientHistory: tool({
                    description: 'Get consultation history for a patient. Use this to see past diagnoses, prescriptions, and notes.',
                    parameters: z.object({
                        petId: z.string().describe('ID of the pet (use from Context if available)'),
                        limit: z.number().optional().default(5)
                    }),
                    execute: async (args: any) => {
                        const { petId, limit } = args;

                        const consultations = await prisma.consultation.findMany({
                            where: { petId },
                            orderBy: { date: 'desc' },
                            take: limit,
                            include: {
                                vet: { select: { name: true } }
                            }
                        });

                        if (!consultations.length) return "No history found for this patient.";

                        return consultations.map((c: any) => ({
                            date: c.date.toISOString().split('T')[0],
                            title: c.title,
                            diagnosis: c.diagnosis || 'Undiagnosed',
                            vet: c.vet.name,
                            summary: c.summary || c.notes || 'No summary'
                        }));
                    },
                } as any) as any,

                searchPatients: tool({
                    description: 'Search for patients by name to find their ID.',
                    parameters: z.object({
                        query: z.string().describe('Name of the pet'),
                    }),
                    execute: async (args: any) => {
                        const { query } = args;
                        const pets = await prisma.pet.findMany({
                            where: {
                                name: { contains: query, mode: 'insensitive' }
                            },
                            include: {
                                tutor: { select: { user: { select: { name: true } } } }
                            },
                            take: 5
                        });

                        return pets.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            species: p.species,
                            tutor: p.tutor?.user?.name || 'Unknown'
                        }));
                    },
                } as any) as any,

                getConsultationQueue: tool({
                    description: 'Get the list of active or recent consultations.',
                    parameters: z.object({}),
                    execute: async () => {
                        // Since we don't have Appointment status anymore, we fetch recent consultations
                        const recent = await prisma.consultation.findMany({
                            orderBy: { updatedAt: 'desc' },
                            take: 5,
                            include: { pet: true }
                        });

                        return recent.map((c: any) => ({
                            pet: c.pet.name,
                            title: c.title,
                            time: c.updatedAt.toISOString()
                        }));
                    }
                } as any) as any
            },
        } as any);

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error processing chat request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
