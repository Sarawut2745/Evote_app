"use client";

import React, { useState, useEffect } from 'react';
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function RegisterPage() {
    // กำหนดค่าตัวแปร state เพื่อเก็บข้อมูลที่กรอกในฟอร์ม
    const [name, setName] = useState("");
    const [posonal_number, setPosonal_number] = useState("");
    const [user_type, setUserType] = useState("");
    const [error, setError] = useState("");  // เก็บข้อความข้อผิดพลาด
    const [success, setSuccess] = useState(""); // เก็บข้อความการลงทะเบียนสำเร็จ
    const { data: session } = useSession(); // ใช้ session เพื่อตรวจสอบสถานะการเข้าสู่ระบบ
    const router = useRouter(); // ใช้ useRouter สำหรับการเปลี่ยนเส้นทาง

    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือยัง ถ้าใช่ให้ redirect ไปที่หน้า vote
    useEffect(() => {
        if (session) {
            router.push('/vote');
        }
    }, [session, router]);

    // ฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้ส่งฟอร์ม
    const handleSubmit = async (e) => {
        e.preventDefault(); // ป้องกันการโหลดหน้าใหม่

        // ตรวจสอบว่าไม่มีข้อมูลที่จำเป็นกรอก
        if (!name || !posonal_number || !user_type) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");  // แสดงข้อความข้อผิดพลาด
            return;
        }

        try {
            // ส่งข้อมูลไปที่ API เพื่อทำการลงทะเบียน
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name,  // ชื่อผู้ใช้
                    posonal_number,  // หมายเลขประจำตัว
                    user_type  // ประเภทผู้ใช้
                })
            });

            // รับข้อมูลจาก API
            const data = await res.json();

            // ถ้าการลงทะเบียนสำเร็จ
            if (res.ok) {
                setError("");  // ล้างข้อความข้อผิดพลาด
                setSuccess("ลงทะเบียนสำเร็จ");  // แสดงข้อความสำเร็จ
                e.target.reset();  // รีเซ็ตฟอร์ม
            } else {
                setError(data.message || "การลงทะเบียนล้มเหลว");  // แสดงข้อความข้อผิดพลาด
            }

        } catch (error) {
            setError("เกิดข้อผิดพลาดในการลงทะเบียน: " + error.message);  // หากเกิดข้อผิดพลาดในการเชื่อมต่อ API
        }
    }

    return (
        <Container>
            <Navbar /> {/* แสดงแถบเมนูด้านบน */}
            <div className='flex-grow bg-white'> {/* ส่วนหลักของหน้า */}
                <div className="flex justify-center items-center">
                    <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'> {/* กรอบฟอร์ม */}
                        <h3 className='text-3xl'>ลงทะเบียน</h3> {/* หัวข้อฟอร์ม */}
                        <hr className='my-3' /> {/* เส้นแบ่ง */}
                        <form onSubmit={handleSubmit}> {/* ฟอร์มลงทะเบียน */}
                            {/* ถ้ามีข้อผิดพลาด จะโชว์ข้อความข้อผิดพลาด */}
                            {error && (
                                <div className='bg-red_1-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {error}
                                </div>
                            )}
    
                            {/* ถ้ามีข้อความสำเร็จ จะโชว์ข้อความสำเร็จ */}
                            {success && (
                                <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {success}
                                </div>
                            )}
    
                            {/* ฟิลด์กรอกเลขประจำตัวนักเรียน/นักศึกษา */}
                            <input 
                                type="text" 
                                onChange={(e) => setName(e.target.value)} 
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='เลขประจำตัวนักเรียนนักศึกษา' 
                            />
                            
                            {/* ฟิลด์กรอกรหัสผ่าน */}
                            <input 
                                type="password" 
                                onChange={(e) => setPosonal_number(e.target.value)} 
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='รหัสผ่าน' 
                            />
                            
                            {/* ฟิลด์กรอกชั้นเรียน */}
                            <input 
                                type="text" 
                                onChange={(e) => setUserType(e.target.value)} 
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='ระบุชั้นเรียน' 
                            />
                            
                            {/* ปุ่มสำหรับส่งฟอร์มลงทะเบียน */}
                            <button 
                                type='submit' 
                                className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'
                            >
                                สมัครสมาชิก
                            </button>
                        </form>
                        <hr className='my-3' /> {/* เส้นแบ่ง */}
                        <p>
                            ไปที่หน้า <Link href="/login" className='text-blue-500 hover:underline'>เข้าสู่ระบบ</Link> {/* ลิงก์ไปหน้าล็อกอิน */}
                        </p>
                    </div>
                </div>
            </div>
            <Footer /> {/* แสดงฟุตเตอร์ */}
        </Container>
    )
    
}

export default RegisterPage;
