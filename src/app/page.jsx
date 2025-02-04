"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ElectionPage() {
  const [postData, setPostData] = useState([]); // Store the posts data
  const [loading, setLoading] = useState(true); // Track loading state
  const [countdown, setCountdown] = useState(""); // State to store the countdown timer
  const [selectedImage, setSelectedImage] = useState(null); // State to manage selected image for modal

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

  // Function to calculate and update the countdown timer
  const calculateCountdown = () => {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(); // Convert current time to seconds
    let targetTime = 8 * 3600; // 08:00:00 in seconds

    if (currentTime >= targetTime && currentTime < 15 * 3600) {
      // If the current time is between 08:00 and 15:00, countdown to 15:00
      targetTime = 15 * 3600;
    } else if (currentTime < targetTime) {
      // If the current time is before 08:00, countdown to 08:00 of the same day
      targetTime = 8 * 3600;
    }

    const timeDifference = targetTime - currentTime;
    if (timeDifference <= 0) {
      setCountdown("เวลาการเลือกตั้งเริ่มแล้ว!");
    } else {
      const hours = Math.floor(timeDifference / 3600);
      const minutes = Math.floor((timeDifference % 3600) / 60);
      const seconds = timeDifference % 60;
      setCountdown(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
    }
  };

  useEffect(() => {
    // Start the countdown when the component mounts
    const countdownInterval = setInterval(calculateCountdown, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(countdownInterval);
  }, []);

  // Function to handle opening the image in a modal
  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Show a loading message until the data is fetched
  if (loading) {
    return <div className="text-center text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="bg-gray-50 font-sans">
      {/* Header */}
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

      {/* Main Content */}
      <main className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-black-500">
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

      {/* Countdown Timer */}
      <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white text-center py-2 z-40">
        <p>เวลานับถอยหลังการเลือกตั้ง: {countdown}</p>
      </div>

      {/* Image Modal (Lightbox) */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-0 right-0 p-2 bg-red-600 text-white rounded-full"
            >
              X
            </button>
            {/* Selected image */}
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
