import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import File from '@/models/File';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;

        if (!file || !title) {
            return NextResponse.json(
                { error: 'File and title are required' },
                { status: 400 }
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name
        const fileType = file.type

        const { fileUrl, key } = await uploadFileToS3({
            fileName,
            fileType,
            file: buffer
        })

        await connectDB();
        const newFile = await File.create({
            title,
            description,
            category,
            fileUrl,
            s3Key: key,
            uploadedBy: session.user.id,
        });

        return NextResponse.json(newFile, { status: 201 })

    } catch (error) {
        console.error('Error uploading file: ', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}