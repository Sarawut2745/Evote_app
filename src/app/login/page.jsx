"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function LoginPage() {
  const [name, setName] = useState("");
  const [posonal_number, setPosonalNumber] = useState(""); // Use posonal_number for login
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      // Redirect to different pages based on role
      if (session.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/vote");
      }
    }
  }, [session, router]);

  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear error on new submit
    setIsLoading(true);

    if (!name || !posonal_number) {
      setError("กรุณากรอกชื่อและรหัสผ่าน");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        name,
        posonal_number, // Pass posonal_number instead of password
        redirect: false,
      });

      if (res?.error) {
        setError("ไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        setIsLoading(false);
        return;
      }

      // The redirect will be handled by useEffect watching the session
    } catch (error) {
      console.log(error);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-teal-400 via-blue-300 to-purple-400 px-4 py-8">
        <div className="absolute inset-0 bg-grid-white/30 bg-grid-8 opacity-10"></div>

        {/* Loading Screen */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center">
            <div className="loader border-t-4 border-teal-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl text-black font-semibold text-center mb-4">
            เลือกตั้งนายกองค์การ
          </h1>
          <h1 className="text-2xl sm:text-3xl text-black font-semibold text-center mb-6">
            นักวิชาชีพในอนาคตแห่งประเทศไทย
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="text-sm sm:text-base label-text text-black">
                  เลขประจำตัวนักเรียนนักศึกษา
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black bg-slate-50 input border-2 border-gray-300 
                    hover:border-teal-400 focus:border-teal-500 
                    focus:ring-2 focus:ring-teal-200 
                    transition-all duration-300 ease-in-out p-2 rounded-md"
                placeholder="เลขประจำตัวนักเรียนนักศึกษา"
              />
            </div>
            <div>
              <label className="label flex items-center">
                <span className="text-sm sm:text-base label-text text-black">
                  รหัสผ่าน
                </span>
                <span className="text-red_1-500 text-sm ml-1">*</span>
                <span className="text-red_1-500 text-sm ml-2">
                  รหัสผ่านคือ เลขประจำตัวประชาชน
                </span>
              </label>
              <input
                type="password"
                value={posonal_number} // Bind posonal_number
                onChange={(e) => setPosonalNumber(e.target.value)} // Update posonal_number
                className="w-full text-black bg-slate-50 input border-2 border-gray-300 
        hover:border-teal-400 focus:border-teal-500 
        focus:ring-2 focus:ring-teal-200 
        transition-all duration-300 ease-in-out p-2 rounded-md"
                placeholder="รหัสผ่าน"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-teal-500 text-black rounded-md
                  hover:bg-teal-600 hover:text-white 
                  focus:outline-none focus:ring-2 focus:ring-teal-400
                  transition-all duration-300 ease-in-out
                  flex items-center justify-center gap-2"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>

          {error && (
            <p className="text-red_1-500 text-center mt-3 text-sm sm:text-base">
              {error}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
