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
    const name = formData.get('name');
    const personal_ip = formData.get("personal_ip")
    const img_profile = formData.get('img_profile');
    const number_no = formData.get('number_no');
    const department = formData.get('department');
    const class_room = formData.get('class_room');
    const party_policies = formData.get('party_policies');
    const party_details = formData.get('party_details');
    const img_work = formData.get('img_work');

    // ตรวจสอบว่าฟิลด์สำคัญถูกกรอกครบ
    if (
      !name ||
      !personal_ip ||
      !number_no ||
      !department ||
      !class_room ||
      !party_policies ||
      !party_details
    ) {
      return NextResponse.json({ Message: "Missing fields", status: 400 });
    }

    await connectMongoDB();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ Message: "Post not found", status: 404 });
    }

    let profileImgFilename = post.img_profile; // ตั้งชื่อไฟล์โปรไฟล์เริ่มต้น
    let workImgFilename = post.img_work; // ตั้งชื่อไฟล์งานเริ่มต้น

    // อัพเดตไฟล์โปรไฟล์ (ถ้ามีการอัพโหลดไฟล์ใหม่)
    if (img_profile) {
      profileImgFilename = `P${(Date.now()).toString().padStart(11, '0')}` + path.extname(img_profile.name);
      const profileBuffer = Buffer.from(await img_profile.arrayBuffer());

      // สร้างไดเรกทอรีและบันทึกไฟล์ใหม่
      const profileDir = path.join(process.cwd(), "public/assets/election/profile");
      await mkdir(profileDir, { recursive: true });
      await writeFile(path.join(profileDir, profileImgFilename), profileBuffer);

      // ลบไฟล์เก่าหากต่างจากไฟล์ใหม่
      if (post.img_profile && post.img_profile !== profileImgFilename) {
        const oldProfileImgPath = path.join(profileDir, post.img_profile);
        try {
          await fs.access(oldProfileImgPath); // ตรวจสอบว่าไฟล์เก่าอยู่หรือไม่
          await unlink(oldProfileImgPath); // ลบไฟล์เก่า
          console.log(`Successfully deleted old profile image: ${oldProfileImgPath}`);
        } catch (err) {
          console.error(`Error deleting old profile image: ${oldProfileImgPath}`, err);
        }
      }
    }

    // อัพเดตไฟล์งาน (ถ้ามีการอัพโหลดไฟล์ใหม่)
    if (img_work) {
      workImgFilename = `W${(Date.now()).toString().padStart(11, '0')}` + path.extname(img_work.name);
      const workBuffer = Buffer.from(await img_work.arrayBuffer());

      // สร้างไดเรกทอรีและบันทึกไฟล์ใหม่
      const workDir = path.join(process.cwd(), "public/assets/election/work");
      await mkdir(workDir, { recursive: true });
      await writeFile(path.join(workDir, workImgFilename), workBuffer);

      // ลบไฟล์เก่าหากต่างจากไฟล์ใหม่
      if (post.img_work && post.img_work !== workImgFilename) {
        const oldWorkImgPath = path.join(workDir, post.img_work);
        try {
          await fs.access(oldWorkImgPath); // ตรวจสอบว่าไฟล์เก่าอยู่หรือไม่
          await unlink(oldWorkImgPath); // ลบไฟล์เก่า
          console.log(`Successfully deleted old work image: ${oldWorkImgPath}`);
        } catch (err) {
          console.error(`Error deleting old work image: ${oldWorkImgPath}`, err);
        }
      }
    }

    // อัพเดตข้อมูลในฐานข้อมูล
    const updatedPost = await Post.findByIdAndUpdate(id, {
      name,
      personal_ip,
      img_profile: profileImgFilename,
      img_work: workImgFilename,
      number_no,
      department,
      class_room,
      party_policies,
      party_details
    }, { new: true });

    return NextResponse.json({ Message: "Post updated", updatedPost, status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}
