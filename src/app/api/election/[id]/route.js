import { connectMongoDB } from "../../../../../lib/mongodb"; // เชื่อมต่อกับ MongoDB
import Post from "../../../../../models/election"; // นำเข้าโมเดลการเลือกตั้ง
import path from "path"; // นำเข้า path สำหรับจัดการกับเส้นทางไฟล์
import { writeFile, unlink, mkdir } from "fs/promises"; // ฟังก์ชันสำหรับเขียนไฟล์, ลบไฟล์ และสร้างไดเรกทอรี
import { NextResponse } from "next/server"; // ใช้ NextResponse สำหรับการตอบกลับจาก API
import fs from "fs/promises"; // ใช้ฟังก์ชันต่างๆจาก fs สำหรับจัดการไฟล์

// ฟังก์ชัน GET สำหรับดึงข้อมูลโพสต์ตาม ID
export async function GET(req, { params }) {
  const { id } = params;
  console.log("Fetching post with ID:", id);
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    const post = await Post.findOne({ _id: id }); // ค้นหาข้อมูลโพสต์ตาม ID
    console.log("Post fetched:", post);
    if (!post) {
      return NextResponse.json({ error: "ไม่พบโพสต์" }, { status: 404 }); // หากไม่พบโพสต์ ส่งข้อความผิดพลาด
    }
    return NextResponse.json({ post }, { status: 200 }); // ส่งข้อมูลโพสต์
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลโพสต์ได้" },
      { status: 500 } // หากเกิดข้อผิดพลาด ส่งข้อความผิดพลาด
    );
  }
}

