import { NextResponse } from 'next/server'; // ใช้ NextResponse สำหรับการตอบกลับจาก API
import { connectMongoDB } from '../../../../lib/mongodb'; // เชื่อมต่อกับ MongoDB
import User from '../../../../models/user'; // นำเข้าโมเดล User

// ฟังก์ชัน POST สำหรับตรวจสอบผู้ใช้
export async function POST(req) {
    try {
        // เชื่อมต่อกับ MongoDB
        await connectMongoDB();

        // รับข้อมูลที่ถูกส่งมาในรูปแบบ JSON
        const { name } = await req.json();

        // ค้นหาผู้ใช้จากชื่อที่ได้รับมา
        const user = await User.findOne({ name }).select("_id");

        // ส่งข้อมูลผู้ใช้ที่พบกลับมา
        return NextResponse.json({ user });

    } catch (error) {
        // ถ้ามีข้อผิดพลาดเกิดขึ้น ส่งข้อความข้อผิดพลาด
        return NextResponse.json({ message: "เกิดข้อผิดพลาดขณะตรวจสอบผู้ใช้" }, { status: 500 });
    }
}
