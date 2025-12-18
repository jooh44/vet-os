
import { supabase } from '@/lib/supabase';

// Standard bucket for the application
const BUCKET_NAME = 'vetos-public';

/**
 * Uploads a file to Supabase Storage.
 * @param file The file object to upload
 * @param folder The folder path (e.g. 'pets', 'tutors')
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(file: File, folder: string = 'pets'): Promise<string> {
    try {
        const fileExt = file.name.split('.').pop();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '-');
        const fileName = `${folder}/${Date.now()}-${cleanFileName}.${fileExt}`;

        // 1. Upload
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Upload Error:', error);

            // Handle "Bucket not found" specifically if possible, but usually it's just an error object
            if (error.message.includes('bucket not found')) {
                throw new Error(`Bucket '${BUCKET_NAME}' não existe no Supabase. Crie-o como 'Public' no dashboard.`);
            }
            throw error;
        }

        // 2. Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;

    } catch (error) {
        console.error('UploadFile Failed:', error);
        throw error;
    }
}

// Legacy export if needed, or just dummy
export const initMinio = async () => {
    // No-op for Supabase replacement
    console.log("Storage initialized (Supabase)");
};
