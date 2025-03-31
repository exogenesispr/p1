import mongoose from 'mongoose';

export interface IFile {
    title: string;
    description: string;
    category: string;
    fileUrl: string;
    s3Key: string;
    uploadedBy: mongoose.Types.ObjectId;
    downloads: number;
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
            required: [true, 'Please provide a category'],
        },
        fileUrl: {
            type: String,
            required: [true, 'File URL is required'],
        },
        s3Key: {
            type: String,
            required: [true, 'S3 key is required'],
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
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.File || mongoose.model<IFile>('File', fileSchema); 