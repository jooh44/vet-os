'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
    const session = await auth();
    let senderId = session?.user?.id;

    // Dev fallback
    if (!senderId) {
        const fallbackUser = await prisma.user.findFirst();
        if (fallbackUser) senderId = fallbackUser.id;
    }

    if (!senderId) {
        throw new Error('Unauthorized');
    }

    const sessionId = formData.get('sessionId') as string;
    const content = formData.get('content') as string;
    const type = (formData.get('type') as string) || 'TEXT';

    if (!sessionId || !content) {
        throw new Error('Missing fields');
    }

    // Determine type (if file was uploaded, handle logic here - skipping for MVP)

    await prisma.chatMessage.create({
        data: {
            sessionId,
            senderId,
            content,
            content
            // type: "TEXT" - Removed to bypass stale client error (DB has default)
        }
    });

    // Update Session Timestamp
    await prisma.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() }
    });

    revalidatePath(`/dashboard/chat/${sessionId}`);
    revalidatePath(`/dashboard/chat`);
}

export async function startChat(tutorId: string) {
    const session = await auth();
    let vetId = session?.user?.id;
    // Dev fallback
    if (!vetId) {
        const fallbackUser = await prisma.user.findFirst();
        if (fallbackUser) vetId = fallbackUser.id;
    }

    if (!vetId) throw new Error("Unauthorized");

    // Check for existing open session
    const existing = await prisma.chatSession.findFirst({
        where: {
            vetId,
            tutorId,
            status: 'OPEN'
        }
    });

    if (existing) {
        return existing.id;
    }

    // Create new
    const newSession = await prisma.chatSession.create({
        data: {
            vetId,
            tutorId,
            status: 'OPEN'
        }
    });

    return newSession.id;
}
