import { connectMongoDB } from "../../../../../lib/mongodb"; // เชื่อมต่อกับ MongoDB
import Post from "../../../../../models/election"; // นำเข้าโมเดลการเลือกตั้ง
import path from "path"; // นำเข้า path สำหรับจัดการกับเส้นทางไฟล์
import { writeFile, unlink, mkdir } from "fs/promises"; // ฟังก์ชันสำหรับเขียนไฟล์, ลบไฟล์ และสร้างไดเรกทอรี
import { NextResponse } from "next/server"; // ใช้ NextResponse สำหรับการตอบกลับจาก API
import fs from "fs/promises"; // ใช้ฟังก์ชันต่างๆจาก fs สำหรับจัดการไฟล์

// ฟังก์ชัน GET สำหรับดึงข้อมูลโพสต์ตาม ID
export async function GET(req, { params }) {
  const { id } = params;
  console.log("Fetching post with ID:", id); // Debugging statement
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    const post = await Post.findOne({ _id: id }); // ค้นหาข้อมูลโพสต์ตาม ID
    console.log("Post fetched:", post); // Debugging statement
    if (!post) {
      return NextResponse.json({ error: "ไม่พบโพสต์" }, { status: 404 }); // หากไม่พบโพสต์ ส่งข้อความผิดพลาด
    }
    return NextResponse.json({ post }, { status: 200 }); // ส่งข้อมูลโพสต์
  } catch (error) {
    console.error("Error fetching post:", error); // Debugging statement
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลโพสต์ได้" },
      { status: 500 } // หากเกิดข้อผิดพลาด ส่งข้อความผิดพลาด
    );
  }
}

