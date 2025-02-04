"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function EditPostPage({ params }) {
  const { id } = params; // ดึงค่า id จาก params ที่ส่งมาจาก URL
  const [postData, setPostData] = useState({}); // ใช้เก็บข้อมูลโพสต์
  const [name, setName] = useState(""); // ชื่อผู้โพสต์
  const [lastname, setLastName] = useState(""); // นามสกุลผู้โพสต์
  const [personal_ip, setPersonal_ip] = useState(""); // หมายเลขบัตรประชาชน
  const [department, setDepartment] = useState(""); // แผนก
  const [class_room, setClass_room] = useState(""); // ห้องเรียน
  const [grade, setGrade] = useState(""); // เกรด
  const [number_no, setNumber] = useState(""); // หมายเลข
  const [party_policies, setParty_policies] = useState(""); // นโยบายพรรค
  const [party_details, setParty_details] = useState(""); // รายละเอียดของพรรค
  const [preview_work, setPreview_work] = useState(""); // ตัวแสดงภาพตัวอย่างของงาน
  const [fileName_work, setFileName_work] = useState(""); // ชื่อไฟล์ของงาน
  const [preview_profile, setPreview_profile] = useState(""); // ตัวแสดงภาพตัวอย่างของโปรไฟล์
  const [fileName_profile, setFileName_profile] = useState(""); // ชื่อไฟล์ของโปรไฟล์
  const [newImg, setNewImg] = useState(null); // ตัวแปรเก็บภาพโปรไฟล์ใหม่
  const [newWorkImg, setNewWorkImg] = useState(null); // ตัวแปรเก็บภาพงานใหม่
  const [oldImgName, setOldImgName] = useState(""); // ชื่อไฟล์ของภาพโปรไฟล์เก่า
  const [party_slogan, setParty_slogan] = useState(""); // สโลแกนพรรค
  const router = useRouter(); // ใช้สำหรับการนำทางไปยังหน้าอื่น

  // ฟังก์ชันดึงข้อมูลโพสต์จาก API ตาม ID
  const getPostById = async (id) => {
    try {
      const res = await fetch(`/api/election/${id}`, {
        method: "GET", // ใช้ GET เพื่อดึงข้อมูล
        cache: "no-store", // ป้องกันการเก็บ cache
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลโพสต์ได้");
      }

      const data = await res.json(); // แปลงข้อมูลที่ได้รับจาก API
      setPostData(data); // ตั้งค่าข้อมูลโพสต์ที่ได้รับ
      setName(data.post?.name || ""); // กำหนดชื่อผู้โพสต์
      setLastName(data.post?.lastname || ""); // กำหนดนามสกุล
      setPersonal_ip(data.post?.personal_ip || ""); // กำหนดหมายเลขบัตรประชาชน
      setDepartment(data.post?.department || ""); // กำหนดแผนก
      setClass_room(data.post?.class_room || ""); // กำหนดห้องเรียน
      setGrade(data.post?.grade || ""); // กำหนดเกรด
      setNumber(data.post?.number_no || ""); // กำหนดหมายเลข
      setParty_slogan(data.post?.party_slogan || ""); // กำหนดสโลแกนพรรค
      setParty_policies(data.post?.party_policies || ""); // กำหนดนโยบายพรรค
      setParty_details(data.post?.party_details || ""); // กำหนดรายละเอียดของพรรค
      setPreview_work(`/assets/election/work/${data.post?.img_work}`); // กำหนดตัวแสดงภาพตัวอย่างของงาน
      setPreview_profile(`/assets/election/profile/${data.post?.img_profile}`); // กำหนดตัวแสดงภาพตัวอย่างโปรไฟล์
      setFileName_work(data.post?.work_image || ""); // กำหนดชื่อไฟล์ของงาน
      setFileName_profile(data.post?.profile_image || ""); // กำหนดชื่อไฟล์ของโปรไฟล์
      setOldImgName(data.post?.profile_image); // กำหนดชื่อไฟล์ของภาพโปรไฟล์เก่า
    } catch (error) {
      console.error("ข้อผิดพลาดในการดึงข้อมูลโพสต์:", error); // แสดงข้อผิดพลาดในกรณีที่ดึงข้อมูลล้มเหลว
    }
  };

  // เรียกใช้งานฟังก์ชัน getPostById เมื่อเริ่มต้น
  useEffect(() => {
    getPostById(id);
  }, [id]); // ตรวจสอบการเปลี่ยนแปลงของ id และดึงข้อมูลใหม่

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของไฟล์โปรไฟล์
  const handleImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImg(e.target.files[0]);
      setPreview_profile(URL.createObjectURL(e.target.files[0])); // แสดงภาพตัวอย่าง
      setFileName_profile(e.target.files[0].name); // ตั้งชื่อไฟล์โปรไฟล์
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของไฟล์งาน
  const handleImgwork = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewWorkImg(e.target.files[0]);
      setPreview_work(URL.createObjectURL(e.target.files[0])); // แสดงภาพตัวอย่างของงาน
      setFileName_work(e.target.files[0].name); // ตั้งชื่อไฟล์ของงาน
    }
  };

  // ฟังก์ชันจัดการการส่งฟอร์มเพื่ออัปเดตข้อมูลโพสต์
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name); // เพิ่มชื่อผู้โพสต์
    formData.append("lastname", lastname); // เพิ่มนามสกุลผู้โพสต์
    formData.append("personal_ip", personal_ip); // เพิ่มหมายเลขบัตรประชาชน
    formData.append("department", department); // เพิ่มแผนก
    formData.append("class_room", class_room); // เพิ่มห้องเรียน
    formData.append("grade", grade); // เพิ่มเกรด
    formData.append("number_no", number_no); // เพิ่มหมายเลข
    formData.append("party_slogan", party_slogan); // เพิ่มสโลแกนพรรค
    formData.append("party_policies", party_policies); // เพิ่มนโยบายพรรค
    formData.append("party_details", party_details); // เพิ่มรายละเอียดพรรค

    if (newImg) formData.append("img_profile", newImg); // เพิ่มไฟล์โปรไฟล์ใหม่ (ถ้ามี)
    if (newWorkImg) formData.append("img_work", newWorkImg); // เพิ่มไฟล์งานใหม่ (ถ้ามี)

    try {
      const res = await fetch(`/api/election/${id}`, {
        method: "PUT", // ใช้ PUT ในการอัปเดตข้อมูล
        body: formData, // ส่งข้อมูลผ่าน formData
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถอัพเดทโพสต์ได้");
      }

      router.push("/admin/management"); // นำทางไปยังหน้า Management หลังจากอัปเดตข้อมูลสำเร็จ
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดทโพสต์:", error); // แสดงข้อผิดพลาดถ้ามี
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          แก้ไขข้อมูลผู้สมัคร
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
            {/* Input Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left Column: Input for รูปผลงานผู้สมัคร */}
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
  
              {/* Right Column: Input for รูปผู้สมัคร */}
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
  
            {/* Preview Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {/* Left Column: Preview รูปผลงาน */}
              {preview_work && (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    ตัวอย่างรูปผลงานผู้สมัคร
                  </p>
                  <Image
                    src={preview_work}
                    alt="ตัวอย่างรูปผลงานผู้สมัคร"
                    width={200}
                    height={200}
                    className="object-cover rounded-lg shadow mx-auto"
                  />
                </div>
              )}
  
              {/* Right Column: Preview รูปผู้สมัคร */}
              {preview_profile && (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    ตัวอย่างรูปผู้สมัคร
                  </p>
                  <Image
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
              onChange={(e) => setParty_slogan(e.target.value)} // แก้ไขค่า party_slogan
              rows="5"
              className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ป้อนสโลแกนพรรค"
            />
          </div>
  
          {/* นโยบายพรรค */}
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
              แก้ไขผู้สมัคร
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

export default EditPostPage;
