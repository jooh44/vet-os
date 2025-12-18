
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupBucket() {
    const bucketName = 'vetos-public';

    const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

    if (error) {
        if (error.message.includes("already exists")) {
            console.log(`Bucket '${bucketName}' already exists.`);
            // Update to public just in case
            await supabase.storage.updateBucket(bucketName, { public: true });
            console.log("Bucket updated to public.");
        } else {
            console.error("Error creating bucket:", error);
        }
    } else {
        console.log(`Bucket '${bucketName}' created successfully.`);
    }
}

setupBucket();
