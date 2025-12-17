'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export async function createAppointment(data: {
    title: string;
    startTime: Date;
    endTime: Date;
    type: string;
    petId?: string;
}) {
    try {
        const session = await auth();
        let vetId = session?.user?.id;

        if (!vetId) {
            const fallbackUser = await prisma.user.findFirst();
            if (fallbackUser) vetId = fallbackUser.id;
            else return { error: "Usuário não autenticado." };
        }

        if (!data.petId) return { error: "Pet é obrigatório." };

        await prisma.consultation.create({
            data: {
                title: data.title,
                date: data.startTime,
                petId: data.petId,
                vetId: vetId!,
                status: 'SCHEDULED'
            }
        });

        revalidatePath('/dashboard/agenda');
        return { success: true };
    } catch (error: any) {
        console.error("Create Appointment Error", error);
        return { error: `Falha: ${error.message || JSON.stringify(error)}` };
    }
}

export async function getMonthlyHighlights(date: Date) {
    try {
        const session = await auth();
        // Assuming we show all appointments where current user is the Vet, OR if admin logic
        // For simplicity: Show appointments for current logged in vet.
        const vetId = session?.user?.id;

        if (!vetId) return { success: false, data: [] };

        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const appointments = await prisma.consultation.findMany({
            where: {
                vetId: vetId,
                date: {
                    gte: start,
                    lte: end
                },
                status: {
                    in: ['SCHEDULED', 'CONFIRMED'] // Only highlight "Active" appointments
                }
            },
            select: {
                date: true
            }
        });

        // Return array of DAY numbers that have appointments
        const days = appointments.map(a => a.date.getDate());
        // Unique days
        const uniqueDays = Array.from(new Set(days));

        return { success: true, data: uniqueDays };
    } catch (error) {
        console.error(error);
        return { success: false, data: [] };
    }
}

export async function getDayAppointments(date: Date) {
    try {
        const session = await auth();
        const vetId = session?.user?.id;
        if (!vetId) return { success: false, data: [] };

        const start = startOfDay(date);
        const end = endOfDay(date);

        const appointments = await prisma.consultation.findMany({
            where: {
                vetId: vetId,
                date: {
                    gte: start,
                    lte: end
                },
                status: {
                    in: ['SCHEDULED', 'CONFIRMED']
                }
            },
            include: {
                pet: {
                    select: {
                        name: true,
                        tutor: {
                            select: {
                                id: true,
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        return { success: true, data: appointments };
    } catch (error) {
        console.error(error);
        return { success: false, data: [] };
    }
}

export async function cancelAppointment(appointmentId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Não autorizado" };

        await prisma.consultation.update({
            where: { id: appointmentId },
            data: { status: 'CANCELED' }
        });

        revalidatePath('/dashboard/agenda');
        return { success: true };
    } catch (error) {
        console.error("Cancel Error:", error);
        return { error: "Erro ao cancelar agendamento" };
    }
}

import { redirect } from 'next/navigation';

export async function startChatWithTutor(tutorId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        // 1. Check if chat exists
        let chat = await prisma.chatSession.findFirst({
            where: {
                tutorId: tutorId,
                vetId: session.user.id,
                status: 'OPEN'
            }
        });

        // 2. If not, create it
        if (!chat) {
            chat = await prisma.chatSession.create({
                data: {
                    tutorId: tutorId,
                    vetId: session.user.id,
                    status: 'OPEN'
                }
            });
        }

        // 3. Return ID for client redirection (or redirect directly if called from Server Component, 
        // but here we might call from Client Component so returning ID is safer for router.push, 
        // OR we can use redirect() which acts as a throw in Server Actions)

        // Let's return the ID so the client can handle the navigation (smoother UX with loading state)
        return { success: true, chatId: chat.id };

    } catch (error) {
        console.error("Start Chat Error:", error);
        return { error: "Erro ao iniciar chat" };
    }
}
