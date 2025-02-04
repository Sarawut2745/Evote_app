import { connectMongoDB } from "../../../../../lib/mongodb"; // เชื่อมต่อกับ MongoDB
import User from "../../../../../models/user"; // นำเข้าโมเดล User
import { NextResponse } from "next/server"; // ใช้ NextResponse สำหรับการตอบกลับจาก API

// ฟังก์ชัน GET สำหรับดึงข้อมูลผู้ใช้ตาม ID
export async function GET(req, { params }) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();
    
    // ค้นหาผู้ใช้จาก ID ที่ได้จาก params
    const user = await User.findById(params.id);

    // ถ้าผู้ใช้ไม่พบ ส่งข้อความข้อผิดพลาด
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ส่งข้อมูลผู้ใช้กลับมาในรูปแบบ JSON
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดเกิดขึ้น ส่งข้อความข้อผิดพลาด
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 });
  }
}

// ฟังก์ชัน PUT สำหรับอัปเดตข้อมูลผู้ใช้ตาม ID
export async function PUT(req, { params }) {
  try {
    const userData = await req.json(); // รับข้อมูลที่ถูกส่งมาในรูปแบบ JSON
    await connectMongoDB();

    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    const updatedUser = await User.findByIdAndUpdate(params.id, userData, { new: true });

    // ถ้าผู้ใช้ไม่พบ ส่งข้อความข้อผิดพลาด
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ส่งข้อมูลผู้ใช้ที่อัปเดตกลับมา
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดเกิดขึ้น ส่งข้อความข้อผิดพลาด
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

// ฟังก์ชัน DELETE สำหรับลบข้อมูลผู้ใช้ตาม ID
export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();

    // ลบข้อมูลผู้ใช้จากฐานข้อมูล
    const deletedUser = await User.findByIdAndDelete(params.id);

    // ถ้าผู้ใช้ไม่พบ ส่งข้อความข้อผิดพลาด
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ส่งข้อความยืนยันการลบผู้ใช้สำเร็จ
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดเกิดขึ้น ส่งข้อความข้อผิดพลาด
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
