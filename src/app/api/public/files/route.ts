import { NextRequest, NextResponse } from 'next/server';
import File from '@/models/File';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        let query: any = {};
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        await connectDB();
        const files = await File.find(query)
            .sort({ createdAt: -1 })
            .select('title description category mimeType downloads createdAt status')
            .lean();

        return NextResponse.json(files)

    } catch (error) {
        console.error('Error fetching public files: ', error)
        return NextResponse.json(
            { error: 'Failed to fetch files' },
            { status: 500 }
        )
    }
} 