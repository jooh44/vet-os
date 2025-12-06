require('dotenv').config();
const Minio = require('minio');

const client = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

async function main() {
    const bucket = process.env.MINIO_BUCKET || 'fred-storage';
    try {
        console.log(`Checking bucket: ${bucket}...`);
        const exists = await client.bucketExists(bucket);
        if (exists) {
            console.log(`Bucket ${bucket} already exists.`);
        } else {
            console.log(`Creating bucket ${bucket}...`);
            await client.makeBucket(bucket, 'us-east-1');
            console.log(`Bucket ${bucket} created.`);
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${bucket}/*`]
                    }
                ]
            };
            await client.setBucketPolicy(bucket, JSON.stringify(policy));
            console.log('Policy set to Public Read.');
        }
    } catch (e) {
        console.error('Error setting up MinIO:', e);
        process.exit(1);
    }
}

main();
