'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/storage';

export async function uploadPetPhoto(petId: string, formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No file uploaded' };
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'File must be an image' };
        }

        // Validate file size (max 5MB - Supabase bucket limit)
        if (file.size > 5 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 5MB' };
        }

        console.log('[uploadPetPhoto] Uploading file to Supabase:', file.name, file.type, file.size);

        // Upload to Supabase Storage
        const photoUrl = await uploadFile(file, 'pets');

        console.log('[uploadPetPhoto] Upload successful:', photoUrl);

        // Update database
        await prisma.pet.update({
            where: { id: petId },
            data: { photoUrl }
        });

        revalidatePath(`/dashboard/pets/${petId}`);
        return { success: true, photoUrl };

    } catch (error) {
        console.error('[uploadPetPhoto] Error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to upload photo' };
    }
}
