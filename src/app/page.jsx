"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ElectionPage() {
  const [postData, setPostData] = useState([]); // เก็บข้อมูลของผู้สมัคร
  const [loading, setLoading] = useState(true); // ใช้ติดตามสถานะการโหลดข้อมูล
  const [countdown, setCountdown] = useState(""); // เก็บเวลานับถอยหลัง
  const [selectedImage, setSelectedImage] = useState(null); // ใช้จัดการภาพที่เลือกสำหรับแสดงใน modal

  // ดึงข้อมูลผู้สมัครเมื่อ component โหลดเสร็จ
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/election", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลผู้สมัครได้");
        }

        const data = await res.json();
        setPostData(data.posts); // เก็บข้อมูลของผู้สมัครใน state
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      } finally {
        setLoading(false); // เมื่อโหลดเสร็จแล้วจะตั้งค่า loading เป็น false
      }
    };

    getPosts();
  }, []); // ทำงานแค่ครั้งแรกที่ component ถูกโหลด

  // ฟังก์ชันคำนวณเวลาในการนับถอยหลัง
  const calculateCountdown = () => {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(); // แปลงเวลาเป็นวินาที
    let targetTime = 8 * 3600; // ตั้งเวลาเป้าหมายเป็น 08:00:00 ในหน่วยวินาที

    if (currentTime >= targetTime && currentTime < 15 * 3600) {
      // ถ้าเวลาปัจจุบันอยู่ระหว่าง 08:00 - 15:00 ให้ตั้งเป้าหมายเป็น 15:00
      targetTime = 15 * 3600;
    } else if (currentTime < targetTime) {
      // ถ้าเวลาปัจจุบันก่อน 08:00 ให้ตั้งเป้าหมายเป็น 08:00
      targetTime = 8 * 3600;
    }

    const timeDifference = targetTime - currentTime;
    if (timeDifference <= 0) {
      setCountdown("เวลาการเลือกตั้งหมดเวลาลงแล้ว!");
    } else {
      const hours = Math.floor(timeDifference / 3600);
      const minutes = Math.floor((timeDifference % 3600) / 60);
      const seconds = timeDifference % 60;
      setCountdown(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
    }
  };

  useEffect(() => {
    // เริ่มต้นการนับถอยหลังเมื่อ component โหลด
    const countdownInterval = setInterval(calculateCountdown, 1000);

    // ล้างการตั้งเวลาเมื่อ component ถูกทำลาย
    return () => clearInterval(countdownInterval);
  }, []);

  // ฟังก์ชันเปิด modal ภาพผู้สมัคร
  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  // ฟังก์ชันปิด modal ภาพ
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // แสดงข้อความโหลดข้อมูลจนกว่าจะได้รับข้อมูล
  if (loading) {
    return <div className="text-center text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="bg-gray-50 font-sans">
      {/* ส่วนหัว */}
      <header className="bg-blue-700 text-white p-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">การเลือกตั้ง 2025</h1>
            <p>โปรดเลือกผู้สมัครที่คุณเชื่อมั่น</p>
          </div>
          <Link
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold"
            href={`/login`}
          >
            Login
          </Link>
        </div>
      </header>

      {/* เนื้อหาหลัก */}
      <main className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-black-500">
            เบอร์ผู้สมัครในการเลือกตั้ง
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* การแสดงข้อมูลผู้สมัคร */}
            {postData.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
              >
                {/* รูปภาพผู้สมัคร */}
                <div className="relative h-64">
                  <Image
                    src={`/assets/election/profile/${candidate.img_profile}`}
                    alt={candidate.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full cursor-pointer"
                    onClick={() => openImageModal(`/assets/election/profile/${candidate.img_profile}`)}
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {candidate.name + " " + candidate.lastname}
                  </h3>
                  <p className="text-gray-600">{candidate.party_slogan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* เวลานับถอยหลัง */}
      <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white text-center py-2 z-40">
        <p>เวลานับถอยหลังการเลือกตั้ง: {countdown}</p>
      </div>

      {/* Modal สำหรับแสดงภาพผู้สมัคร */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            {/* ปุ่มปิด modal */}
            <button
              onClick={closeImageModal}
              className="absolute top-0 right-0 p-2 bg-red_1-600 text-white rounded-full"
            >
              X
            </button>
            {/* รูปภาพที่เลือก */}
            <Image
              src={selectedImage}
              alt="Selected Candidate"
              width={800}
              height={800}
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
