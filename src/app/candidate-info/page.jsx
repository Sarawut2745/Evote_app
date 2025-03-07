"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer";

export default function CandidatePage() {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/election", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลผู้สมัครได้");
        }

        const data = await res.json();
        setPostData(data.posts);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#d6ccc2] shadow-md p-5 flex items-center justify-between rounded-lg">
        <div className="flex items-center space-x-4">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-2xl font-semibold text-gray-800">การเลือกตั้งวิทยาลัย</h1>
        </div>
        <nav>
          <ul className="flex space-x-6 text-gray-700">
            <li>
              <Link href="/" className="hover:text-blue-500 transition duration-300">หน้าหลัก</Link>
            </li>
            <li>
              <Link href="/candidate-info" className="hover:text-blue-500 transition duration-300">ข้อมูลผู้สมัคร</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-blue-500 transition duration-300">เข้าสู่ระบบ</Link>
            </li>
          </ul>
        </nav>
      </header>

      <section className="py-16 bg-blue-50 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">ผู้สมัคร</h2>
          <p className="mt-2 text-lg text-gray-600">องค์การนักวิชาชีพในอนาคตแห่งประเทศไทย</p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-6 md:px-10">
          {postData
            .sort((a, b) => a.number_no - b.number_no)
            .map((candidate) => (
              <Link key={candidate._id} href={`/candidate-info/${candidate._id}`} passHref>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105">
                  <div className="relative w-full h-60">
                    {candidate.img_profile ? (
                      <Image
                        src={`/assets/election/profile/${candidate.img_profile}`}
                        alt={candidate.name}
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image Available</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white text-4xl font-bold p-3 rounded-full">
                      {candidate.number_no}
                    </div>
                  </div>
                  <div className="p-6 text-left space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">{`เบอร์ ${candidate.number_no}`}</h3>
                    <p className="text-sm text-gray-600">{candidate.name} {candidate.lastname}</p>
                    <p className="text-sm text-gray-500">ชมรมวิชาชีพ {candidate.department}</p>
                    <p className="mt-2 text-sm text-gray-700 italic">"{candidate.party_slogan}"</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
