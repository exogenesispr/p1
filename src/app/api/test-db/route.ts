import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
    try {
        await connectDB();

        return NextResponse.json(
            {message: "Connected to MongoDB"},
            {status: 200}
        );
    } catch (error) {
        console.error('Database connection error: ', error);
        return NextResponse.json(
            {error: 'Failed to connect to database'},
            {status: 500}
        )
    }
}