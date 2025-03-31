import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3UploadResult, S3FileParams, S3ListResult } from '@/types/s3';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
    throw new Error('Missing AWS credentials in environment variables')
}

// Init S3 client

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

// Upload file to S3
export async function uploadFileToS3({ fileName, fileType, file }: S3FileParams): Promise<S3UploadResult> {
    try {
        const key = `uploads/${Date.now()} - ${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: fileType,
        })

        await s3Client.send(command);

        const url = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }), { expiresIn: 3600 });

        return {
            fileUrl: url,
            key: key,
        };
    } catch (error) {
        console.error('Error uploading file to S3: ', error)
        throw new Error('Failed to upload file to S3')
    }
}

// Get signed URL for file access
export async function getFileSignedUrl(key: string): Promise<string> {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });

        return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
        console.error('Error generating signed URL: ', error)
        throw new Error('Failed to generate file URL')
    }
}

// Delete file from S3
export async function deleteFileFromS3(key: string): Promise<void> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting file from S3: ', error)
        throw new Error('Failed to delete file from S3')
    }
}

// List files in S3 bucket
export async function listFiles(prefix?: string): Promise<S3ListResult> {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: prefix,
        });

        const response = await s3Client.send(command);

        const files = await Promise.all((response.Contents || []).map(async (item) => ({
            key: item.Key!,
            url: await getFileSignedUrl(item.Key!),
            lastModified: item.LastModified,
            size: item.Size,
        })));

        return { files }
    } catch (error) {
        console.error('Error listing files in S3: ', error)
        throw new Error('Failed to list files from S3')
    }
}