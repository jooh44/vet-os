'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updatePetMedicalInfo(petId: string, data: { allergies?: string; notes?: string }) {
    try {
        await prisma.pet.update({
            where: { id: petId },
            data: {
                allergies: data.allergies,
                notes: data.notes
            }
        });

        revalidatePath(`/dashboard/pets/${petId}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating pet medical info:', error);
        return { success: false, error: 'Failed to update pet information' };
    }
}
