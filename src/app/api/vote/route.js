import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Scores from "../../../../models/scores_el";
import User from "../../../../models/user";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request Body:", body); // ตรวจสอบข้อมูลที่ได้รับ

    const { user_type, number_no } = body;
    if (!user_type || !number_no) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    await connectMongoDB();

    // บันทึกคะแนน
    await Scores.create({ user_type, number_no });

    // ค้นหาและอัปเดต vote_status ของผู้ใช้
    const updatedUser = await User.findOneAndUpdate(
      { user_type }, // ค้นหาตาม user_type
      { $set: { vote_status: 1 } }, // อัปเดตค่า vote_status เป็น 1
      { new: true } // คืนค่าข้อมูลที่อัปเดตแล้ว
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้สำหรับอัปเดต" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "เพิ่มคะแนนสำเร็จ", user: updatedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดขณะเพิ่มคะแนน", error: error.message },
      { status: 500 }
    );
  }
}
