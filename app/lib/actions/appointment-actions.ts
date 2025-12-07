'use server';

import prisma from '@/lib/prisma';
import { Appointment, AppointmentType, AppointmentStatus, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { startOfMonth, endOfMonth } from 'date-fns';

export type CreateAppointmentData = {
    title: string;
    startTime: string | Date;
    endTime: string | Date;
    type: AppointmentType;
    vetId?: string;
    petId?: string;
    notes?: string;
};

export async function createAppointment(data: CreateAppointmentData) {
    console.log("[SERVER ACTION] createAppointment called with:", JSON.stringify(data));
    try {
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        // Basic validation
        if (startTime >= endTime) {
            return { error: 'Start time must be before end time' };
        }

        const appointment = await prisma.appointment.create({
            data: {
                title: data.title,
                startTime,
                endTime,
                type: data.type,
                status: AppointmentStatus.CONFIRMED, // Default to confirmed for now
                vetId: data.vetId,
                petId: data.petId,
                notes: data.notes,
            },
        });

        revalidatePath('/dashboard/agenda');
        return { success: true, data: appointment };

    } catch (error) {
        console.error('Failed to create appointment:', error);
        return { error: 'Failed to create appointment' };
    }
}

export async function getDailyAppointments(date: Date) {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                pet: {
                    select: {
                        name: true,
                        tutor: {
                            select: {
                                user: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        return { success: true, data: appointments };

    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return { error: 'Failed to fetch appointments' };
    }
}

export async function getMonthlyHighlights(date: Date) {
    try {
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const appointments = await prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: start,
                    lte: end,
                },
            },
            select: {
                startTime: true,
            },
        });

        // Group by day to get unique days with events
        const daysWithEvents = new Set(
            appointments.map((a: { startTime: Date }) => a.startTime.getDate())
        );

        return { success: true, data: Array.from(daysWithEvents) };
    } catch (error) {
        console.error('Failed to fetch highlights:', error);
        return { error: 'Failed to fetch highlights' };
    }
}
