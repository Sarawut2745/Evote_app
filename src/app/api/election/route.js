import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/election";
import Scores from "../../../../models/scores_el";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const img = formData.get("img");
    const number_no = formData.get("number_no");

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

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });
    }

    await connectMongoDB();

    // ค้นหา Post โดย ID
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await Post.findByIdAndDelete(id);


    await Scores.deleteMany({ number_no: post.number_no });

    const imgPath = path.join(process.cwd(), "public/assets", post.img);

    try {
      await unlink(imgPath);
      console.log(`File ${imgPath} deleted successfully`);
    } catch (fileError) {
      console.error(`Failed to delete file ${imgPath}:`, fileError);
    }

    return NextResponse.json(
      { message: "Post, related scores, and file deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
}
