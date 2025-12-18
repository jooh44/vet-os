import { supabaseAdmin } from '@/lib/supabase';

// Standard bucket for the application
const BUCKET_NAME = 'vetos-public';

/**
 * Uploads a file to Supabase Storage using admin client.
 * @param file The file object to upload
 * @param folder The folder path (e.g. 'pets', 'tutors')
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(file: File, folder: string = 'pets'): Promise<string> {
    try {
        const fileExt = file.name.split('.').pop();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '-');
        const fileName = `${folder}/${Date.now()}-${cleanFileName}.${fileExt}`;

        // Convert File to ArrayBuffer for server-side upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Upload using admin client (service role key)
        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Upload Error:', error);

            if (error.message.includes('bucket not found') || error.message.includes('Bucket not found')) {
                throw new Error(`Bucket '${BUCKET_NAME}' não existe no Supabase. Crie-o como 'Public' no dashboard.`);
            }
            throw error;
        }

        // 2. Get Public URL
        const { data: publicUrlData } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;

    } catch (error) {
        console.error('UploadFile Failed:', error);
        throw error;
    }
}

// Legacy export if needed
export const initMinio = async () => {
    console.log("Storage initialized (Supabase)");
};
