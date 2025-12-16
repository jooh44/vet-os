import * as Minio from 'minio';

const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;

if (process.env.NODE_ENV === 'production' && (!accessKey || !secretKey)) {
    console.error('CRITICAL SECURITY WARNING: MinIO credentials missing in production!');
}

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: accessKey || 'minioadmin',
    secretKey: secretKey || 'minioadmin',
});


const BUCKET_NAME = process.env.MINIO_BUCKET || 'fred-storage';

export const initMinio = async () => {
    try {
        const exists = await minioClient.bucketExists(BUCKET_NAME);
        if (!exists) {
            await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
            console.log(`Bucket ${BUCKET_NAME} created successfully`);

            // Set Policy to Public Read
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                    }
                ]
            };
            await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
            console.log(`Bucket policy set to public read`);
        } else {
            console.log(`Bucket ${BUCKET_NAME} already exists`);
        }
    } catch (error) {
        console.error('Error initializing MinIO:', error);
    }
};

export async function uploadFile(file: File, folder: string = 'pets'): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    // Ensure bucket exists
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                }
            ]
        };
        await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }

    await minioClient.putObject(BUCKET_NAME, filename, buffer, file.size);

    // Construct local MinIO URL or public URL
    // Since we are in Docker, we might need to handle localhost vs container host
    // For now, assuming localhost access for the user browser
    return `http://localhost:9000/${BUCKET_NAME}/${filename}`;
}

export { minioClient, BUCKET_NAME };
