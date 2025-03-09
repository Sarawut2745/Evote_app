"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import Footer from "../../components/Footer";

function LoginPage() {
  const [name, setName] = useState("");
  const [posonal_number, setPosonalNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      session.user.role === "admin"
        ? router.replace("/admin")
        : router.replace("/vote");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !posonal_number) {
      setError("กรุณากรอกชื่อและรหัสผ่าน");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        name,
        posonal_number,
        redirect: false,
      });
      if (res?.error) {
        setError("ผู้ใช้ไม่สามารถเข้าสู่ระบบได้");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-0 relative">
      {/* Navbar */}
      <header className="bg-[#d6ccc2] shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-lg font-semibold">
            การเลือกตั้งวิทยาลัย อาชีวศึกษา สุพรรณบุรี
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-4 text-gray-700">
            <li>
              <a href="/" className="hover:text-blue-500">
                หน้าหลัก
              </a>
            </li>
            <li>
              <a href="/candidate-info" className="hover:text-blue-500">
                ข้อมูลผู้สมัคร
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-blue-500">
                เข้าสู่ระบบ
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-xl overflow-hidden max-w-6xl w-full mx-auto mt-32">
        {/* Left Side: Image */}
        <div className="relative hidden md:block">
          <img
            src="/images/login/login.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Form */}
        <div className="p-12 flex flex-col justify-center w-full">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            เข้าสู่ระบบ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-lg">
                เลขประจำตัวนักเรียน/นักศึกษา
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกเลขประจำตัว"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg">
                รหัสผ่าน{" "}
                <span className="text-sm text-red_1-500">
                  *เลขประจำตัวประชาชน*
                </span>
              </label>
              <input
                type="password"
                value={posonal_number}
                onChange={(e) => setPosonalNumber(e.target.value)}
                className="w-full p-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-4 text-lg rounded-lg hover:bg-gray-800 transition"
            >
              {isLoading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
            </button>
          </form>
          {error && (
            <p className="text-red_1-500 text-center mt-4 text-lg">{error}</p>
          )}
        </div>
      </div>
      <Footer className="mt-20" />
    </div>
  );
}

export default LoginPage;
