"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function EditPostPage({ params }) {
  const { id } = params;
  const [postData, setPostData] = useState({});
  const [name, setName] = useState("");
  const [personal_ip, setPersonal_ip] = useState("");
  const [department, setDepartment] = useState("");
  const [class_room, setClass_room] = useState("");
  const [grade, setGrade] = useState("");
  const [number_no, setNumber] = useState("");
  const [party_policies, setParty_policies] = useState("");
  const [party_details, setParty_details] = useState("");
  const [preview_work, setPreview_work] = useState("");
  const [fileName_work, setFileName_work] = useState("");
  const [preview_profile, setPreview_profile] = useState("");
  const [fileName_profile, setFileName_profile] = useState("");
  const [newImg, setNewImg] = useState(null);
  const [newWorkImg, setNewWorkImg] = useState(null);
  const [oldImgName, setOldImgName] = useState("");
  const router = useRouter();

  // Fetch post data by ID
  const getPostById = async (id) => {
    try {
      const res = await fetch(`/api/election/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch post data");
      }

      const data = await res.json();
      setPostData(data);
      setName(data.post?.name || "");
      setPersonal_ip(data.post?.personal_ip || "");
      setDepartment(data.post?.department || "");
      setClass_room(data.post?.class_room || "");
      setGrade(data.post?.grade || "");
      setNumber(data.post?.number_no || "");
      setParty_policies(data.post?.party_policies || "");
      setParty_details(data.post?.party_details || "");
      setPreview_work(`/assets/election/work/${data.post?.img_work}`);
      setPreview_profile(`/assets/election/profile/${data.post?.img_profile}`);
      setFileName_work(data.post?.work_image || "");
      setFileName_profile(data.post?.profile_image || "");
      setOldImgName(data.post?.profile_image);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostById(id);
  }, [id]);

  const handleImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImg(e.target.files[0]);
      setPreview_profile(URL.createObjectURL(e.target.files[0]));
      setFileName_profile(e.target.files[0].name);
    }
  };

  const handleImgwork = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewWorkImg(e.target.files[0]);
      setPreview_work(URL.createObjectURL(e.target.files[0]));
      setFileName_work(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("personal_ip", personal_ip);
    formData.append("department", department);
    formData.append("class_room", class_room);
    formData.append("grade", grade);
    formData.append("number_no", number_no);
    formData.append("party_policies", party_policies);
    formData.append("party_details", party_details);

    if (newImg) formData.append("img_profile", newImg);
    if (newWorkImg) formData.append("img_work", newWorkImg);

    try {
      const res = await fetch(`/api/election/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      router.push("/admin/management");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          แก้ไขข้อมูลผู้สมัคร
        </h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ชื่อผู้สมัคร */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              ชื่อผู้สมัคร
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ป้อนชื่อผู้สมัคร"
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
              type="number"
              value={number_no}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ป้อนเบอร์หมายเลข"
            />
          </div>

          {/* รูปผลงานผู้สมัคร */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              รูปผลงานผู้สมัคร
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="file-input_1"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200"
              >
                เลือกรูป
              </label>
              <input
                id="file-input_1"
                type="file"
                onChange={handleImgwork}
                className="hidden"
              />
              <span className="text-gray-600">{fileName_work}</span>
            </div>
          </div>

          {preview_work && (
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-700 mb-2">
                ตัวอย่างรูปภาพ
              </p>
              <img
                src={preview_work}
                alt="Image preview"
                className="w-[250px] h-[250px] object-cover rounded-lg shadow"
              />
            </div>
          )}

          {/* รูปผู้สมัคร */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              รูปผู้สมัคร
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="file-input_2"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200"
              >
                เลือกรูป
              </label>
              <input
                id="file-input_2"
                type="file"
                onChange={handleImgChange}
                className="hidden"
              />
              <span className="text-gray-600">{fileName_profile}</span>
            </div>
          </div>

          {preview_profile && (
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-700 mb-2">
                ตัวอย่างรูปภาพ
              </p>
              <img
                src={preview_profile}
                alt="Image preview"
                className="w-[250px] h-[250px] object-cover rounded-lg shadow"
              />
            </div>
          )}

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

export default EditPostPage;
