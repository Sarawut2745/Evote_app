"use client";

import React, { useState } from "react";
import Link from "next/link";
import DefaultLayout from "../../../../components/Layouts/DefaultLayout";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    posonal_number: "",
    user_type: "",
  });
  const [error, setError] = useState("");  // สถานะข้อผิดพลาด
  const [success, setSuccess] = useState("");  // สถานะสำเร็จ

  // กำหนดประเภทของผู้ใช้ที่สามารถเลือกได้
  const USER_TYPES = [
    { value: "ปวช.1", label: "ปวช.1" },
    { value: "ปวช.2", label: "ปวช.2" },
    { value: "ปวช.3", label: "ปวช.3" },
    { value: "ปวส.1", label: "ปวส.1" },
    { value: "ปวส.2", label: "ปวส.2" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // รีเซ็ตข้อความข้อผิดพลาด
    setSuccess("");  // รีเซ็ตข้อความสำเร็จ

    // ตรวจสอบให้แน่ใจว่ากรอกข้อมูลครบถ้วน
    if (!formData.name || !formData.posonal_number || !formData.user_type) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      // ส่งข้อมูลไปยัง API สำหรับการลงทะเบียน
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("เพิ่มสำเร็จ");
        setFormData({
          name: "",
          posonal_number: "",
          user_type: "",
        });
        // ล้างข้อความสำเร็จหลังจาก 5 วินาที
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.message || "การเพิ่มล้มเหลว");
        // ล้างข้อความข้อผิดพลาดหลังจาก 5 วินาที
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเพิ่ม: " + error.message);
      // ล้างข้อความข้อผิดพลาดหลังจาก 5 วินาที
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-center items-center bg-gray-100 min-h-screen h-full py-8">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-lg p-8">
          <h3 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            เพิ่มผู้ใช้งาน
          </h3>
          <form onSubmit={handleSubmit}>
            {/* แสดงข้อผิดพลาดหากมี */}
            {error && (
              <div className="bg-red_1-500 text-white py-2 px-4 rounded mb-4 text-center">
                {error}
              </div>
            )}
            {/* แสดงข้อความสำเร็จหากการลงทะเบียนสำเร็จ */}
            {success && (
              <div className="bg-green-500 text-white py-2 px-4 rounded mb-4 text-center">
                {success}
              </div>
            )}
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-200 border border-gray-300 py-3 px-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="ชื่อผู้ใช้งาน"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="posonal_number"
                value={formData.posonal_number}
                onChange={handleChange}
                className="w-full bg-gray-200 border border-gray-300 py-3 px-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="เลขบัตรประชาชน"
              />
            </div>
            <div className="mb-4">
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="w-full bg-gray-200 border border-gray-300 py-3 px-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">เลือกระดับชั้น</option>
                {USER_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white border py-3 px-6 rounded text-lg flex-1"
              >
                เพิ่มผู้ใช้งาน
              </button>
              <Link
                href="/admin/user_manage"
                className="bg-red_1-500 hover:bg-red_1-600 text-white border py-3 px-6 rounded text-lg flex-1 flex justify-center items-center"
              >
                ย้อนกลับ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RegisterPage;