// ฟังก์ชัน PUT สำหรับอัปเดตข้อมูลโพสต์
export async function PUT(req, { params }) {
  const { id } = params;
  console.log("Updating post with ID:", id);

  try {
    const formData = await req.formData();
    
    // Debug: แสดงข้อมูลทั้งหมดที่ได้รับจาก FormData
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value}`);
    }
    
    const name = formData.get("name");
    const lastname = formData.get("lastname");
    const personal_id = formData.get("personal_id");
    const img_profile = formData.get("img_profile");
    const grade = formData.get("grade");
    const number_no = formData.get("number_no");
    const department = formData.get("department");
    const class_room = formData.get("class_room");
    const party_policies = formData.get("party_policies");
    const party_details = formData.get("party_details");
    const party_slogan = formData.get("party_slogan");
    const img_work = formData.get("img_work");

    // ตรวจสอบว่ามีข้อมูลจำเป็นครบถ้วนหรือไม่
    if (
      !name ||
      !lastname ||
      !personal_id ||
      !grade ||
      !number_no ||
      !department ||
      !class_room ||
      !party_policies ||
      !party_details ||
      !party_slogan
    ) {
      return NextResponse.json({ 
        message: "ข้อมูลไม่ครบ", 
        status: 400,
        missingFields: {
          name: !name,
          lastname: !lastname,
          personal_id: !personal_id,
          grade: !grade,
          number_no: !number_no,
          department: !department,
          class_room: !class_room,
          party_policies: !party_policies,
          party_details: !party_details,
          party_slogan: !party_slogan
        }
      });
    }

    await connectMongoDB();
    const post = await Post.findById(id);
    console.log("Post found:", post);
    
    if (!post) {
      return NextResponse.json({ message: "ไม่พบโพสต์", status: 404 });
    }

    // เริ่มต้นโดยใช้ค่าเดิมจากฐานข้อมูล
    let profileImgFilename = post.img_profile;
    let workImgFilename = post.img_work;

    // ตรวจสอบและประมวลผลรูปโปรไฟล์ใหม่
    if (img_profile && img_profile instanceof File && img_profile.size > 0) {
      try {
        console.log("Processing new profile image:", img_profile.name, img_profile.size);
        
        const profileExt = path.extname(img_profile.name).toLowerCase();
        profileImgFilename = `P${Date.now().toString().padStart(11, "0")}${profileExt}`;
        
        const profileBuffer = Buffer.from(await img_profile.arrayBuffer());
        console.log("Profile buffer created, size:", profileBuffer.length);
        
        const profileDir = path.join(process.cwd(), "public/assets/election/profile");
        console.log("Profile directory:", profileDir);
        
        await mkdir(profileDir, { recursive: true });
        
        const fullPath = path.join(profileDir, profileImgFilename);
        console.log("Saving profile image to:", fullPath);
        
        await writeFile(fullPath, profileBuffer);
        console.log("Profile image saved successfully:", profileImgFilename);
        
        // ลบรูปเก่าหากมีและไม่ตรงกับรูปใหม่
        if (post.img_profile && post.img_profile !== profileImgFilename) {
          try {
            const oldProfilePath = path.join(profileDir, post.img_profile);
            console.log("Checking old profile image:", oldProfilePath);
            
            await fs.access(oldProfilePath);
            console.log("Deleting old profile image");
            
            await unlink(oldProfilePath);
            console.log("Old profile image deleted");
          } catch (err) {
            console.log("Old profile image not found or couldn't be deleted:", err.message);
          }
        }
      } catch (imgError) {
        console.error("Error processing profile image:", imgError);
        return NextResponse.json({
          message: "เกิดข้อผิดพลาดในการประมวลผลรูปโปรไฟล์",
          error: imgError.message,
          status: 500,
        });
      }
    } else {
      console.log("No new profile image uploaded, keeping existing:", profileImgFilename);
    }

    // ตรวจสอบและประมวลผลรูปผลงานใหม่
    if (img_work && img_work instanceof File && img_work.size > 0) {
      try {
        console.log("Processing new work image:", img_work.name, img_work.size);
        
        const workExt = path.extname(img_work.name).toLowerCase();
        workImgFilename = `W${Date.now().toString().padStart(11, "0")}${workExt}`;
        
        const workBuffer = Buffer.from(await img_work.arrayBuffer());
        console.log("Work buffer created, size:", workBuffer.length);
        
        const workDir = path.join(process.cwd(), "public/assets/election/work");
        console.log("Work directory:", workDir);
        
        await mkdir(workDir, { recursive: true });
        
        const fullWorkPath = path.join(workDir, workImgFilename);
        console.log("Saving work image to:", fullWorkPath);
        
        await writeFile(fullWorkPath, workBuffer);
        console.log("Work image saved successfully:", workImgFilename);
        
        // ลบรูปเก่าหากมีและไม่ตรงกับรูปใหม่
        if (post.img_work && post.img_work !== workImgFilename) {
          try {
            const oldWorkPath = path.join(workDir, post.img_work);
            console.log("Checking old work image:", oldWorkPath);
            
            await fs.access(oldWorkPath);
            console.log("Deleting old work image");
            
            await unlink(oldWorkPath);
            console.log("Old work image deleted");
          } catch (err) {
            console.log("Old work image not found or couldn't be deleted:", err.message);
          }
        }
      } catch (imgError) {
        console.error("Error processing work image:", imgError);
        return NextResponse.json({
          message: "เกิดข้อผิดพลาดในการประมวลผลรูปผลงาน",
          error: imgError.message,
          status: 500,
        });
      }
    } else {
      console.log("No new work image uploaded, keeping existing:", workImgFilename);
    }

    // สร้างอ็อบเจกต์สำหรับอัปเดต
    const updateData = {
      name,
      lastname,
      personal_id,
      grade,
      number_no,
      department,
      class_room,
      party_policies,
      party_details,
      party_slogan,
      img_profile: profileImgFilename,
      img_work: workImgFilename
    };

    console.log("Updating post with data:", updateData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log("Post updated successfully:", updatedPost);
    
    return NextResponse.json({
      message: "อัปเดตโพสต์สำเร็จ",
      updatedPost,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({
      message: "ไม่สามารถอัปเดตโพสต์ได้",
      error: error.message,
      stack: error.stack,
      status: 500,
    });
  }
}

// ฟังก์ชัน DELETE สำหรับลบโพสต์ตาม ID
export async function DELETE(req, { params }) {
  const { id } = params;
  console.log("Deleting post with ID:", id);
  
  try {
    await connectMongoDB();
    const post = await Post.findById(id);
    
    if (!post) {
      return NextResponse.json({ message: "ไม่พบโพสต์", status: 404 });
    }
    
    // ลบไฟล์รูปภาพเก่า
    try {
      if (post.img_profile) {
        const profileDir = path.join(process.cwd(), "public/assets/election/profile");
        const profilePath = path.join(profileDir, post.img_profile);
        await fs.access(profilePath);
        await unlink(profilePath);
        console.log("Deleted profile image:", profilePath);
      }
      
      if (post.img_work) {
        const workDir = path.join(process.cwd(), "public/assets/election/work");
        const workPath = path.join(workDir, post.img_work);
        await fs.access(workPath);
        await unlink(workPath);
        console.log("Deleted work image:", workPath);
      }
    } catch (fileError) {
      console.log("Could not delete image files:", fileError.message);
      // ดำเนินการต่อแม้จะไม่สามารถลบไฟล์ได้
    }
    
    // ลบข้อมูลจากฐานข้อมูล
    const deletedPost = await Post.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      message: "ลบโพสต์สำเร็จ", 
      deletedPost, 
      status: 200 
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({
      message: "ไม่สามารถลบโพสต์ได้",
      error: error.message,
      status: 500,
    });
  }
}