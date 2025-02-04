"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "../../../../../components/Layouts/DefaultLayout";

function EditUserPage() {
  const [userData, setUserData] = useState({
    name: "",
    posonal_number: "",
    user_type: "ปวช.1",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchUserData = async () => {
      try {
        const id = window.location.pathname.split("/").pop();
        const response = await fetch(`/api/user/${id}`);

        if (!response.ok) {
          throw new Error(`ไม่สามารถดึงข้อมูลผู้ใช้ได้: ${response.statusText}`);
        }

        const user = await response.json();
        setUserData({
          name: user.name || "",
          posonal_number: user.posonal_number || "",
          user_type: user.user_type || "ปวช.1",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [mounted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = window.location.pathname.split("/").pop();
      const response = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ไม่สามารถบันทึกการแก้ไขข้อมูลได้");
      }

      router.push("/admin/user_manage");
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    router.push("/admin/user_manage");
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-lg text-red_1-500">ข้อผิดพลาด: {error}</div>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          แก้ไขข้อมูลผู้ใช้งาน
        </h3>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 border rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              ชื่อผู้ใช้งาน
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="posonal_number" className="block text-gray-700 mb-2">
              เลขบัตรประชาชน
            </label>
            <input
              type="text"
              id="posonal_number"
              name="posonal_number"
              value={userData.posonal_number}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="user_type" className="block text-gray-700 mb-2">
              ระดับชั้น
            </label>
            <select
              id="user_type"
              name="user_type"
              value={userData.user_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="ปวช.1">ปวช.1</option>
              <option value="ปวช.2">ปวช.2</option>
              <option value="ปวช.3">ปวช.3</option>
              <option value="ปวส.1">ปวส.1</option>
              <option value="ปวส.2">ปวส.2</option>
            </select>
          </div>
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red_1-500 text-white py-2 px-6 rounded-lg hover:bg-red_1-600 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}

export default EditUserPage;