// ฟังก์ชัน PUT สำหรับอัปเดตข้อมูลโพสต์
export async function PUT(req, { params }) {
  const { id } = params;
  console.log("Updating post with ID:", id); // Debugging statement

  try {
    const formData = await req.formData(); // รับข้อมูลจากฟอร์ม
    const name = formData.get("name"); // ชื่อ
    const lastname = formData.get("lastname"); // นามสกุล
    const personal_ip = formData.get("personal_ip"); // หมายเลขบัตรประชาชน
    const img_profile = formData.get("img_profile"); // รูปโปรไฟล์
    const grade = formData.get("grade"); // ชั้นปี
    const number_no = formData.get("number_no"); // หมายเลขผู้สมัคร
    const department = formData.get("department"); // สาขา
    const class_room = formData.get("class_room"); // ห้องเรียน
    const party_policies = formData.get("party_policies"); // นโยบายพรรค
    const party_details = formData.get("party_details"); // รายละเอียดพรรค
    const party_slogan = formData.get("party_slogan"); // สโลแกนพรรค
    const img_work = formData.get("img_work"); // รูปผลงาน

    // Log form data for debugging
    console.log("Form Data:", {
      name,
      lastname,
      personal_ip,
      img_profile,
      grade,
      number_no,
      department,
      class_room,
      party_policies,
      party_details,
      party_slogan,
      img_work,
    });

    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (
      !name ||
      !lastname ||
      !personal_ip ||
      !grade ||
      !number_no ||
      !department ||
      !class_room ||
      !party_policies ||
      !party_details ||
      !party_slogan // ตรวจสอบให้แน่ใจว่าสโลแกนพรรคไม่ว่าง
    ) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบ", status: 400 }); // หากข้อมูลไม่ครบ ส่งข้อความผิดพลาด
    }

    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    const post = await Post.findById(id); // ค้นหาข้อมูลโพสต์ตาม ID
    console.log("Post found:", post); // Debugging statement
    if (!post) {
      return NextResponse.json({ message: "ไม่พบโพสต์", status: 404 }); // หากไม่พบโพสต์ ส่งข้อความผิดพลาด
    }

    let profileImgFilename = post.img_profile;
    let workImgFilename = post.img_work;

    // อัปเดตรูปโปรไฟล์หากมีการอัปโหลดใหม่
    if (img_profile) {
      const profileExt = path.extname(img_profile.name).toLowerCase(); // ตรวจสอบนามสกุลไฟล์
      profileImgFilename = `P${Date.now().toString().padStart(11, "0")}${profileExt}`; // สร้างชื่อไฟล์รูปโปรไฟล์ใหม่

      const profileBuffer = Buffer.from(await img_profile.arrayBuffer()); // แปลงรูปภาพเป็น buffer

      const profileDir = path.join(process.cwd(), "public/assets/election/profile"); // กำหนดเส้นทางการบันทึกรูปโปรไฟล์
      await mkdir(profileDir, { recursive: true }); // สร้างไดเรกทอรีหากไม่มี
      await writeFile(path.join(profileDir, profileImgFilename), profileBuffer); // บันทึกรูปโปรไฟล์

      // ลบรูปโปรไฟล์เก่าหากมีและไม่เหมือนกับไฟล์ใหม่
      if (post.img_profile && post.img_profile !== profileImgFilename) {
        const oldProfileImgPath = path.join(profileDir, post.img_profile);
        try {
          await fs.access(oldProfileImgPath); // ตรวจสอบว่าไฟล์เก่ามีอยู่
          await unlink(oldProfileImgPath); // ลบไฟล์เก่า
        } catch (err) {
          // หากเกิดข้อผิดพลาดขณะลบไฟล์
        }
      }
    }

    // อัปเดตรูปผลงานหากมีการอัปโหลดใหม่
    if (img_work) {
      const workExt = path.extname(img_work.name).toLowerCase(); // ตรวจสอบนามสกุลไฟล์
      workImgFilename = `W${Date.now().toString().padStart(11, "0")}${workExt}`; // สร้างชื่อไฟล์รูปผลงานใหม่

      const workBuffer = Buffer.from(await img_work.arrayBuffer()); // แปลงรูปภาพเป็น buffer

      const workDir = path.join(process.cwd(), "public/assets/election/work"); // กำหนดเส้นทางการบันทึกรูปผลงาน
      await mkdir(workDir, { recursive: true }); // สร้างไดเรกทอรีหากไม่มี
      await writeFile(path.join(workDir, workImgFilename), workBuffer); // บันทึกรูปผลงาน

      // ลบรูปผลงานเก่าหากมีและไม่เหมือนกับไฟล์ใหม่
      if (post.img_work && post.img_work !== workImgFilename) {
        const oldWorkImgPath = path.join(workDir, post.img_work);
        try {
          await fs.access(oldWorkImgPath); // ตรวจสอบว่าไฟล์เก่ามีอยู่
          await unlink(oldWorkImgPath); // ลบไฟล์เก่า
        } catch (err) {
          // หากเกิดข้อผิดพลาดขณะลบไฟล์
        }
      }
    }

    // อัปเดตข้อมูลโพสต์ในฐานข้อมูล
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        name,
        lastname,
        personal_ip,
        grade,
        img_profile: profileImgFilename,
        img_work: workImgFilename,
        number_no,
        department,
        class_room,
        party_policies,
        party_details,
        party_slogan, // อัปเดตสโลแกนพรรค
      },
      { new: true } // คืนค่าข้อมูลโพสต์ที่อัปเดต
    );

    console.log("Post updated:", updatedPost); // Debugging statement
    return NextResponse.json({
      message: "อัปเดตโพสต์สำเร็จ",
      updatedPost,
      status: 200,
    }); // ส่งข้อความและข้อมูลโพสต์ที่อัปเดต
  } catch (error) {
    console.error("Error updating post:", error); // Debugging statement
    return NextResponse.json({
      message: "ไม่สามารถอัปเดตโพสต์ได้",
      error: error.message,
      status: 500,
    }); // หากเกิดข้อผิดพลาด ส่งข้อความผิดพลาด
  }
}