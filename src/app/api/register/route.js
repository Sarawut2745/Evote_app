import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
       
        const { name, user_type } = await req.json();

        await connectMongoDB();
        await User.create({ name, user_type });
       
        return NextResponse.json({ message: "User registered." }, { status: 201 });

    } catch (error) {
        console.error("Error registering user: ", error);
        return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
    }
}
