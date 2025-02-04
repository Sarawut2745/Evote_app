// route.js
import { connectMongoDB } from "../../../../lib/mongodb"; // นำเข้าฟังก์ชันเพื่อเชื่อมต่อกับ MongoDB
import Banner from "../../../../models/banner"; // นำเข้าโมเดล Banner
import { NextResponse } from "next/server"; // นำเข้า NextResponse สำหรับการส่งคำตอบ
import path from "path"; // นำเข้า path สำหรับการจัดการกับเส้นทางไฟล์
import { unlink, writeFile } from "fs/promises"; // นำเข้า unlink และ writeFile จาก fs/promises สำหรับการจัดการไฟล์

let cachedDb = null; // ตัวแปรที่เก็บการเชื่อมต่อฐานข้อมูล MongoDB

// ฟังก์ชันสำหรับการเชื่อมต่อฐานข้อมูล MongoDB
async function getDbConnection() {
  if (cachedDb) {
    return cachedDb; // ถ้ามีการเชื่อมต่อฐานข้อมูลแล้วให้ใช้ที่เก็บไว้
  }
  cachedDb = await connectMongoDB(); // เชื่อมต่อกับฐานข้อมูล MongoDB
  return cachedDb; // คืนค่าการเชื่อมต่อ
}

export const config = {
  api: {
    bodyParser: false, // ปิด body parser สำหรับการจัดการไฟล์
    responseLimit: false, // ปิดการจำกัดขนาดของการตอบกลับ
  },
};

// ฟังก์ชัน GET สำหรับดึงข้อมูล Banner
export async function GET() {
  try {
    await getDbConnection(); // เชื่อมต่อฐานข้อมูล
    const background = await Banner.find({})
      .lean() // แปลงข้อมูลเป็น JSON
      .select('image _id') // เลือกเฉพาะฟิลด์ image และ _id
      .exec();
    
    return NextResponse.json({ background }); // ส่งข้อมูล background กลับไป
  } catch (error) {
    console.error("Error fetching Banner:", error); // แสดงข้อผิดพลาดในการดึงข้อมูล Banner
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงรูปภาพ" }, { status: 500 }); // ส่งข้อความผิดพลาดหากเกิดข้อผิดพลาด
  }
}

// ฟังก์ชัน POST สำหรับอัปโหลดภาพ Banner
export async function POST(req) {
  try {
    const formData = await req.formData(); // อ่านข้อมูลฟอร์ม
    const images = formData.getAll("images"); // ดึงข้อมูลภาพทั้งหมดจากฟอร์ม

    // ถ้าไม่มีภาพถูกอัปโหลด
    if (!images?.length) {
      return NextResponse.json({ error: "ไม่มีรูปภาพที่อัพโหลด" }, { status: 400 });
    }

    await getDbConnection(); // เชื่อมต่อฐานข้อมูล

    // ฟังก์ชันสำหรับการประมวลผลภาพ
    const processImage = async (image) => {
      const timestamp = Date.now(); // สร้าง timestamp สำหรับชื่อไฟล์
      const fileName = `${timestamp}-${Math.random().toString(36).slice(2)}${path.extname(image.name)}`; // สร้างชื่อไฟล์
      const filePath = `/assets/banner/${fileName}`; // เส้นทางไฟล์
      const fullPath = path.join(process.cwd(), "public", filePath); // เส้นทางไฟล์เต็ม

      const arrayBuffer = await image.arrayBuffer(); // แปลงภาพเป็น ArrayBuffer
      const buffer = Buffer.from(arrayBuffer); // แปลง ArrayBuffer เป็น Buffer
      
      // เขียนไฟล์และบันทึกข้อมูลในฐานข้อมูล
      await Promise.all([
        writeFile(fullPath, buffer),
        Banner.create({ image: filePath })
      ]);

      return filePath; // คืนค่าเส้นทางของไฟล์ที่บันทึก
    };

    // ประมวลผลภาพทั้งหมดและเก็บเส้นทางที่บันทึก
    const savedPaths = await Promise.all(images.map(processImage));

    return NextResponse.json(
      { message: "อัปโหลดรูปภาพสำเร็จ", paths: savedPaths },
      { status: 201 } // ส่งข้อความยืนยันการอัปโหลด
    );
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error); // แสดงข้อผิดพลาดในการอัปโหลดภาพ
    return NextResponse.json({ error: error.message }, { status: 500 }); // ส่งข้อความผิดพลาดหากเกิดข้อผิดพลาด
  }
}

// ฟังก์ชัน DELETE สำหรับลบภาพ Banner
export async function DELETE(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`); // สร้าง URL จากคำขอ
    const id = url.searchParams.get('id'); // ดึง ID ของ Banner ที่ต้องการลบจาก URL

    // ตรวจสอบว่า ID ถูกส่งมาไหม
    if (!id) {
      return NextResponse.json({ error: "ไม่เจอ ไอดี" }, { status: 400 });
    }

    await getDbConnection(); // เชื่อมต่อฐานข้อมูล
    
    const banner = await Banner.findOneAndDelete({ _id: id }); // ค้นหาและลบ Banner โดยใช้ ID

    // หากไม่พบ Banner ให้ส่งข้อความผิดพลาด
    if (!banner) {
      console.error("ไม่พบพื้นหลัง"); // แสดงข้อความหากไม่พบ Banner
      return NextResponse.json({ error: "ไม่พบพื้นหลัง" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", banner.image); // กำหนดเส้นทางไฟล์ของ Banner ที่จะลบ
    unlink(filePath).catch(() => {});  // ลบไฟล์และเงียบหากเกิดข้อผิดพลาด

    return NextResponse.json({ message: "ลบพื้นหลังสำเร็จ" }, { status: 200 }); // ส่งข้อความยืนยันการลบ
  } catch (error) {
    console.error("เกิดข้อผิดพลาดการในลบพื้นหลัง:", error); // แสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในการลบ
    return NextResponse.json({ error: error.message }, { status: 500 }); // ส่งข้อความผิดพลาดหากเกิดข้อผิดพลาด
  }
}
