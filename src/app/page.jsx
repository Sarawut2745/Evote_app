"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ElectionPage() {
  const [postData, setPostData] = useState([]); // Store the posts data
  const [loading, setLoading] = useState(true); // Track loading state

  // Use useEffect to fetch posts data when the component mounts
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/election", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPostData(data.posts); // Set the posts data to state
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    getPosts();
  }, []); // Empty dependency array to run once when the component mounts

  // Show a loading message until the data is fetched
  if (loading) {
    return <div className="text-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white p-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">การเลือกตั้ง 2025</h1>
            <p>โปรดเลือกผู้สมัครที่คุณเชื่อมั่น</p>
          </div>
          <Link
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
            href={`/login`}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            เบอร์ผู้สมัครในการเลือกตั้ง
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mapping through posts data */}
            {postData.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
              >
                {/* Image with fixed height */}
                <div className="relative h-64">
                  <Image
                    src={`/assets/election/profile/${candidate.img_profile}`}
                    alt={candidate.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {candidate.name + " " + candidate.lastname}
                  </h3>
                  <p className="text-gray-600">
                    {candidate.party_slogan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 การเลือกตั้งไทย - ทุกสิทธิ์สงวนไว้</p>
        </div>
      </footer>
    </div>
  );
}
