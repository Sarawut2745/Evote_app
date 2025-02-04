// pages/api/background/[id].js
import { connectMongoDB } from "../../../../../lib/mongodb"; // นำเข้าฟังก์ชันเชื่อมต่อกับ MongoDB
import Banner from "../../../../../models/banner"; // นำเข้าโมเดล Banner
import { NextResponse } from "next/server"; // นำเข้า NextResponse สำหรับการส่งคำตอบ
import path from "path"; // นำเข้า path สำหรับการจัดการกับเส้นทางไฟล์
import { unlink } from "fs/promises"; // นำเข้า unlink สำหรับการลบไฟล์

// ฟังก์ชัน DELETE สำหรับลบข้อมูล Banner ตาม ID
export async function DELETE(req) {
  try {
    const { id } = req.query; // รับค่า ID จาก query string

    // ตรวจสอบว่าได้ส่ง ID มาไหม
    if (!id) {
      return NextResponse.json(
        { error: "ไม่พบ ID" }, // ส่งข้อความผิดพลาดหากไม่มี ID
        { status: 400 }
      );
    }

    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    // ค้นหา Banner ตาม ID
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูล Banner" }, // ส่งข้อความผิดพลาดหากไม่พบข้อมูล
        { status: 404 }
      );
    }

    // ลบไฟล์ที่เกี่ยวข้องกับ Banner
    const filePath = path.join(process.cwd(), "public", banner.image); // กำหนดเส้นทางไฟล์ที่ต้องการลบ
    await unlink(filePath); // ลบไฟล์จากระบบ

    // ลบข้อมูล Banner ออกจากฐานข้อมูล MongoDB
    await Banner.findByIdAndDelete(id);

    // ส่งข้อความยืนยันการลบข้อมูล Banner
    return NextResponse.json({ message: "ลบ Banner สำเร็จ" }, { status: 200 });
  } catch (error) {
    // ส่งข้อความผิดพลาดหากเกิดข้อผิดพลาด
    return NextResponse.json(
      { error: error.message }, // ส่งข้อความผิดพลาดจากข้อผิดพลาดที่เกิดขึ้น
      { status: 500 }
    );
  }
}
