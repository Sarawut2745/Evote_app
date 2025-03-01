"use client"
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function LoginPage() {
  const [name, setName] = useState(""); // กำหนดค่าเริ่มต้นให้กับตัวแปรชื่อ
  const [posonal_number, setPosonalNumber] = useState(""); // กำหนดค่าเริ่มต้นให้กับตัวแปรรหัสผ่าน
  const [error, setError] = useState(""); // กำหนดค่าเริ่มต้นให้กับข้อความข้อผิดพลาด
  const [isLoading, setIsLoading] = useState(false); // กำหนดค่าเริ่มต้นให้กับตัวแปรที่ใช้ในการเช็คสถานะการโหลด
  const [successMessage, setSuccessMessage] = useState(""); // กำหนดค่าเริ่มต้นให้กับข้อความแจ้งเตือนความสำเร็จ

  const router = useRouter(); // ใช้เพื่อการนำทางไปยังหน้าต่างๆ
  const { data: session, status } = useSession(); // ใช้ข้อมูล session และสถานะการเข้าสู่ระบบจาก next-auth

  // ตรวจสอบสถานะการเข้าสู่ระบบ หากผู้ใช้ล็อกอินแล้วจะทำการเปลี่ยนหน้า
  useEffect(() => {
    if (session) {
      // หากผู้ใช้มี session อยู่ จะทำการเปลี่ยนเส้นทางไปยังหน้าเหมาะสมตาม role
      if (session.user.role === "admin") {
        router.replace("/admin"); // หากเป็น admin จะไปที่หน้า admin
      } else {
        router.replace("/vote"); // หากไม่ใช่ admin จะไปที่หน้า vote
      }
    }
  }, [session, router]); // การใช้งาน session และ router ใน useEffect

  // ใช้สำหรับเช็คสถานะการโหลดและแสดงสถานะการโหลด
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true); // หากสถานะเป็น "loading" จะตั้งค่า isLoading เป็น true
    } else {
      setIsLoading(false); // หากสถานะไม่เป็น "loading" จะตั้งค่า isLoading เป็น false
    }
  }, [status]); // ใช้ effect นี้เมื่อสถานะการโหลดเปลี่ยนแปลง

  // ฟังก์ชันที่ใช้สำหรับการส่งฟอร์มเข้าสู่ระบบ
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าจอเมื่อฟอร์มถูกส่ง
    setError(""); // เคลียร์ข้อความข้อผิดพลาดเมื่อมีการส่งฟอร์มใหม่
    setSuccessMessage(""); // เคลียร์ข้อความความสำเร็จ
    setIsLoading(true); // ตั้งค่าการโหลดเป็น true
  
    // ตรวจสอบว่าผู้ใช้กรอกชื่อและรหัสผ่านหรือยัง
    if (!name || !posonal_number) {
      setError("กรุณากรอกชื่อและรหัสผ่าน"); // หากยังไม่กรอกให้แสดงข้อผิดพลาด
      setIsLoading(false); // ตั้งค่าการโหลดเป็น false เมื่อกรอกข้อมูลไม่ครบ
      return;
    }
  
    try {
      // ใช้ฟังก์ชัน signIn จาก next-auth เพื่อเข้าสู่ระบบ
      const res = await signIn("credentials", {
        name,
        posonal_number, // ส่งข้อมูลรหัสผ่านแทน
        redirect: false, // ไม่ให้รีไดเร็กต์อัตโนมัติ
      });
  
      // หากการเข้าสู่ระบบไม่สำเร็จ ให้แสดงข้อความข้อผิดพลาด
      if (res?.error) {
        setError("ผู้ใช้ไม่สามารถเข้าสู่ระบบได้");
        setIsLoading(false); // ตั้งค่าการโหลดเป็น false
        return;
      }
  
      // การรีไดเร็กต์จะถูกจัดการโดย useEffect ที่ตรวจสอบ session
      setSuccessMessage("เข้าสู่ระบบสำเร็จ!"); // เพิ่มข้อความแจ้งเตือนความสำเร็จ
  
    } catch (error) {
      console.log(error); // แสดงข้อผิดพลาดในคอนโซล
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ"); // แสดงข้อความข้อผิดพลาด
      setIsLoading(false); // ตั้งค่าการโหลดเป็น false
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar /> {/* แสดง Navbar ด้านบนของหน้า */}
  
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-teal-400 via-blue-300 to-purple-400 px-4 py-8">
        <div className="absolute inset-0 bg-grid-white/30 bg-grid-8 opacity-10"></div> {/* พื้นหลังที่มีลวดลาย Grid */}
  
        {/* หน้าจอแสดงสถานะการโหลด */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center">
            <div className="loader border-t-4 border-teal-500 rounded-full w-12 h-12 animate-spin"></div> {/* แสดงวงหมุนเมื่อกำลังโหลด */}
          </div>
        )}
  
        {/* เนื้อหาหลัก */}
        <div className="relative z-10 w-full max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl text-black font-semibold text-center mb-4">
            เลือกตั้งนายกองค์การ {/* หัวข้อสำหรับการเลือกตั้งนายก */}
          </h1>
          <h1 className="text-2xl sm:text-3xl text-black font-semibold text-center mb-6">
            นักวิชาชีพในอนาคตแห่งประเทศไทย {/* หัวข้อย่อยเกี่ยวกับนักวิชาชีพในอนาคต */}
          </h1>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ฟอร์มกรอกข้อมูลเข้าสู่ระบบ */}
            <div>
              <label className="label">
                <span className="text-sm sm:text-base label-text text-black">
                  เลขประจำตัวนักเรียนนักศึกษา {/* ระบุฟิลด์เลขประจำตัว */}
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} // การอัพเดตค่าเลขประจำตัว
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
                  รหัสผ่าน {/* ระบุฟิลด์รหัสผ่าน */}
                </span>
                <span className="text-red_1-500 text-sm ml-1">*</span>
                <span className="text-red_1-500 text-sm ml-2">
                  รหัสผ่านคือ เลขประจำตัวประชาชน {/* ข้อความคำอธิบายเกี่ยวกับรหัสผ่าน */}
                </span>
              </label>
              <input
                type="password"
                value={posonal_number} // เก็บข้อมูลรหัสผ่าน
                onChange={(e) => setPosonalNumber(e.target.value)} // อัพเดตข้อมูลรหัสผ่าน
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
                เข้าสู่ระบบ {/* ปุ่มสำหรับการเข้าสู่ระบบ */}
              </button>
            </div>
          </form>
  
          {error && (
            <p className="text-red_1-500 text-center mt-3 text-sm sm:text-base">
              {error} {/* แสดงข้อความข้อผิดพลาดหากมี */}
            </p>
          )}
  
          {successMessage && (
            <p className="text-green-500 text-center mt-3 text-sm sm:text-base">
              {successMessage} {/* แสดงข้อความแจ้งเตือนความสำเร็จ */}
            </p>
          )}
        </div>
      </main>
  
      <Footer /> {/* แสดง Footer ที่ด้านล่างของหน้า */}
    </div>
  );  
}

export default LoginPage;
