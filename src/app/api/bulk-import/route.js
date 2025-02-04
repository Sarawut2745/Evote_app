import { connectMongoDB } from "../../../../lib/mongodb"; // นำเข้าฟังก์ชันเชื่อมต่อ MongoDB
import User from "../../../../models/user"; // นำเข้าโมเดล User
import { NextResponse } from "next/server"; // นำเข้า NextResponse สำหรับการส่งคำตอบ

// ฟังก์ชัน POST สำหรับนำเข้าข้อมูลผู้ใช้
export async function POST(req) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    const { users } = await req.json(); // รับข้อมูลผู้ใช้จากคำขอ (request)

    // ตรวจสอบว่าข้อมูลผู้ใช้มีรูปแบบถูกต้องหรือไม่
    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ message: 'รูปแบบข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const errors = [];
    // ตรวจสอบข้อมูลของผู้ใช้แต่ละคน
    for (const user of users) {
      // หากข้อมูลบางอย่างขาดหายไป เช่น ชื่อ, เลขประจำตัวประชาชน, หรือประเภทผู้ใช้
      if (!user.name || !user.posonal_number || !user.user_type) {
        errors.push(`ข้อมูลที่จำเป็นขาดหายไปสำหรับผู้ใช้: ${JSON.stringify(user)}`);
      }
    }

    // หากพบข้อผิดพลาดในการตรวจสอบข้อมูล
    if (errors.length > 0) {
      return NextResponse.json({ message: 'พบข้อผิดพลาดในการตรวจสอบข้อมูล', errors }, { status: 400 });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วในฐานข้อมูลหรือไม่
    const existingUsers = await User.find({
      $or: users.map(user => ({ $or: [{ name: user.name }, { posonal_number: user.posonal_number }] }))
    });

    // หากพบผู้ใช้ที่มีข้อมูลซ้ำ
    if (existingUsers.length > 0) {
      return NextResponse.json({ 
        message: 'มีผู้ใช้บางคนที่มีข้อมูลซ้ำ', 
        existingUsers: existingUsers.map(user => ({ name: user.name, posonal_number: user.posonal_number }))
      }, { status: 400 });
    }

    // แทรกผู้ใช้ใหม่ลงในฐานข้อมูล
    const newUsers = await User.insertMany(users);
    return NextResponse.json({ message: 'นำเข้าผู้ใช้สำเร็จ', imported: newUsers.length }, { status: 201 });

  } catch (error) {
    // หากเกิดข้อผิดพลาดในการประมวลผล
    return NextResponse.json({ message: 'ไม่สามารถนำเข้าผู้ใช้ได้', error: error.message }, { status: 500 });
  }
}
