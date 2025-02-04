import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { users } = await req.json();

    console.log("Received Users:", users); // Log received users for debugging

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    const errors = [];
    for (const user of users) {
      if (!user.name || !user.posonal_number || !user.user_type) {
        errors.push(`Missing required fields for user: ${JSON.stringify(user)}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ message: 'Validation errors', errors }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await User.find({
      $or: users.map(user => ({ $or: [{ name: user.name }, { posonal_number: user.posonal_number }] }))
    });

    console.log("Existing Users Found:", existingUsers); // Log existing users for debugging

    if (existingUsers.length > 0) {
      return NextResponse.json({ 
        message: 'Some users already exist', 
        existingUsers: existingUsers.map(user => ({ name: user.name, posonal_number: user.posonal_number }))
      }, { status: 400 });
    }

    // Insert new users
    const newUsers = await User.insertMany(users);
    return NextResponse.json({ message: 'Users imported successfully', imported: newUsers.length }, { status: 201 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: 'Failed to import users', error: error.message }, { status: 500 });
  }
}
