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
    const name = formData.get("name");
    const img_profile = formData.get("img_profile");
    const number_no = formData.get("number_no");
    const department = formData.get("department");
    const class_room = formData.get("class_room");
    const party_policies = formData.get("party_policies");
    const party_details = formData.get("party_details");
    const img_work = formData.get("img_work");

    if (
      !name ||
      !img_profile ||
      !number_no ||
      !department ||
      !class_room ||
      !party_policies ||
      !party_details ||
      !img_work
    ) {
      return NextResponse.json({ message: "Missing fields", status: 400 });
    }

    await connectMongoDB();

    // คำนวณลำดับ ID โดยนับจำนวนเอกสารในฐานข้อมูล
    const postCount = await Post.countDocuments({});
    const profileFilename = `P${(postCount + 1).toString().padStart(11, '0')}`;
    const workFilename = `W${(postCount + 1).toString().padStart(11, '0')}`;

    // ดึงนามสกุลไฟล์จาก input (เช่น .jpg, .png)
    const profileExt = path.extname(img_profile.name).toLowerCase(); // นามสกุลไฟล์ของ img_profile
    const workExt = path.extname(img_work.name).toLowerCase(); // นามสกุลไฟล์ของ img_work

    // สร้างชื่อไฟล์ใหม่พร้อมนามสกุล
    const profileFileWithExt = profileFilename + profileExt; // เช่น P00000000001.jpg
    const workFileWithExt = workFilename + workExt; // เช่น W00000000001.png

    const profileBuffer = Buffer.from(await img_profile.arrayBuffer());
    const workBuffer = Buffer.from(await img_work.arrayBuffer());

    // บันทึกไฟล์ในโฟลเดอร์
    await writeFile(
      path.join(process.cwd(), "public/assets/election/profile", profileFileWithExt),
      profileBuffer
    );

    await writeFile(
      path.join(process.cwd(), "public/assets/election/work", workFileWithExt),
      workBuffer
    );

    // สร้างข้อมูลในฐานข้อมูล
    await Post.create({
      name,
      img_profile: profileFileWithExt,
      number_no,
      department,
      class_room,
      party_policies,
      party_details,
      img_work: workFileWithExt,
    });

    return NextResponse.json({ message: "Success", status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", status: 500 });
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

    const imgPath = path.join(
      process.cwd(),
      "public/assets/election/profile",
      post.img
    );

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
