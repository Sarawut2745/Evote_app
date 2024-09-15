"use client";

import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function LoginPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // ตรวจสอบ role และเปลี่ยนเส้นทางตาม role
      if (session.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/vote");
      }
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        name,
        redirect: false,
      });

      if (res.error) {
        setError("ไม่พบผู้ใช้");
        return;
      }

      // เปลี่ยนเส้นทางตาม role หลังจากเข้าสู่ระบบสำเร็จ
      if (res.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/vote");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Navbar />
      <div className="relative bg-slate-100 flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-lg">
          <h1 className="text-3xl text-black font-semibold text-center">
            ระบบเลือกตั้ง
          </h1>
          <hr className="my-3" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="text-base label-text text-black">
                  เลขประจำตัวนักเรียนนักศึกษา
                </span>
              </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black bg-slate-50 input border-2 border-gray-300 
                  hover:border-teal-400 focus:border-teal-500 
                  focus:ring-2 focus:ring-teal-200 
                  transition-all duration-300 ease-in-out"
                placeholder="เลขประจำตัวนักเรียนนักศึกษา"
              />
            </div>
            <div>
              <button
                type="submit"
                className="btn bg-teal-500 w-full text-black border-none 
                  hover:bg-teal-600 hover:text-white 
                  focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
          {error && <p className="text-red text-center mt-3">{error}</p>}
          <hr className="my-3" />
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default LoginPage;
