'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { signIn, auth } from '@/auth';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function getPortalData(accessCode: string) {
    const session = await prisma.chatSession.findUnique({
        where: { accessCode },
        include: {
            tutor: {
                include: {
                    user: true,
                    pets: {
                        include: {
                            vaccines: { orderBy: { date: 'desc' } },
                            consultations: { orderBy: { date: 'desc' }, take: 5 }
                        }
                    }
                }
            },
            vet: { select: { name: true, email: true } },
            messages: { orderBy: { createdAt: 'asc' } }
        }
    });

    if (!session) return null;
    return session;
}

export async function sendGuestMessage(formData: FormData) {
    const content = formData.get('content') as string;
    const accessCode = formData.get('accessCode') as string;
    // const type = formData.get('type') as string || 'TEXT';

    if (!content || !accessCode) return;

    // Validate Session
    const session = await prisma.chatSession.findUnique({
        where: { accessCode },
        include: { tutor: true }
    });

    if (!session) throw new Error('Invalid Session');

    // Create Message (As Tutor)
    await prisma.chatMessage.create({
        data: {
            sessionId: session.id,
            senderId: session.tutor.userId, // Impersonate the Tutor User
            content,
            // type "TEXT" by default
        }
    });

    await prisma.chatSession.update({
        where: { id: session.id },
        data: { updatedAt: new Date() }
    });

    revalidatePath(`/portal/${accessCode}`);
}

export async function getInviteLink(tutorId: string) {
    try {
        const session = await auth();
        /* 
           Strictly link to the Creating Vet. 
           If called by Admin/Attendant, we might need logic. 
           But for now, assume Vet clicks it.
        */
        const vetId = session?.user?.id;

        // Find existing session linked to THIS vet OR any open session?
        // User wants linkage. If session exists with another vet, what happens?
        // "fique vinculado no sistema dele apenas".
        // Let's look for session with THIS vetId.

        let sessionData = await prisma.chatSession.findFirst({
            where: {
                tutorId,
                status: 'OPEN',
                vetId: vetId // Filter by specific vet if logged in
            }
        });

        if (!sessionData) {
            // Check if user exists (sanity check)
            const tutor = await prisma.tutor.findUnique({
                where: { id: tutorId },
                include: { user: true }
            });
            if (!tutor) throw new Error('Tutor não encontrado');

            let finalVetId = vetId;
            if (!finalVetId) {
                const fallbackVet = await prisma.user.findFirst({ where: { role: 'VET' } });
                if (!fallbackVet) throw new Error("Nenhum veterinário disponível.");
                finalVetId = fallbackVet.id;
            }

            // Generate simple code
            const code = `${tutor.user.name.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 1000)}`;

            sessionData = await prisma.chatSession.create({
                data: {
                    tutorId,
                    vetId: finalVetId,
                    accessCode: code,
                    status: 'OPEN'
                }
            });
        }

        return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${sessionData.accessCode}`;
    } catch (error) {
        console.error('Error generating invite link:', error);
        return null;
    }
}

export async function getInviteDetails(accessCode: string) {
    const session = await prisma.chatSession.findFirst({
        where: { accessCode },
        include: {
            tutor: {
                include: { user: true }
            }
        }
    });

    if (!session) return null;

    return {
        name: session.tutor.user.name,
        email: session.tutor.user.email,
        userId: session.tutor.userId
    };
}

export async function activateAccount(formData: FormData) {
    const accessCode = formData.get('accessCode') as string;
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;

    if (password !== confirm) {
        return { success: false, message: 'As senhas não coincidem.' };
    }

    if (password.length < 6) {
        return { success: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
    }

    const session = await prisma.chatSession.findFirst({
        where: { accessCode },
        include: { tutor: { include: { user: true } } }
    });

    if (!session) return { success: false, message: 'Link inválido ou expirado.' };

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: session.tutor.userId },
            data: { password: hashedPassword }
        });

        // Use standard signIn
        await signIn('credentials', {
            email: session.tutor.user.email,
            password: password,
            redirect: false
        });

        return { success: true };
    } catch (error) {
        console.error('Activation Error:', error);
        return { success: false, message: 'Erro ao ativar conta.' };
    }
}
