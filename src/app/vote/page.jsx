"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Home() {
  const [postData, setPostData] = useState([]); // เก็บข้อมูลโพสต์ของผู้สมัคร
  const [selectedPost, setSelectedPost] = useState(null); // เก็บข้อมูลโพสต์ที่ถูกเลือก
  const [modalOpen, setModalOpen] = useState(false); // ใช้จัดการสถานะการเปิด/ปิด modal
  const [isClosing, setIsClosing] = useState(false); // ใช้ติดตามสถานะการปิด modal
  const [isNoVote, setIsNoVote] = useState(false); // ใช้ติดตามสถานะการเลือกไม่โหวต

  const { data: session, status } = useSession(); // ใช้ session ในการตรวจสอบสถานะการเข้าสู่ระบบ

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
        ? { _id: session?.user?.id, user_type: session?.user?.user_type, number_no: 0 } // ถ้าเลือกไม่ลงคะแนน
        : {
            _id: session?.user?.id, // เพิ่ม _id ของผู้ใช้จาก session
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
    confirmVote(); // ยืนยันการเลือกไม่ลงคะแนนทันที
  };

  // ฟังก์ชันปิด modal
  const closeModal = () => {
    setIsClosing(true); // ตั้งสถานะการปิด modal
    setTimeout(() => {
      setModalOpen(false); // ปิด modal หลังจาก 300ms
      setIsClosing(false); // รีเซ็ตสถานะการปิด modal
    }, 300);
  };

  // ฟังก์ชันยืนยันการลงคะแนนเสียง
  const confirmVote = () => {
    MySwal.fire({
      title: isNoVote ? 'ยืนยันไม่ประสงค์ลงคะแนน?' : 'ยืนยันการลงคะแนน?',
      text: isNoVote ? 'คุณแน่ใจหรือไม่ว่าต้องการไม่ลงคะแนน?' : 'คุณแน่ใจหรือไม่ว่าต้องการยืนยันการลงคะแนน?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isNoVote ? '#d33' : '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: isNoVote ? 'ไม่ลงคะแนน' : 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        handleVote();
      }
    });
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
        <div className="flex-grow bg-gray-100 text-center p-8 md:p-10 lg:p-12 relative">
          <h3 className="text-black text-xl md:text-3xl lg:text-4xl font-bold mb-10">
            ผู้สมัครเลือกตั้ง
          </h3>

          {postData && postData.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8">
                {postData
                  .sort((a, b) => a.number_no - b.number_no) // เรียงลำดับตามหมายเลข
                  .map((candidate) => (
                    <div
                      key={candidate._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
                    >
                      <div className="relative w-full h-60">
                        <Image
                          src={`/assets/election/profile/${candidate.img_profile}`} // ใช้รูปภาพจากข้อมูลผู้สมัคร
                          alt={candidate.name}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute top-0 left-0 bg-yellow-500 text-white text-4xl font-bold p-2 rounded-br-lg">
                          {candidate.number_no} {/* เบอร์ผู้สมัคร */}
                        </div>
                      </div>
                      <div className="p-4 text-left">
                        <h3 className="text-lg font-semibold text-gray-800">{`เบอร์ ${candidate.number_no}`}</h3>
                        <p className="text-sm text-gray-600">
                          {candidate.name} {candidate.lastname}
                        </p>
                        <p className="text-sm text-gray-500">
                          ชมรมวิชาชีพ {candidate.department}
                        </p>
                        <p className="mt-2 text-sm text-gray-700 italic">
                          {`"${candidate.party_slogan}"`} {/* คำขวัญ */}
                        </p>
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => openModal(candidate)}
                            className="relative h-12 w-44 md:w-48 lg:w-52 overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
                          >
                            <span className="relative z-10">ลงคะแนน</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="fixed my-20 bottom-4 right-4">
                <button
                  onClick={openNoVoteModal}
                  className="h-16 w-64 overflow-hidden rounded-lg bg-gradient-to-r from-red_1-500 to-red_1-600 text-white font-semibold shadow-lg transition-all duration-300 hover:from-red_1-500 hover:to-red_1-600 hover:shadow-xl"
                >
                  <span className="relative z-10">ไม่ประสงค์ลงคะแนน</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-700 text-lg md:text-xl italic">
              ไม่มีข้อมูลผู้สมัครในขณะนี้
            </p>
          )}
        </div>
        <Footer className="py-5" />
        {modalOpen && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeModal}
          >
            <div
              className={`bg-white rounded-lg shadow-lg max-w-4xl w-full transform transition-transform duration-300 ease-in-out ${
                isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl text-black font-bold mb-6 text-center">
                  {isNoVote ? "ยืนยันไม่ประสงค์ลงคะแนน" : "ยืนยันการลงคะแนน"}
                </h2>
                {!isNoVote && selectedPost && (
                  <>
                    <div className="flex justify-between gap-8 mb-6">
                      <div className="flex-1 flex justify-center">
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
                        </div>
                      </div>
                    </div>
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
                {isNoVote && (
                  <div className="text-center">
                    <p className="text-lg text-gray-700 mb-6">
                      คุณแน่ใจหรือไม่ว่าต้องการไม่ลงคะแนน?
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="bg-red_1-500 hover:bg-red_1-600 text-white py-2 px-6 rounded-lg shadow-md transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmVote}
                  className={`py-2 px-6 rounded-lg shadow-md transition-all text-white ${isNoVote ? "bg-red_1-500 hover:bg-red_1-600" : "bg-green-500 hover:bg-green-600"}`}
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