import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceKey);

async function testUpload() {
    // Create a minimal valid PNG (1x1 pixel transparent)
    const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const fileName = `pets/test-${Date.now()}.png`;
    
    console.log('Testing upload of PNG to vetos-public bucket...');
    
    const { data, error } = await supabase.storage
        .from('vetos-public')
        .upload(fileName, pngBuffer, {
            contentType: 'image/png',
            upsert: false
        });
    
    if (error) {
        console.error('Upload Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Upload Success:', data);
        
        const { data: urlData } = supabase.storage
            .from('vetos-public')
            .getPublicUrl(fileName);
        
        console.log('Public URL:', urlData.publicUrl);
    }
}

testUpload();
