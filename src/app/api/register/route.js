import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        // แปลงข้อมูลที่มาจาก request body
        const { name, posonal_number, user_type, vote_status = 0 } = await req.json();
        
        // แปลง vote_status เป็นตัวเลขที่ชัดเจน
        const numericVoteStatus = Number(vote_status);

        console.log("Received data:", { name, posonal_number, user_type, vote_status: numericVoteStatus });

        // ตรวจสอบข้อมูล
        if (!name || !posonal_number) {
            return NextResponse.json({ message: "ชื่อและหมายเลขต้องถูกระบุ" }, { status: 400 });
        }

        // เชื่อมต่อกับ MongoDB
        await connectMongoDB();

        // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
        const existingUser = await User.findOne({ 
            $or: [{ name }, { posonal_number }] 
        });
        
        if (existingUser) {
            return NextResponse.json({ message: "ผู้ใช้นี้มีอยู่แล้ว (ชื่อหรือเลขบัตรประชาชนซ้ำ)" }, { status: 409 });
        }

        // สร้างผู้ใช้ใหม่ในฐานข้อมูลโดยระบุทุกฟิลด์อย่างชัดเจน
        const userData = {
            name,
            posonal_number,
            user_type,
            vote_status: numericVoteStatus,
            role: "user"
        };
        
        // บังคับให้มีการระบุฟิลด์ vote_status อย่างชัดเจน
        console.log("Creating user with data:", userData);
        
        const newUser = await User.create(userData);

        // ทดสอบค้นหาผู้ใช้ที่เพิ่งสร้างเพื่อตรวจสอบค่า vote_status
        const createdUser = await User.findById(newUser._id).lean();
        console.log("User with vote_status check:", {
            name: createdUser.name,
            vote_status: createdUser.vote_status
        });

        console.log("New user created:", JSON.stringify(newUser.toObject(), null, 2));

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้สำเร็จ" }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในการลงทะเบียนผู้ใช้" }, { status: 500 });
    }
}