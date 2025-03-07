"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [postData, setPostData] = useState([]); // เก็บข้อมูลโพสต์ของผู้สมัคร
  const [selectedPost, setSelectedPost] = useState(null); // เก็บข้อมูลโพสต์ที่ถูกเลือก
  const [modalOpen, setModalOpen] = useState(false); // ใช้จัดการสถานะการเปิด/ปิด modal
  const [isClosing, setIsClosing] = useState(false); // ใช้ติดตามสถานะการปิด modal
  const [isNoVote, setIsNoVote] = useState(false); // ใช้ติดตามสถานะการเลือกไม่โหวต
  const [countdown, setCountdown] = useState(""); // เก็บเวลานับถอยหลัง

  const { data: session, status } = useSession(); // ใช้ session ในการตรวจสอบสถานะการเข้าสู่ระบบ

  // ฟังก์ชันคำนวณเวลาในการนับถอยหลัง
  const calculateCountdown = () => {
    const now = new Date();
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(); // แปลงเวลาเป็นวินาที
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
      setCountdown("เวลาการเลือกตั้งหมดเวลาลงแล้ว!"); // เมื่อเวลาเริ่มแล้ว
    } else {
      const hours = Math.floor(timeDifference / 3600);
      const minutes = Math.floor((timeDifference % 3600) / 60);
      const seconds = timeDifference % 60;
      setCountdown(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`); // แสดงเวลาในการนับถอยหลัง
    }
  };

  useEffect(() => {
    // เริ่มต้นการนับถอยหลังเมื่อ component โหลด
    const countdownInterval = setInterval(calculateCountdown, 1000);

    // ล้างการตั้งเวลาเมื่อ component ถูกทำลาย
    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    // ดึงข้อมูลผู้สมัครเมื่อ component โหลด
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
      }
    };

    getPosts();
  }, []);

  // ฟังก์ชันในการลงคะแนนเสียง
  const handleVote = async () => {
    try {
      const voteData = isNoVote
        ? { user_type: session?.user?.user_type, number_no: 0 } // ถ้าเลือกไม่ลงคะแนน
        : {
            user_type: session?.user?.user_type,
            number_no: selectedPost?.number_no, // ลงคะแนนให้ผู้สมัคร
          };

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voteData),
      });

      if (res.ok) {
        console.log("ลงคะแนนเรียบร้อยแล้ว");
        closeModal();
        await signOut({ redirect: true, callbackUrl: "/" });
      } else {
        console.error("ไม่สามารถลงคะแนนได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลงคะแนน:", error);
    }
  };

  // ฟังก์ชันเปิด modal สำหรับเลือกผู้สมัคร
  const openModal = (post) => {
    setSelectedPost({
      ...post,
      user_type: session?.user?.user_type, // เพิ่ม user_type จาก session
    });
    setIsNoVote(false); // รีเซ็ตสถานะการเลือกไม่ลงคะแนน
    setModalOpen(true); // เปิด modal
  };

  // ฟังก์ชันเปิด modal สำหรับเลือกไม่ลงคะแนน
  const openNoVoteModal = () => {
    setSelectedPost(null); // ไม่มีผู้สมัครที่เลือก
    setIsNoVote(true); // ตั้งสถานะให้เป็นการเลือกไม่ลงคะแนน
    setModalOpen(true); // เปิด modal
  };

  // ฟังก์ชันปิด modal
  const closeModal = () => {
    setIsClosing(true); // ตั้งสถานะการปิด modal
    setTimeout(() => {
      setModalOpen(false); // ปิด modal หลังจาก 300ms
      setIsClosing(false); // รีเซ็ตสถานะการปิด modal
    }, 300);
  };

  // ถ้ากำลังโหลด session
  if (status === "loading") {
    return <div>กำลังโหลด...</div>;
  }

  // ถ้าไม่ได้เข้าสู่ระบบ จะถูกเปลี่ยนเส้นทางไปที่หน้า login
  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow bg-gray-100 text-center p-8 md:p-10 lg:p-12">
          <h3 className="text-black text-xl md:text-3xl lg:text-4xl font-bold mb-10">
            รายชื่อผู้สมัคร
          </h3>

          <h1></h1>

          {/* ถ้ามีข้อมูลผู้สมัคร */}
          {postData && postData.length > 0 ? (
            <>
              {/* แสดงรายชื่อผู้สมัครในรูปแบบกริด */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {postData.map((val) => (
                  <div
                    key={val._id}
                    className="shadow-xl p-6 rounded-lg flex flex-col items-center bg-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    {/* ชื่อผู้สมัคร */}
                    <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5">
                      {val.name}
                    </h4>

                    {/* รูปภาพของผู้สมัคร */}
                    <div className="flex justify-center w-full mb-3">
                      <Image
                        className="rounded-lg shadow-md"
                        src={`/assets/election/profile/${val.img_profile}`}
                        width={220}
                        height={220}
                        alt={val.name}
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {/* ปุ่มเลือกผู้สมัคร */}
                    <button
                      onClick={() => openModal(val)}
                      className="relative h-12 w-44 md:w-48 lg:w-52 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl"
                    >
                      <span className="relative z-10">เลือก</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* ปุ่มสำหรับเลือกไม่ลงคะแนน */}
              <div className="relative">
                <button
                  onClick={openNoVoteModal}
                  className="fixed bottom-16 right-6 h-16 w-64 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                >
                  <span className="relative z-10">ไม่ประสงค์ลงคะแนน</span>
                </button>
              </div>
            </>
          ) : (
            // ถ้าไม่มีข้อมูลผู้สมัคร
            <p className="text-gray-700 text-lg md:text-xl italic">
              ไม่มีข้อมูลผู้สมัครในขณะนี้
            </p>
          )}
        </div>

        {/* ส่วนแสดงเวลานับถอยหลัง */}
        <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white text-center py-2 z-40">
          <p>เวลานับถอยหลังการเลือกตั้ง: {countdown}</p>
        </div>

        <Footer />

        {modalOpen && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 
      transition-opacity duration-300 ease-in-out ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
            onClick={closeModal}
          >
            <div
              className={`bg-white rounded-lg shadow-lg max-w-4xl w-full transform transition-transform duration-300 
        ease-in-out ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* หัวข้อ Modal ที่แสดงข้อความยืนยัน */}
                <h2 className="text-xl text-black font-bold mb-6 text-center">
                  {isNoVote ? "ยืนยันไม่ประสงค์ลงคะแนน" : "ยืนยันการลงคะแนน"}
                </h2>

                {/* ถ้าไม่ใช่การเลือกไม่ลงคะแนน แสดงข้อมูลของผู้สมัคร */}
                {!isNoVote && selectedPost && (
                  <>
                    <div className="flex justify-between gap-8 mb-6">
                      <div className="flex-1 flex justify-center">
                        {/* รูปภาพของผู้สมัคร */}
                        <Image
                          className="rounded-md"
                          src={`/assets/election/profile/${selectedPost.img_profile}`}
                          width={200}
                          height={200}
                          alt={selectedPost.name}
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      <div className="flex-1 flex justify-center">
                        {/* รูปภาพผลงานของผู้สมัคร */}
                        <Image
                          className="rounded-md"
                          src={`/assets/election/work/${selectedPost.img_work}`}
                          width={320}
                          height={200}
                          alt={`ผลงานของ ${selectedPost.name}`}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>

                    {/* แสดงข้อมูลผู้สมัคร */}
                    <div className="mb-6 flex justify-center">
                      <div className="flex w-full max-w-3xl mx-auto">
                        <div className="flex-1 pr-4 pl-32">
                          <div className="mb-4">
                            <strong className="text-black font-bold">
                              ชื่อ:
                            </strong>{" "}
                            {selectedPost.name} {selectedPost.lastname}
                          </div>

                          <div className="mb-4">
                            <strong className="text-black font-bold">
                              ชั้นเรียน:
                            </strong>{" "}
                            {selectedPost.class_room}
                          </div>

                          <div className="mb-4">
                            <strong className="text-black font-bold">
                              แผนก:
                            </strong>{" "}
                            {selectedPost.department}
                          </div>
                        </div>

                        <div className="flex-1 pl-4">
                          <div className="mb-4">
                            <strong className="text-black font-bold">
                              เกรด:
                            </strong>{" "}
                            {selectedPost.grade}
                          </div>

                          <div className="mb-4">
                            <strong className="text-black font-bold">
                              เบอร์หมายเลข:
                            </strong>{" "}
                            {selectedPost.number_no}
                          </div>

                          <div className="mb-4">
                            <strong className="text-black font-bold">
                              เลขประจำตัว:
                            </strong>{" "}
                            {selectedPost.personal_ip}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* แสดงนโยบายพรรค */}
                    <div className="mb-6">
                      <p className="mb-4">
                        <strong className="text-black font-bold">
                          นโยบายพรรค:
                        </strong>
                      </p>
                      <p className="bg-gray-100 p-4 rounded-lg text-justify">
                        {selectedPost.party_policies}
                      </p>
                    </div>

                    {/* แสดงรายละเอียดพรรค */}
                    <div className="mb-6">
                      <p className="mb-4">
                        <strong className="text-black font-bold">
                          รายละเอียดพรรค:
                        </strong>
                      </p>
                      <p className="bg-gray-100 p-4 rounded-lg text-justify">
                        {selectedPost.party_details}
                      </p>
                    </div>
                  </>
                )}

                {/* ถ้าเลือกไม่ลงคะแนน */}
                {isNoVote && (
                  <div className="text-center">
                    <p className="text-lg text-gray-700 mb-6">
                      คุณแน่ใจหรือไม่ว่าต้องการไม่ลงคะแนน?
                    </p>
                  </div>
                )}
              </div>

              {/* ปุ่มยืนยันหรือยกเลิก */}
              <div className="p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeModal}
                  className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mr-2"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleVote}
                  className={`btn text-white py-3 px-4 rounded-lg ${
                    isNoVote
                      ? "bg-red_1-500 hover:bg-red_1-600"
                      : "bg-red_1-500 hover:bg-red_1-600"
                  }`}
                >
                  {isNoVote ? "ไม่ลงคะแนน" : "ยืนยัน"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
