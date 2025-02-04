import { NextResponse } from 'next/server'; // ใช้ NextResponse สำหรับการตอบกลับจาก API
import { connectMongoDB } from '../../../../lib/mongodb'; // เชื่อมต่อกับ MongoDB
import Scores from '../../../../models/scores_el'; // นำเข้าโมเดล Scores
import User from '../../../../models/user'; // นำเข้าโมเดล User

// ฟังก์ชัน POST สำหรับเพิ่มคะแนน
export async function POST(req) {
  try {
    // รับข้อมูลจากคำขอที่ส่งมาในรูปแบบ JSON
    const { user_type, number_no } = await req.json();

    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // สร้างคะแนนใหม่ในฐานข้อมูล
    await Scores.create({ user_type, number_no });

    // ส่งข้อความตอบกลับว่าเพิ่มคะแนนสำเร็จ
    return NextResponse.json({ message: 'เพิ่มคะแนนสำเร็จ' }, { status: 201 });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดเกิดขึ้น ส่งข้อความข้อผิดพลาด
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดขณะเพิ่มคะแนน' }, { status: 500 });
  }
}

// ฟังก์ชัน GET สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET() {
  // เชื่อมต่อกับ MongoDB
  await connectMongoDB();

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  const user = await User.find({});

  // ส่งข้อมูลผู้ใช้ทั้งหมดกลับมา
  return NextResponse.json({ user });
}
