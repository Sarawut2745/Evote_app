import { connectMongoDB } from "../../../../lib/mongodb"; // เชื่อมต่อกับ MongoDB
import Scores from "../../../../models/scores_el"; // นำเข้าโมเดล Scores
import { NextResponse } from 'next/server'; // ใช้ NextResponse สำหรับการตอบกลับจาก API

export async function GET() {
  await connectMongoDB(); // เชื่อมต่อกับฐานข้อมูล MongoDB

  // คำนวณจำนวนข้อมูลตาม user_type
  const userTypeCounts = await Scores.aggregate([
    { $group: { _id: "$user_type", count: { $sum: 1 } } }, // จัดกลุ่มตาม user_type และนับจำนวน
    { $project: { _id: 0, user_type: "$_id", count: 1 } } // แสดงผลลัพธ์ให้แสดงแค่ user_type และ count
  ]);

  // คำนวณจำนวนข้อมูลตาม number_no
  const numberNoCounts = await Scores.aggregate([
    { $group: { _id: "$number_no", count: { $sum: 1 } } }, // จัดกลุ่มตาม number_no และนับจำนวน
    { $project: { _id: 0, number_no: "$_id", count: 1 } } // แสดงผลลัพธ์ให้แสดงแค่ number_no และ count
  ]);

  // คำนวณจำนวนเอกสารทั้งหมดในฐานข้อมูล
  const totalDocumentCount = await Scores.countDocuments();

  // ส่งผลลัพธ์กลับเป็น JSON
  return NextResponse.json({
    userTypeCounts,        // จำนวนข้อมูลที่จัดกลุ่มตาม user_type
    numberNoCounts,        // จำนวนข้อมูลที่จัดกลุ่มตาม number_no
    totalDocumentCount,    // จำนวนเอกสารทั้งหมด
  });
}
