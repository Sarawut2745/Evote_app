"use client";

import React, { useState, useEffect } from 'react';
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function RegisterPage() {
    const [name, setName] = useState("");
    const [posonal_number, setPosonal_number] = useState("");
    const [user_type, setUserType] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    // Check if the user is logged in, then redirect
    useEffect(() => {
        if (session) {
            router.push('/vote');
        }
    }, [session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !posonal_number || !user_type) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name, 
                    posonal_number, 
                    user_type 
                })
            });

            const data = await res.json();

            if (res.ok) {
                setError("");
                setSuccess("ลงทะเบียนสำเร็จ");
                e.target.reset();
            } else {
                setError(data.message || "การลงทะเบียนล้มเหลว");
            }

        } catch (error) {
            setError("เกิดข้อผิดพลาดในการลงทะเบียน: " + error.message);
        }
    }

    return (
        <Container>
            <Navbar />
            <div className='flex-grow bg-white'>
                <div className="flex justify-center items-center">
                    <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
                        <h3 className='text-3xl'>ลงทะเบียน</h3>
                        <hr className='my-3' />
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {success}
                                </div>
                            )}

                            <input 
                                type="text" 
                                onChange={(e) => setName(e.target.value)} 
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='เลขประจำตัวนักเรียนนักศึกษา' 
                            />
                            <input 
                                type="password" 
                                onChange={(e) => setPosonal_number(e.target.value)} 
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='รหัสผ่าน' 
                            />
                            <input 
                                type="text" 
                                onChange={(e) => setUserType(e.target.value)} 
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='ระบุชั้นเรียน' 
                            />
                            <button 
                                type='submit' 
                                className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'
                            >
                                สมัครสมาชิก
                            </button>
                        </form>
                        <hr className='my-3' />
                        <p>
                            ไปที่หน้า <Link href="/login" className='text-blue-500 hover:underline'>เข้าสู่ระบบ</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </Container>
    )
}

export default RegisterPage;
