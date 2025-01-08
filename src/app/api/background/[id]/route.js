// pages/api/background/[id].js
import { connectMongoDB } from "../../../../../lib/mongodb";
import Banner from "../../../../../models/banner";
import { NextResponse } from "next/server";
import path from "path";
import { unlink } from "fs/promises";

export async function DELETE(req) {
  try {
    const { id } = req.query; // รับ ID จาก query

    if (!id) {
      return NextResponse.json(
        { error: "ID not provided" },
        { status: 400 }
      );
    }

    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    // ค้นหา Banner ตาม ID
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }

    // ลบไฟล์ที่เกี่ยวข้อง
    const filePath = path.join(process.cwd(), "public", banner.image);
    await unlink(filePath); // ลบไฟล์ที่อัปโหลด

    // ลบข้อมูล Banner จาก MongoDB
    await Banner.findByIdAndDelete(id);

    return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Banner:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
