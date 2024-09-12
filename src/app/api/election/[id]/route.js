import { connectMongoDB } from "../../../../../lib/mongodb";
import Post from "../../../../../models/election";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(req, { params }) {
  const { id } = params;
  try {
    await connectMongoDB();
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
    const { id } = params;
    
    try {
      const formData = await req.formData();
      const title = formData.get('title');
      const img = formData.get('img');
      const number_no = formData.get('number_no');
    
      if (!title || !number_no) {
        return NextResponse.json({ Message: "Missing fields", status: 400 });
      }
    
      await connectMongoDB();
      const post = await Post.findById(id);
      if (!post) {
        return NextResponse.json({ Message: "Post not found", status: 404 });
      }
    
      let imgFilename = post.img; // Default to existing image
      if (img) {
        imgFilename = img.name.replaceAll(" ", "_");
        const buffer = Buffer.from(await img.arrayBuffer());
    
        // Ensure the upload directory exists
        const uploadDir = path.join(process.cwd(), "public/assets");
        await mkdir(uploadDir, { recursive: true });
    
        // Save the new image
        await writeFile(
          path.join(uploadDir, imgFilename),
          buffer
        );
    
        // Delete the old image if it's not the same as the new one
        if (post.img && post.img !== imgFilename) {
          const oldImgPath = path.join(uploadDir, post.img);
          try {
            // Check if the old image exists before attempting to delete
            await fs.access(oldImgPath); 
            await unlink(oldImgPath);
            console.log(`Successfully deleted old image: ${oldImgPath}`);
          } catch (err) {
            if (err.code === 'ENOENT') {
              console.log(`Old image does not exist: ${oldImgPath}`);
            } else {
              console.error(`Error deleting old image: ${oldImgPath}`, err);
            }
          }
        }
      }
    
      // Update post in the database
      const updatedPost = await Post.findByIdAndUpdate(id, { title, img: imgFilename, number_no }, { new: true });
    
      return NextResponse.json({ Message: "Post updated", updatedPost, status: 200 });
    } catch (error) {
      console.error("Error updating post:", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
    }
  }
