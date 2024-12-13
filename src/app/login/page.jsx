"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// Loading Modal Component
const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-lg flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-teal-500 animate-spin mb-4" />
        <p className="text-xl text-black">กำลังเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
};

function LoginPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  // Carousel images (replace with your actual images)
  const carouselImages = [
    "/assets/banner/banner_1.jpg",
    "/assets/banner/banner_2.jpg",
    "/assets/banner/banner_3.jpg",
    "/assets/banner/banner_4.jpg",
  ];

  useEffect(() => {
    if (session) {
      // ตรวจสอบ role และเปลี่ยนเส้นทางตาม role
      if (session.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/vote");
      }
    }

    // Carousel auto-slide functionality
    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [session, router]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        name,
        redirect: false,
      });

      if (res.error) {
        setError("ไม่พบผู้ใช้");
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {/* Loading Modal */}
      {isLoading && <LoadingModal />}

      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide
                ? 'opacity-100'
                : 'opacity-0'
                }`}
            >
              <Image
                src={image}
                width={1920}
                height={1080}
                alt={`Carousel background ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}

          {/* Carousel Navigation */}
          <button
            onClick={handlePrevSlide}
            className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 
              bg-white/30 p-2 rounded-full hover:bg-white/50 transition"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            onClick={handleNextSlide}
            className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 
              bg-white/30 p-2 rounded-full hover:bg-white/50 transition"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>

        {/* Login Form */}
        <div className="relative z-10 w-full max-w-xl p-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <h1 className="text-3xl text-black font-semibold text-center mb-6">
            เลือกตั้งนายกองค์การ
          </h1>
          <h1 className="text-3xl text-black font-semibold text-center mb-6">
            นักวิชาชีพในอนาคตแห่งประเทศไทย
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="text-base label-text text-black">
                  เลขประจำตัวนักเรียนนักศึกษา
                </span>
              </label>
              <input
                type="text"
                value={name}
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
                  focus:outline-none focus:ring-2 focus:ring-teal-400
                  flex items-center justify-center gap-2"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default LoginPage;