
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase Credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = 'vetos-public';

async function testStorage() {
    console.log(`Testing Storage Bucket: ${BUCKET}`);

    // 1. Upload Test File (Image)
    const fileName = `debug_test_${Date.now()}.png`;
    console.log(`Uploading ${fileName}...`);

    // Create a simple 1x1 transparent PNG buffer
    const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, pngBuffer, { contentType: 'image/png' });

    if (uploadError) {
        console.error("❌ Upload Failed:", uploadError);
        return;
    }
    console.log("✅ Upload Successful:", uploadData);

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

    console.log(`Public URL: ${urlData.publicUrl}`);

    // 3. Verify Access (Fetch)
    try {
        const response = await fetch(urlData.publicUrl);
        if (response.ok) {
            console.log("✅ Fetch Verified. Status:", response.status);
        } else {
            console.error(`❌ Fetch Failed: Status ${response.status} ${response.statusText}`);
        }
    } catch (e) {
        console.error("❌ Fetch Exception:", e);
    }
}

testStorage();
