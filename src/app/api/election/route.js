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
    const personal_ip = formData.get("personal_ip");
    const img_profile = formData.get("img_profile");
    const number_no = formData.get("number_no");
    const department = formData.get("department");
    const class_room = formData.get("class_room");
    const party_policies = formData.get("party_policies");
    const party_details = formData.get("party_details");
    const img_work = formData.get("img_work");

    if (
      !name ||
      !personal_ip ||
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
    const profileFilename = `P${(postCount + 1).toString().padStart(11, "0")}`;
    const workFilename = `W${(postCount + 1).toString().padStart(11, "0")}`;

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
      path.join(
        process.cwd(),
        "public/assets/election/profile",
        profileFileWithExt
      ),
      profileBuffer
    );

    await writeFile(
      path.join(process.cwd(), "public/assets/election/work", workFileWithExt),
      workBuffer
    );

    // สร้างข้อมูลในฐานข้อมูล
    await Post.create({
      name,
      personal_ip,
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

    // ลบ Post จากฐานข้อมูล
    await Post.findByIdAndDelete(id);

    // ลบข้อมูลคะแนนที่เกี่ยวข้อง
    await Scores.deleteMany({ number_no: post.number_no });

    // ลบไฟล์รูปภาพ
    const imgProfilePath = path.join(
      process.cwd(),
      "public/assets/election/profile",
      post.img_profile
    );

    const imgWorkPath = path.join(
      process.cwd(),
      "public/assets/election/work",
      post.img_work
    );

    // ลบไฟล์โปรไฟล์
    try {
      await unlink(imgProfilePath);
      console.log(`Profile image file ${imgProfilePath} deleted successfully`);
    } catch (fileError) {
      console.error(
        `Failed to delete profile image: ${imgProfilePath}`,
        fileError
      );
    }

    // ลบไฟล์งาน
    try {
      await unlink(imgWorkPath);
      console.log(`Work image file ${imgWorkPath} deleted successfully`);
    } catch (fileError) {
      console.error(`Failed to delete work image: ${imgWorkPath}`, fileError);
    }

    return NextResponse.json(
      { message: "Post, related scores, and files deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
}
