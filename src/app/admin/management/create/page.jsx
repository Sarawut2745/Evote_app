"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NextImage from "next/image";

function CreatePostPage() {
  // กำหนด state สำหรับข้อมูลที่กรอกในฟอร์ม
  const [name, setName] = useState(""); // ชื่อ
  const [lastname, setLastName] = useState(""); // นามสกุล
  const [personal_ip, setPersonal_ip] = useState(""); // หมายเลขบัตรประชาชน
  const [department, setDepartment] = useState(""); // คณะ
  const [class_room, setClass_room] = useState(""); // ห้องเรียน
  const [grade, setGrade] = useState(""); // ชั้นปี
  const [img_work, setImg_work] = useState(""); // รูปภาพผลงาน
  const [img_profile, setImg_profile] = useState(null); // รูปภาพโปรไฟล์
  const [number_no, setNumber] = useState(""); // หมายเลข
  const [party_policies, setParty_policies] = useState(""); // นโยบายพรรค
  const [party_details, setParty_details] = useState(""); // รายละเอียดพรรค
  const [party_slogan, setParty_slogan] = useState(""); // สโลแกนพรรค

  const [preview_work, setPreview_work] = useState(null); // การแสดงตัวอย่างรูปผลงาน
  const [preview_profile, setPreview_profile] = useState(null); // การแสดงตัวอย่างรูปโปรไฟล์

  const [fileName_profile, setFileName_profile] = useState("โปรดเลือกรูป"); // ชื่อไฟล์รูปโปรไฟล์
  const [fileName_work, setFileName_work] = useState("โปรดเลือกรูป"); // ชื่อไฟล์รูปผลงาน

  const router = useRouter(); // ใช้ router สำหรับเปลี่ยนหน้า

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงรูปโปรไฟล์
  const handleImgChange = (e) => {
    const file = e.target.files[0]; // รับไฟล์รูปที่ผู้ใช้เลือก
    if (file) {
      // สร้าง Object ของรูปภาพเพื่อตรวจสอบขนาด
      const img = new Image();
      img.onload = () => {
        // ตรวจสอบขนาดรูปภาพ
        if (img.width <= 200 && img.height <= 200) {
          // ถ้าขนาดถูกต้อง ตั้งค่า state สำหรับรูปโปรไฟล์
          setImg_profile(file);
          setPreview_profile(URL.createObjectURL(file)); // แสดงตัวอย่างรูปโปรไฟล์
          setFileName_profile(file.name); // แสดงชื่อไฟล์
        } else {
          // ถ้าขนาดเกินเกณฑ์ที่กำหนด
          alert("ขนาดรูปภาพต้องไม่เกิน 200x200 พิกเซล");
        }
      };
      img.src = URL.createObjectURL(file); // โหลดรูปเพื่อคำนวณขนาด
    } else {
      // ถ้าไม่มีการเลือกไฟล์รูปใหม่ ให้รีเซ็ตตัวอย่างรูปและชื่อไฟล์
      setPreview_profile(null);
      setFileName_profile("โปรดเลือกรูป");
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงรูปผลงาน
  const handleImgwork = (e) => {
    const file = e.target.files[0]; // รับไฟล์รูปที่ผู้ใช้เลือก
    if (file) {
      // สร้าง Object ของรูปภาพเพื่อตรวจสอบขนาด
      const img = new Image();
      img.onload = () => {
        // ตรวจสอบขนาดรูปภาพ
        if (img.width <= 320 && img.height <= 200) {
          // ถ้าขนาดถูกต้อง ตั้งค่า state สำหรับรูปผลงาน
          setImg_work(file);
          setPreview_work(URL.createObjectURL(file)); // แสดงตัวอย่างรูปผลงาน
          setFileName_work(file.name); // แสดงชื่อไฟล์
        } else {
          // ถ้าขนาดเกินเกณฑ์ที่กำหนด
          alert("ขนาดรูปภาพต้องไม่เกิน 320x200 พิกเซล");
        }
      };
      img.src = URL.createObjectURL(file); // โหลดรูปเพื่อคำนวณขนาด
    } else {
      // ถ้าไม่มีการเลือกไฟล์รูปใหม่ ให้รีเซ็ตตัวอย่างรูปและชื่อไฟล์
      setPreview_work(null);
      setFileName_work("โปรดเลือกรูป");
    }
  };

  // ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้กดส่งข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ

    // ตรวจสอบให้แน่ใจว่าทุกฟิลด์ได้รับการกรอกข้อมูล
    if (!name || !lastname || !personal_ip || !grade || !number_no || !department || !class_room || !party_policies || !party_details || !party_slogan || !img_profile || !img_work) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน"); // แจ้งเตือนหากข้อมูลไม่ครบ
      return;
    }

    // สร้าง FormData เพื่อส่งข้อมูลไปยัง API
    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("personal_ip", personal_ip);
    formData.append("grade", grade);
    formData.append("number_no", number_no);
    formData.append("department", department);
    formData.append("class_room", class_room);
    formData.append("party_policies", party_policies);
    formData.append("party_details", party_details);
    formData.append("party_slogan", party_slogan);
    formData.append("img_profile", img_profile);
    formData.append("img_work", img_work);

    try {
      // ส่งข้อมูลไปยัง API สำหรับสร้างโพสต์ใหม่
      const res = await fetch("/api/election", {
        method: "POST",
        body: formData, // ส่งข้อมูลที่บรรจุใน FormData
      });

      if (res.ok) {
        router.push("/admin/management"); // หากการส่งข้อมูลสำเร็จ เปลี่ยนไปที่หน้า /admin/management
      } else {
        throw new Error("ไม่สามารถสร้างโพสต์ได้"); // ถ้ามีข้อผิดพลาดในการส่งข้อมูล
      }
    } catch (error) {
      // ลบ console.log ที่ไม่จำเป็น
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          เพิ่มข้อมูลผู้สมัคร
        </h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ชื่อจริง */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                ชื่อจริง
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ป้อนชื่อจริง"
              />
            </div>
  
            {/* ชื่อนามสกุล */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                ชื่อนามสกุล
              </label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ป้อนชื่อนามสกุล"
              />
            </div>
  
            {/* เลขประจำตัว */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                เลขประจำตัว
              </label>
              <input
                type="text"
                value={personal_ip}
                onChange={(e) => setPersonal_ip(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ป้อนเลขประจำตัว"
              />
            </div>
  
            {/* สาขาวิชา */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                สาขาวิชา
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  เลือกสาขาวิชา
                </option>
                <option value="บัญชี">แผนกวิชาการบัญชี</option>
                <option value="เลขานุการ">แผนกวิชาการเลขานุการ</option>
                <option value="การตลาด">แผนกวิชาการตลาด</option>
                <option value="คอมพิวเตอร์ธุรกิจ">
                  แผนกวิชาคอมพิวเตอร์ธุรกิจและเทคโนโลยีธุรกิจดิจิทัล
                </option>
                <option value="โปรแกรมเมอร์">
                  แผนกวิชาคอมพิวเตอร์โปรแกรมเมอร์
                </option>
                <option value="กราฟิก">แผนกวิชาคอมพิวเตอร์กราฟิก</option>
                <option value="ออกแบบ">แผนกวิชาการออกแบบ</option>
                <option value="โรงแรม">แผนกวิชาการโรงแรม</option>
                <option value="ท่องเที่ยว">แผนกวิชาการท่องเที่ยว</option>
                <option value="อาหาร">แผนกวิชาอาหารและโภชนาการ</option>
                <option value="ผ้าและสื่อสิ่งทอ">
                  แผนกวิชาผ้าและสื่อสิ่งทอ
                </option>
                <option value="คหกรรม">แผนกวิชาคหกรรม</option>
                <option value="ธุรกิจค้าปลีก">แผนกวิชาธุรกิจค้าปลีก</option>
              </select>
            </div>
  
            {/* ระดับชั้น */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                ระดับชั้น
              </label>
              <select
                value={class_room}
                onChange={(e) => setClass_room(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  เลือกระดับชั้น
                </option>
                <optgroup label="ระดับชั้น ปวช.">
                  <option value="ปวช.1">ปวช.1</option>
                  <option value="ปวช.2">ปวช.2</option>
                  <option value="ปวช.3">ปวช.3</option>
                </optgroup>
                <optgroup label="ระดับชั้น ปวส.">
                  <option value="ปวส.1">ปวส.1</option>
                  <option value="ปวส.2">ปวส.2</option>
                </optgroup>
              </select>
            </div>
  
            {/* ผลการเรียน */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                ผลการเรียน
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ป้อนผลการเรียน"
              />
            </div>
  
            {/* เบอร์หมายเลข */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                เบอร์หมายเลข
              </label>
              <input
                type="text"
                value={number_no}
                onChange={(e) => {
                  // ตรวจสอบให้แน่ใจว่าเป็นตัวเลขเท่านั้น
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setNumber(value);
                  }
                }}
                className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ป้อนเบอร์หมายเลข"
              />
            </div>
          </div>
  
          <div className="space-y-8 mt-8">
            {/* แถวอินพุต */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* คอลัมน์ซ้าย: อินพุตสำหรับ รูปผลงานผู้สมัคร */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  รูปผลงานผู้สมัคร
                  <span className="text-red_1-500 text-sm ml-2">
                    *รูปขนาดไม่เกิน 320x200px
                  </span>
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="file-input-work"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200"
                  >
                    เลือกรูป
                  </label>
                  <input
                    id="file-input-work"
                    type="file"
                    onChange={handleImgwork}
                    className="hidden"
                  />
                  <span
                    className="text-gray-600 truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {fileName_work || "ยังไม่ได้เลือกไฟล์"}
                  </span>
                </div>
              </div>
  
              {/* คอลัมน์ขวา: อินพุตสำหรับ รูปผู้สมัคร */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  รูปผู้สมัคร
                  <span className="text-red_1-500 text-sm ml-2">
                    *รูปขนาดไม่เกิน 200x200px
                  </span>
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="file-input-profile"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200"
                  >
                    เลือกรูป
                  </label>
                  <input
                    id="file-input-profile"
                    type="file"
                    onChange={handleImgChange}
                    className="hidden"
                  />
                  <span
                    className="text-gray-600 truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {fileName_profile || "ยังไม่ได้เลือกไฟล์"}
                  </span>
                </div>
              </div>
            </div>
  
            {/* แถวแสดงตัวอย่าง */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {/* คอลัมน์ซ้าย: ดูตัวอย่าง รูปผลงาน */}
              {preview_work && (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    ตัวอย่างรูปผลงานผู้สมัคร
                  </p>
                  <NextImage
                    src={preview_work}
                    alt="ตัวอย่างรูปผลงานผู้สมัคร"
                    width={320}
                    height={200}
                    className="object-cover rounded-lg shadow mx-auto"
                  />
                </div>
              )}
  
              {/* คอลัมน์ด้านขวา: ดูตัวอย่าง รูปผู้สมัคร */}
              {preview_profile && (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    ตัวอย่างรูปผู้สมัคร
                  </p>
                  <NextImage
                    src={preview_profile}
                    alt="ตัวอย่างรูปผู้สมัคร"
                    width={200}
                    height={200}
                    className="object-cover rounded-lg shadow mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
  
          {/* สโลแกนพรรค */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              สโลแกนพรรค
            </label>
            <input
              value={party_slogan}
              onChange={(e) => setParty_slogan(e.target.value)}
              rows="5"
              className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ป้อนสโลแกนพรรค"
            />
          </div>
  
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              นโยบายพรรค
            </label>
            <textarea
              value={party_policies}
              onChange={(e) => setParty_policies(e.target.value)}
              rows="5"
              className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ป้อนนโยบายพรรค"
            />
          </div>
  
          {/* ข้อมูลพรรค */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              ข้อมูลพรรค
            </label>
            <textarea
              value={party_details}
              onChange={(e) => setParty_details(e.target.value)}
              rows="5"
              className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ป้อนข้อมูลพรรค"
            />
          </div>
  
          {/* ปุ่มส่งข้อมูล */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white border py-3 px-6 rounded text-lg"
            >
              เพิ่มผู้สมัคร
            </button>
            <Link
              href="/admin/management"
              className="bg-red hover:bg-red_1-600 text-white border py-3 px-6 rounded text-lg"
            >
              ย้อนกลับ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
