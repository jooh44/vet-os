'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Find all pets
            const pets = await tx.pet.findMany({
                where: { tutorId: id },
                select: { id: true }
            });
            const petIds = pets.map(p => p.id);

            // 2. Delete Medical Records for these pets
            if (petIds.length > 0) {
                await tx.medicalRecord.deleteMany({
                    where: { petId: { in: petIds } }
                });

                // 3. Delete Appointments for these pets
                await tx.appointment.deleteMany({
                    where: { petId: { in: petIds } }
                });

                // 4. Delete Pets
                await tx.pet.deleteMany({
                    where: { tutorId: id }
                });
            }

            // 5. Delete Tutor
            await tx.tutor.delete({
                where: { id }
            });

            // Note: Not deleting User to avoid auth issues for now, unless requested.
        });

        revalidatePath('/dashboard/tutors');
        revalidatePath('/dashboard/patients');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete tutor:', error);
        return { success: false, message: 'Falha ao excluir tutor.' };
    }
}
