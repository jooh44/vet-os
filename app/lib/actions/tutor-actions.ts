'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';

const UpdateTutorSchema = z.object({
    id: z.string(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
});

export async function updateTutor(formData: FormData) {
    const rawData = {
        id: formData.get('id'),
        phone: formData.get('phone'),
        cpf: formData.get('cpf'),
        address: formData.get('address'),
        notes: formData.get('notes'),
    };

    const result = UpdateTutorSchema.safeParse(rawData);

    if (!result.success) {
        return { error: 'Dados inválidos' };
    }

    const { id, phone, cpf, address, notes } = result.data;

    try {
        await prisma.tutor.update({
            where: { id },
            data: {
                phone: phone || undefined,
                cpf: cpf || undefined,
                address: address || undefined,
            },
        });

        revalidatePath(`/dashboard/tutors/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update tutor:', error);
        return { error: 'Falha ao atualizar tutor' };
    }
}

export async function deleteTutor(id: string) {
    const session = await auth();
    if (!session?.user) {
        return { success: false, message: 'Não autorizado.' };
    }

    try {
        await prisma.$transaction(async (tx: any) => {
            // 1. Get Tutor with User ID
            const tutor = await tx.tutor.findUnique({
                where: { id },
                select: { userId: true, createdByVetId: true }
            });

            if (!tutor) throw new Error("Tutor not found");

            // Verify Ownership
            const user = session.user as any;
            const role = user.role;
            const currentUserId = user.id;

            if (role === 'VET') {
                if (tutor.createdByVetId && tutor.createdByVetId !== currentUserId) {
                    throw new Error("Unauthorized: You can only delete Tutors you created.");
                }
            }

            // 2. Chat System Cleanup
            const sessions = await tx.chatSession.findMany({
                where: { tutorId: id },
                select: { id: true }
            });
            const sessionIds = sessions.map((s: any) => s.id);

            if (sessionIds.length > 0) {
                await tx.chatMessage.deleteMany({
                    where: { sessionId: { in: sessionIds } }
                });
                await tx.chatSession.deleteMany({
                    where: { id: { in: sessionIds } }
                });
            }

            // 3. Pet System Cleanup
            const pets = await tx.pet.findMany({
                where: { tutorId: id },
                select: { id: true }
            });
            const petIds = pets.map((p: any) => p.id);

            if (petIds.length > 0) {
                await tx.vaccine.deleteMany({
                    where: { petId: { in: petIds } }
                });

                const consultations = await tx.consultation.findMany({
                    where: { petId: { in: petIds } },
                    select: { id: true }
                });
                const consultIds = consultations.map((c: any) => c.id);

                if (consultIds.length > 0) {
                    await tx.document.deleteMany({
                        where: { consultationId: { in: consultIds } }
                    });

                    await tx.consultation.deleteMany({
                        where: { id: { in: consultIds } }
                    });
                }

                await tx.pet.deleteMany({
                    where: { id: { in: petIds } }
                });
            }

            // 4. Delete Tutor Profile
            await tx.tutor.delete({
                where: { id }
            });

            // 5. Delete User Account
            if (tutor.userId) {
                await tx.user.delete({
                    where: { id: tutor.userId }
                });
            }
        });

        revalidatePath('/dashboard/tutors');
        revalidatePath('/dashboard/patients');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete tutor:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Falha ao excluir tutor.' };
    }
}
