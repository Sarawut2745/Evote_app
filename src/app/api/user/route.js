import { connectMongoDB } from "../../../../lib/mongodb"; // เชื่อมต่อกับ MongoDB
import User from "../../../../models/user"; // นำเข้าโมเดล User
import { NextResponse } from "next/server"; // ใช้ NextResponse สำหรับการตอบกลับจาก API

export async function GET(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // ดึงข้อมูลผู้ใช้ทั้งหมดจากโมเดล User
    const users = await User.find();

    // ส่งข้อมูลผู้ใช้กลับมาในรูปแบบ JSON
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดเกิดขึ้น ส่งข้อความแจ้งเตือน
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
