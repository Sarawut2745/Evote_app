"use client";

import React, { useState } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function LoginPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const { data: session } = useSession();
  if (session) {
    // ตรวจสอบ role และเปลี่ยนเส้นทางตาม role
    if (session.user.role === "admin") {
      router.replace("admin");
    } else {
      router.replace("vote");
    }
  }

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
        router.replace("admin");
      } else {
        router.replace("vote");
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
          <h1 className="text-3xl text-black font-semibold text-center">ระบบเลือกตั้ง</h1>
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
                className="w-full text-black bg-white input input-bordered input-teal-500"
                placeholder="เลขประจำตัวนักเรียนนักศึกษา"
              />
            </div>
            <div>
              <button
                type="submit"
                className="btn bg-teal-500 w-full text-black border-none"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          <hr className="my-3" />
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default LoginPage;
