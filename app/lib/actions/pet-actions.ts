'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const UpdatePetSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Nome é obrigatório"),
    species: z.string().min(1, "Espécie é obrigatória"),
    breed: z.string().optional(),
    weight: z.string().optional(), // Receive as string from form, convert to float
    birthDate: z.string().optional(), // Receive as string YYYY-MM-DD
    notes: z.string().optional(),
    allergies: z.string().optional(), // Assuming simple string or comma-separated
});

export async function updatePet(formData: FormData) {
    const rawData = {
        id: formData.get('id'),
        name: formData.get('name'),
        species: formData.get('species'),
        breed: formData.get('breed'),
        weight: formData.get('weight'),
        birthDate: formData.get('birthDate'),
        notes: formData.get('notes'),
        allergies: formData.get('allergies'),
    };

    const result = UpdatePetSchema.safeParse(rawData);

    if (!result.success) {
        return { error: 'Dados inválidos' };
    }

    const { id, name, species, breed, weight, birthDate, notes, allergies } = result.data;

    try {
        await prisma.pet.update({
            where: { id },
            data: {
                name,
                species: species as any, // Cast to any or import Species enum if available
                breed: breed || null,
                weight: weight ? parseFloat(weight.replace(',', '.')) : null,
                birthDate: birthDate ? new Date(birthDate) : null,
                notes: notes || null,
                allergies: allergies || null,
            },
        });

        revalidatePath(`/dashboard/pets/${id}`);
        // Also revalidate the tutor page as it lists pets
        // However, accessing the tutor ID here would require an extra query or passing it in.
        // For now, revalidate the pet page is strictly required.

        return { success: true };
    } catch (error) {
        console.error('Failed to update pet:', error);
        return { error: 'Falha ao atualizar pet' };
    }
}

export async function deletePet(id: string) {
    try {
        await prisma.$transaction(async (tx: any) => {
            // 1. Delete Medical Records
            await tx.medicalRecord.deleteMany({
                where: { petId: id }
            });

            // 2. Delete Appointments
            await tx.appointment.deleteMany({
                where: { petId: id }
            });

            // 3. Delete Pet
            await tx.pet.delete({
                where: { id }
            });
        });

        revalidatePath('/dashboard/patients');
        revalidatePath('/dashboard/tutors');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete pet:', error);
        return { success: false, message: 'Falha ao excluir pet.' };
    }
}
