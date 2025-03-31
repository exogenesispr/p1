import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import File from '@/models/File';
import connectDB from '@/lib/mongodb';
import { deleteFileFromS3, getFileSignedUrl } from '@/lib/s3';

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
        const file = await File.findById(id)
            .populate('uploadedBy', 'name email')

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        const signedUrl = await getFileSignedUrl(file.s3Key);
        const fileData = file.toObject();
        fileData.fileUrl = signedUrl;

        return NextResponse.json(fileData)

    } catch (error) {
        console.error('Error fetching file: ', error)
        return NextResponse.json(
            { error: 'Failed to fetch file' },
            { status: 500 }
        )
    }
}

export async function DELETE(
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
        const file = await File.findById(id)

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        await deleteFileFromS3(file.s3Key);

        await file.deleteOne();

        return NextResponse.json({ message: 'File deleted successfully' })
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        )
    }
}
