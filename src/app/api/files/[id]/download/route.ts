import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import File from '@/models/File';
import connectDB from '@/lib/mongodb';
import { getFileSignedUrl } from '@/lib/s3';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB();

        const file = await File.findByIdAndUpdate(
            id,
            { $inc: { downloads: 1 } },
            { new: true }
        ).populate('uploadedBy', 'name email');

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        const signedUrl = await getFileSignedUrl(file.s3Key);

        return NextResponse.json({
            file: {
                title: file.title,
                description: file.description,
                downloads: file.downloads,
                uploadedBy: file.uploadedBy,
                createdAt: file.createdAt,
            },
            downloadUrl: signedUrl,
        })
    } catch (error) {
        console.error('Error processing file: ', error);
        return NextResponse.json({ error: 'Failed to process download' }, { status: 500 })
    }
}