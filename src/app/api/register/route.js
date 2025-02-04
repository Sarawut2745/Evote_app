import { NextResponse } from 'next/server'; // ใช้ NextResponse สำหรับการตอบกลับจาก API
import { connectMongoDB } from '../../../../lib/mongodb'; // เชื่อมต่อกับ MongoDB
import User from '../../../../models/user'; // นำเข้าโมเดล User

export async function POST(req) {
    try {
        // แปลงข้อมูลที่มาจาก request body
        const { name, posonal_number, user_type } = await req.json();

        // ตรวจสอบว่า name และ posonal_number ถูกส่งมาหรือไม่
        if (!name || !posonal_number) {
            return NextResponse.json({ message: "ชื่อและหมายเลขต้องถูกระบุ" }, { status: 400 }); // ถ้าไม่ครบส่งข้อความผิดพลาด
        }

        // เชื่อมต่อกับ MongoDB
        await connectMongoDB();

        // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return NextResponse.json({ message: "ผู้ใช้นี้มีอยู่แล้ว" }, { status: 409 }); // หากมีผู้ใช้แล้วส่งข้อความผิดพลาด
        }

        // สร้างผู้ใช้ใหม่ในฐานข้อมูล
        const newUser = await User.create({
            name,
            posonal_number,  // ตรวจสอบให้แน่ใจว่า posonal_number ถูกส่งมาอย่างถูกต้อง
            user_type        // ฟิลด์ที่เลือกได้
        });

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้สำเร็จ" }, { status: 201 }); // ส่งข้อความยืนยันการลงทะเบียน

    } catch (error) {
        // หากเกิดข้อผิดพลาดในการลงทะเบียนผู้ใช้
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในการลงทะเบียนผู้ใช้" }, { status: 500 }); // ส่งข้อความผิดพลาด
    }
}
