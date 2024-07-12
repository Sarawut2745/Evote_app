import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { name } = await req.json();
        const user = await User.findOne({ name }).select("_id");
        console.log("User: ", user);

        return NextResponse.json({ user });

    } catch(error) {
        console.error("Error checking user: ", error);
        return NextResponse.json({ message: "An error occurred while checking the user." }, { status: 500 });
    }
}
