import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        // Parse the request body
        const { name, posonal_number, user_type } = await req.json();

        // Log incoming request data
        console.log("Request Data:", { name, posonal_number, user_type });

        // Validate that name and posonal_number are provided
        if (!name || !posonal_number) {
            return NextResponse.json({ message: "Name and posonal_number are required" }, { status: 400 });
        }

        // Connect to MongoDB
        await connectMongoDB();

        // Check if the user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        // Create the new user and log the result
        const newUser = await User.create({
            name,
            posonal_number,  // Ensure posonal_number is being passed correctly
            user_type        // Optional field
        });

        console.log("User New:", JSON.stringify(newUser, null, 2));  // Log the new user

        return NextResponse.json({ message: "User registered." }, { status: 201 });

    } catch (error) {
        console.error("Error registering user: ", error);
        return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
    }
}
