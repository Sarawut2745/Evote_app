import { connectMongoDB } from "../../../../lib/mongodb"; // นำเข้าฟังก์ชันเชื่อมต่อ MongoDB
import Post from "../../../../models/election"; // นำเข้าโมเดลการเลือกตั้ง
import Scores from "../../../../models/scores_el"; // นำเข้าโมเดลคะแนน
import { NextResponse } from "next/server"; // นำเข้า NextResponse สำหรับการส่งคำตอบ
import path from "path"; // นำเข้า path เพื่อจัดการกับเส้นทางไฟล์
import { writeFile } from "fs/promises"; // นำเข้าฟังก์ชันเขียนไฟล์
import { unlink } from "fs/promises"; // นำเข้าฟังก์ชันลบไฟล์

// ฟังก์ชัน POST สำหรับการอัปโหลดข้อมูลการเลือกตั้ง
export async function POST(req) {
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
    const img_work = formData.get("img_work"); // รูปผลงาน
    const party_slogan = formData.get("party_slogan"); // สโลแกนพรรค

    // ตรวจสอบข้อมูลที่หายไป
    if (
      !name ||
      !lastname ||
      !personal_ip ||
      !img_profile ||
      !grade ||
      !number_no ||
      !department ||
      !class_room ||
      !party_policies ||
      !party_details ||
      !party_slogan ||
      !img_work
    ) {
      return NextResponse.json({ 
        message: "ข้อมูลบางส่วนหายไป", 
        missingFields: {
          name: !name,
          lastname: !lastname,
          personal_ip: !personal_ip,
          img_profile: !img_profile,
          grade: !grade,
          number_no: !number_no,
          department: !department,
          class_room: !class_room,
          party_policies: !party_policies,
          party_details: !party_details,
          img_work: !img_work,
          party_slogan: !party_slogan
        },
        status: 400 
      });
    }

    // แปลงฟิลด์ที่เป็นตัวเลขเป็นตัวเลขจริง
    const personal_ipNumber = Number(personal_ip);
    const gradeNumber = Number(grade);
    const number_noNumber = Number(number_no);

    // ตรวจสอบว่าฟิลด์ตัวเลขถูกต้อง
    if (isNaN(personal_ipNumber) || isNaN(gradeNumber) || isNaN(number_noNumber)) {
      return NextResponse.json({ message: "รูปแบบตัวเลขไม่ถูกต้อง", status: 400 });
    }

    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // สร้างชื่อไฟล์ที่ไม่ซ้ำกันโดยใช้ timestamp
    const profileFilename = `P${(Date.now()).toString().padStart(11, "0")}`;
    const workFilename = `W${(Date.now()).toString().padStart(11, "0")}`;

    // รับส่วนขยายของไฟล์
    const profileExt = path.extname(img_profile.name).toLowerCase();
    const workExt = path.extname(img_work.name).toLowerCase();

    // สร้างชื่อไฟล์เต็มพร้อมส่วนขยาย
    const profileFileWithExt = profileFilename + profileExt;
    const workFileWithExt = workFilename + workExt;

    // แปลงไฟล์เป็น buffer
    const profileBuffer = Buffer.from(await img_profile.arrayBuffer());
    const workBuffer = Buffer.from(await img_work.arrayBuffer());

    // บันทึกรูปโปรไฟล์
    await writeFile(
      path.join(
        process.cwd(),
        "public/assets/election/profile",
        profileFileWithExt
      ),
      profileBuffer
    );

    // บันทึกรูปผลงาน
    await writeFile(
      path.join(process.cwd(), "public/assets/election/work", workFileWithExt),
      workBuffer
    );

    // สร้างข้อมูลในฐานข้อมูล
    const savedPost = await Post.create({
      name,
      lastname, // รวมถึงนามสกุลด้วย
      personal_ip: personal_ipNumber,
      img_profile: profileFileWithExt,
      grade: gradeNumber,
      number_no: number_noNumber,
      department,
      class_room,
      party_policies,
      party_details,
      party_slogan,
      img_work: workFileWithExt,
    });

    return NextResponse.json({ message: "สำเร็จ", status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      message: "ไม่สำเร็จ", 
      error: error.message, 
      status: 500 
    });
  }
}

// ฟังก์ชัน GET สำหรับดึงข้อมูลโพสต์ทั้งหมด
export async function GET() {
  await connectMongoDB(); // เชื่อมต่อกับ MongoDB
  const posts = await Post.find({}); // ค้นหาข้อมูลโพสต์ทั้งหมด
  return NextResponse.json({ posts });
}

// ฟังก์ชัน DELETE สำหรับลบโพสต์และข้อมูลที่เกี่ยวข้อง
export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id"); // รับ ID จาก query string
    if (!id) {
      return NextResponse.json({ message: "ไม่พบ ID" }, { status: 400 });
    }

    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    // ค้นหาข้อมูลโพสต์ตาม ID
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ message: "ไม่พบโพสต์" }, { status: 404 });
    }

    // ลบโพสต์จากฐานข้อมูล
    await Post.findByIdAndDelete(id);

    // ลบคะแนนที่เกี่ยวข้อง
    await Scores.deleteMany({ number_no: post.number_no });

    // ลบไฟล์รูปโปรไฟล์
    const imgProfilePath = path.join(
      process.cwd(),
      "public/assets/election/profile",
      post.img_profile
    );

    // ลบไฟล์รูปผลงาน
    const imgWorkPath = path.join(
      process.cwd(),
      "public/assets/election/work",
      post.img_work
    );

    // พยายามลบไฟล์รูปโปรไฟล์
    try {
      await unlink(imgProfilePath);
    } catch (fileError) {
      // หากลบไฟล์ไม่สำเร็จ
    }

    // พยายามลบไฟล์รูปผลงาน
    try {
      await unlink(imgWorkPath);
    } catch (fileError) {
      // หากลบไฟล์ไม่สำเร็จ
    }

    return NextResponse.json(
      { message: "โพสต์, คะแนนที่เกี่ยวข้อง และไฟล์ถูกลบแล้ว" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "ไม่สำเร็จ", status: 500 });
  }
}
