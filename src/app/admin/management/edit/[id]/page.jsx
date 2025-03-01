"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function EditPostPage({ params }) {
  const { id } = params;
  const [postData, setPostData] = useState({});
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
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
  const [party_slogan, setParty_slogan] = useState("");
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingType, setCroppingType] = useState(null);
  const cropperRef = useRef(null);
  const router = useRouter();

  const getPostById = async (id) => {
    try {
      const res = await fetch(`/api/election/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลโพสต์ได้");
      }

      const data = await res.json();
      setPostData(data);
      setName(data.post?.name || "");
      setLastName(data.post?.lastname || "");
      setPersonal_ip(data.post?.personal_ip || "");
      setDepartment(data.post?.department || "");
      setClass_room(data.post?.class_room || "");
      setGrade(data.post?.grade || "");
      setNumber(data.post?.number_no || "");
      setParty_slogan(data.post?.party_slogan || "");
      setParty_policies(data.post?.party_policies || "");
      setParty_details(data.post?.party_details || "");
      setPreview_work(`/assets/election/work/${data.post?.img_work}`);
      setPreview_profile(`/assets/election/profile/${data.post?.img_profile}`);
      setFileName_work(data.post?.work_image || "");
      setFileName_profile(data.post?.profile_image || "");
    } catch (error) {
      console.error("ข้อผิดพลาดในการดึงข้อมูลโพสต์:", error);
    }
  };

  useEffect(() => {
    getPostById(id);
  }, [id]);

  const handleImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCroppingImage(URL.createObjectURL(e.target.files[0]));
      setCroppingType("profile");
    }
  };

  const handleImgwork = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCroppingImage(URL.createObjectURL(e.target.files[0]));
      setCroppingType("work");
    }
  };

  const handleCropSave = () => {
    const cropper = cropperRef.current.cropper;
    cropper.getCroppedCanvas().toBlob((blob) => {
      if (croppingType === "profile") {
        setNewImg(blob);
        setPreview_profile(URL.createObjectURL(blob));
        setFileName_profile("Cropped Image");
      } else if (croppingType === "work") {
        setNewWorkImg(blob);
        setPreview_work(URL.createObjectURL(blob));
        setFileName_work("Cropped Image");
      }
      setCroppingImage(null);
      setCroppingType(null);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("personal_ip", personal_ip);
    formData.append("department", department);
    formData.append("class_room", class_room);
    formData.append("grade", grade);
    formData.append("number_no", number_no);
    formData.append("party_slogan", party_slogan);
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
        throw new Error("ไม่สามารถอัพเดทโพสต์ได้");
      }

      router.push("/admin/management");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดทโพสต์:", error);
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

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                เบอร์หมายเลข
              </label>
              <input
                type="text"
                value={number_no}
                onChange={(e) => {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  รูปผลงานผู้สมัคร
                  <span className="text-red-500 text-sm ml-2">
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

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  รูปผู้สมัคร
                  <span className="text-red-500 text-sm ml-2">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {preview_work && (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    ตัวอย่างรูปผลงานผู้สมัคร
                  </p>
                  <NextImage
                    src={preview_work}
                    alt="ตัวอย่างรูปผลงานผู้สมัคร"
                    width={320}
                    height={180}
                    className="object-cover rounded-lg shadow mx-auto"
                  />
                </div>
              )}

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

      {croppingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Cropper
              src={croppingImage}
              style={{ height: 400, width: "100%" }}
              aspectRatio={16 / 9}
              guides={false}
              ref={cropperRef}
              viewMode={1}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setCroppingImage(null);
                  setCroppingType(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCropSave}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPostPage;