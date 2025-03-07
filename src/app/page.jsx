"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
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

  const slides = [
    { image: "/images/slide/slide1.jpg" },
    { image: "/images/slide/slide2.jpg" },
    { image: "/images/slide/slide3.jpg" },
    { image: "/images/slide/slide4.jpg" },
    { image: "/images/slide/slide5.jpg" },
    { image: "/images/slide/slide6.jpg" },
    { image: "/images/slide/slide7.jpg" },
    { image: "/images/slide/slide8.jpg" },
    { image: "/images/slide/slide9.jpg" },
  ];

  const moveSlide = (direction) => {
    setCurrentSlide(
      (prev) => (prev + direction + slides.length) % slides.length
    );
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  useEffect(() => {
    const startAutoPlay = () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    };

    startAutoPlay();

    return () => {
      clearInterval(slideInterval.current);
    };
  }, []);

  const pauseSlider = () => {
    clearInterval(slideInterval.current);
  };

  const resumeSlider = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#d6ccc2] shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-lg font-semibold">
            การเลือกตั้งวิทยาลัย อาชีวศึกษา สุพรรณบุรี
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-4 text-gray-700">
            <li>
              <a href="/" className="hover:text-blue-500">
                หน้าหลัก
              </a>
            </li>
            <li>
              <a href="/candidate-info" className="hover:text-blue-500">
                ข้อมูลผู้สมัคร
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-blue-500">
                เข้าสู่ระบบ
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <Image
          src="/images/banner.jpg"
          alt="Voting Banner"
          layout="responsive"
          width={1500}
          height={500}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h2 className="text-3xl font-bold">ยินดีต้อนรับ</h2>
          <p className="mt-2 text-lg">
            เพิ่มความสะดวกสบายในการเลือกตั้งภายในวิทยาลัย
          </p>
          <a href="/login">
            <button className="mt-4 bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700">
              เข้าสู่ระบบ
            </button>
          </a>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl font-bold">เกี่ยวกับ</h2>

        <div
          className="relative max-w-5xl mx-auto mt-8 overflow-hidden"
          onMouseEnter={pauseSlider}
          onMouseLeave={resumeSlider}
        >
          {/* Slider container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full p-4">
                <div className="relative w-full h-64">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-2 rounded-r-lg shadow-md focus:outline-none"
            onClick={() => moveSlide(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-2 rounded-l-lg shadow-md focus:outline-none"
            onClick={() => moveSlide(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots navigation */}
          <div className="flex justify-center mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`mx-1 w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-gray-800" : "bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>

        {/* เนื้อหาส่วนอื่นๆ ของหน้า About */}
      </section>

      {/* Candidates Section */}
      <section className="py-16 bg-blue-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">ผู้สมัคร</h2>
          <p className="mt-2 text-lg text-gray-600">
            องค์การนักวิชาชีพในอนาคตแห่งประเทศไทย
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8">
          {postData
            .sort((a, b) => a.number_no - b.number_no) // Sort candidates by number_no
            .map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative w-full h-60">
                  <Image
                    src={`/assets/election/profile/${candidate.img_profile}`} // ใช้รูปภาพจากข้อมูลผู้สมัคร
                    alt={candidate.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-0 left-0 bg-yellow-500 text-white text-4xl font-bold p-2">
                    {candidate.number_no} {/* เบอร์ผู้สมัคร */}
                  </div>
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-800">{`เบอร์ ${candidate.number_no}`}</h3>
                  <p className="text-sm text-gray-600">
                    {candidate.name} {candidate.lastname}
                  </p>
                  <p className="text-sm text-gray-500">
                    ชมรมวิชาชีพ{candidate.department}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 italic">
                    {`"${candidate.party_slogan}"`} {/* คำขวัญ */}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
