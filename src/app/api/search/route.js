import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/election";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("query");

    if (!searchQuery) {
      return NextResponse.json({ message: "Query not provided" }, { status: 400 });
    }

    await connectMongoDB();

    // Use regex to find posts that match the query in the title field
    const posts = await Post.find({
      title: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ message: "Failed to search", status: 500 });
  }
}
