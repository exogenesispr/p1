import mongoose from 'mongoose';
import { FileCategory } from '@/lib/fileValidation';

export interface IFile {
    title: string;
    description: string;
    category: FileCategory;
    mimeType: string;
    fileUrl: string | null;
    s3Key: string | null;
    uploadedBy: mongoose.Types.ObjectId;
    downloads: number;
    status: 'pending' | 'active' | 'error';
    createdAt: Date;
    updatedAt: Date;
}

const fileSchema = new mongoose.Schema<IFile>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        category: {
            type: String,
            enum: ['image', 'video', 'audio', 'document', 'archive', 'other'],
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: function (this: { status: string }) {
                return this.status === 'active'
            },
        },
        s3Key: {
            type: String,
            required: function (this: { status: string }) {
                return this.status === 'active'
            },
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        downloads: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'error'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.File || mongoose.model<IFile>('File', fileSchema); 