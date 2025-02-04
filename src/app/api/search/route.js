import { connectMongoDB } from "../../../../lib/mongodb"; // เชื่อมต่อกับ MongoDB
import Post from "../../../../models/election"; // นำเข้าโมเดล Post
import { NextResponse } from "next/server"; // ใช้ NextResponse สำหรับการตอบกลับจาก API

export async function GET(req) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("query"); // รับค่าคำค้นจาก query string

    if (!searchQuery) {
      // ถ้าไม่มี query ให้ส่งข้อความแจ้งเตือน
      return NextResponse.json({ message: "Query not provided" }, { status: 400 });
    }

    await connectMongoDB(); // เชื่อมต่อกับฐานข้อมูล MongoDB

    // ใช้ regex เพื่อค้นหาข้อความที่ตรงกับคำค้นในฟิลด์ name
    const posts = await Post.find({
      name: { $regex: searchQuery, $options: "i" }, // ค้นหาข้อความแบบไม่สนใจตัวพิมพ์ใหญ่-เล็ก
    });

    // ส่งผลลัพธ์กลับเป็น JSON
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดเกิดขึ้น ส่งข้อความแจ้งเตือน
    return NextResponse.json({ message: "Failed to search", status: 500 });
  }
}
