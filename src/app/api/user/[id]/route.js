import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const user = await User.findById(params.id); // Using params.id from dynamic route
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const userData = await req.json();
    await connectMongoDB();
    const updatedUser = await User.findByIdAndUpdate(params.id, userData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}