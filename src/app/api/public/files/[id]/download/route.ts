import { NextRequest, NextResponse } from 'next/server';
import File from '@/models/File';
import connectDB from '@/lib/mongodb';
import { getFileSignedUrl } from '@/lib/s3';
import { generatePreviewConfig } from '@/lib/previewHandler';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        await connectDB();

        const file = await File.findByIdAndUpdate(
            id,
            { $inc: { downloads: 1 } },
            { new: true }
        );

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        const signedUrl = await getFileSignedUrl(file.s3Key);
        const fileData = file.toObject();
        fileData.fileUrl = signedUrl;

        fileData.preview = generatePreviewConfig(
            fileData.category,
            signedUrl,
            fileData.mimeType
        );

        return NextResponse.json(fileData)
    } catch (error) {
        console.error('Error processing file download: ', error);
        return NextResponse.json({ error: 'Failed to process download' }, { status: 500 })
    }
} 