"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';


function CreatePostPage() {
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [personal_ip, setPersonal_ip] = useState("");
  const [department, setDepartment] = useState("");
  const [class_room, setClass_room] = useState("");
  const [grade, setGrade] = useState("");
  const [img_work, setImg_work] = useState("");
  const [img_profile, setImg_profile] = useState(null);
  const [number_no, setNumber] = useState("");
  const [party_policies, setParty_policies] = useState("");
  const [party_details, setParty_details] = useState("");

  const [preview_work, setPreview_work] = useState(null);
  const [preview_profile, setPreview_profile] = useState(null);

  const [fileName_profile, setFileName_profile] = useState("โปรดเลือกรูป");
  const [fileName_work, setFileName_work] = useState("โปรดเลือกรูป");

  const router = useRouter();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImg_profile(file);
    if (file) {
      setPreview_profile(URL.createObjectURL(file));
      setFileName_profile(file.name);
    } else {
      setPreview_profile(null);
      setFileName_profile("โปรดเลือกรูป");
    }
  };

  const handleImgwork = (e) => {
    const file = e.target.files[0];
    setImg_work(file);
    if (file) {
      setPreview_work(URL.createObjectURL(file));
      setFileName_work(file.name);
    } else {
      setPreview_work(null);
      setFileName_work("โปรดเลือกรูป");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าฟิลด์สำคัญทั้งหมดถูกกรอกครบ
    if (
      !name ||
      !lastname ||
      !img_profile ||
      !number_no ||
      !department ||
      !class_room ||
      !party_policies ||
      !party_details ||
      !img_work
    ) {
      alert("Please complete all inputs.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("personal_ip", personal_ip);
    formData.append("grade", grade);
    formData.append("img_profile", img_profile);
    formData.append("number_no", number_no);
    formData.append("department", department);
    formData.append("class_room", class_room);
    formData.append("party_policies", party_policies);
    formData.append("party_details", party_details);
    formData.append("img_work", img_work);


    try {
      const res = await fetch("/api/election", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/management");
      } else {
        throw new Error("Failed to create a post");
      }
    } catch (error) {
      console.log(error);
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
                <option value="ผ้าและสื่อสิ่งทอ">แผนกวิชาผ้าและสื่อสิ่งทอ</option>
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
                  <option value="ปวช.1">ปวช. 1</option>
                  <option value="ปวช.2">ปวช. 2</option>
                  <option value="ปวช.3">ปวช. 3</option>
                </optgroup>
                <optgroup label="ระดับชั้น ปวส.">
                  <option value="ปวส.1">ปวส. 1</option>
                  <option value="ปวส.2">ปวส. 2</option>
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
                  <span className="text-gray-600 truncate" style={{ maxWidth: '150px' }}>{fileName_work || "ยังไม่ได้เลือกไฟล์"}</span>
                </div>
              </div>

              {/* Right Column: Input for รูปผู้สมัคร */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  รูปผู้สมัคร
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
                  <span className="text-gray-600 truncate" style={{ maxWidth: '150px' }}>{fileName_profile || "ยังไม่ได้เลือกไฟล์"}</span>
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
              className="bg-red hover:bg-red-600 text-white border py-3 px-6 rounded text-lg"
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
