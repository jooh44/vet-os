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

        const systemContext = context ? `\n\nCURRENT PAGE CONTEXT:\n${JSON.stringify(context, null, 2)}` : '';

        const result = await streamText({
            model: google('gemini-2.5-flash'),
            messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
            system: `You are Fred, a veterinary clinic assistant by VET.OS. 
        You are helpful, concise, and professional. 
        You speak Portuguese (Brazil).
        You help veterinarians and staff with their daily tasks.
        You have direct access to the clinic's database via tools.
        Always verify information using tools before answering specific questions about patients or appointments.
        ${systemContext}`,
            maxSteps: 5,
            tools: {
                getAppointments: tool({
                    description: 'List appointments for a specific date range or status. Default to today if no date provided.',
                    parameters: z.object({
                        date: z.string().optional().describe('Date in YYYY-MM-DD format'),
                        status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']).optional(),
                    }),
                    execute: async (args: any) => {
                        const { date, status } = args;
                        const targetDate = date ? new Date(date) : new Date();
                        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
                        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

                        const appointments = await prisma.appointment.findMany({
                            where: {
                                startTime: {
                                    gte: startOfDay,
                                    lte: endOfDay
                                },
                                ...(status ? { status: status } : {})
                            },
                            include: {
                                pet: {
                                    include: {
                                        tutor: {
                                            include: {
                                                user: true
                                            }
                                        }
                                    }
                                }
                            },
                            orderBy: {
                                startTime: 'asc'
                            }
                        });

                        return appointments.map((a: any) => ({
                            id: a.id,
                            time: a.startTime.toISOString(),
                            title: a.title,
                            status: a.status,
                            pet: a.pet ? `${a.pet.name} (${a.pet.species})` : 'N/A',
                            tutor: a.pet?.tutor?.user?.name || 'N/A'
                        }));
                    },
                } as any) as any,
                searchPatients: tool({
                    description: 'Search for patients (pets) by name.',
                    parameters: z.object({
                        query: z.string().describe('Name of the pet to search for'),
                    }),
                    execute: async (args: any) => {
                        const { query } = args;
                        const pets = await prisma.pet.findMany({
                            where: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            },
                            include: {
                                tutor: {
                                    include: {
                                        user: true
                                    }
                                }
                            },
                            take: 5
                        });

                        return pets.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            species: p.species,
                            breed: p.breed,
                            tutor: p.tutor.user.name
                        }));
                    },
                } as any) as any,
            },
        } as any);

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error processing chat request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
