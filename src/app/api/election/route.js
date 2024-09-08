import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/election";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const img = formData.get('img');
    const number_no = formData.get('number_no');

    if (!title || !img || !number_no) {
      return NextResponse.json({ Message: "Missing fields", status: 400 });
    }

    await connectMongoDB();
    const imgFilename = img.name.replaceAll(" ", "_");
    const buffer = Buffer.from(await img.arrayBuffer());

    await writeFile(
      path.join(process.cwd(), "public/assets", imgFilename),
      buffer
    );

    await Post.create({ title, img: imgFilename, number_no });

    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}

export async function GET() {
  await connectMongoDB();
  const posts = await Post.find({});
  return NextResponse.json({ posts });
}