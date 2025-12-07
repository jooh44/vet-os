'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 5MB' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Ignore error if directory already exists
        }

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filepath = join(uploadDir, filename);

        // Write file to disk
        await writeFile(filepath, buffer);

        // Update database
        const publicPath = `/uploads/${filename}`;
        await prisma.pet.update({
            where: { id: petId },
            data: { photoUrl: publicPath }
        });

        revalidatePath(`/dashboard/pets/${petId}`);
        return { success: true, photoUrl: publicPath };

    } catch (error) {
        console.error('Error uploading photo:', error);
        return { success: false, error: 'Failed to upload photo' };
    }
}
