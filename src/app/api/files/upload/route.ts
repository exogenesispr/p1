import { NextRequest, NextResponse } from 'next/server';
import { deleteFileFromS3, uploadFileToS3 } from '@/lib/s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import File from '@/models/File';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    let createdFile = null;
    let uploadedS3Key = null;

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

        await connectDB();
        createdFile = await File.create({
            title,
            description,
            category,
            fileUrl: null,
            s3Key: null,
            uploadedBy: session.user.id,
            status: 'pending',
        });

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name
        const fileType = file.type

        const { fileUrl, key } = await uploadFileToS3({
            fileName,
            fileType,
            file: buffer
        })
        uploadedS3Key = key;

        await connectDB();
        const updatedFile = await File.findByIdAndUpdate(
            createdFile._id,
            {
                fileUrl,
                s3Key: key,
                status: 'active',
            },
            { new: true }
        );

        return NextResponse.json(updatedFile, { status: 201 })

    } catch (error) {
        console.error('Error uploading file: ', error)

        if (uploadedS3Key) {
            try {
                await deleteFileFromS3(uploadedS3Key);
            } catch (cleanupError) {
                console.error('Error cleaning up S3: ', cleanupError)
            }
        }

        if (createdFile) {
            try {
                await File.findByIdAndUpdate(createdFile._id, { status: 'error' });
            } catch (cleanupError) {
                console.error('Error updating file status: ', cleanupError)
            }
        }

        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}