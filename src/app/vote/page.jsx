"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [postData, setPostData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const getPosts = async () => {
    try {
      const res = await fetch("/api/election", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPostData(data.posts);
    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleVote = async () => {
    if (!selectedPost) return;

    const { number_no, user_type } = selectedPost;

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_type, number_no }),
      });

      if (res.ok) {
        console.log("Vote registered successfully");
        closeModal();
        await signOut({ redirect: false });
      } else {
        console.error("Failed to register vote");
      }
    } catch (error) {
      console.error("Error during vote registration:", error);
    }
  };

  const openModal = (post) => {
    setSelectedPost({
      ...post, // ข้อมูลทั้งหมดจาก postData
      user_type: session?.user?.user_type, // เพิ่มข้อมูล user_type
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setIsClosing(false);
    }, 300); // Match duration of transition
  };

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>กำลังโหลด...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow bg-white text-center p-4 md:p-6 lg:p-8 xl:p-10">
          <h3 className="text-black text-lg md:text-xl lg:text-2xl mb-6">
            รายชื่อผู้สมัคร
          </h3>
          {postData && postData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {postData.map((val) => (
                <div
                  key={val._id}
                  className="shadow-md p-4 rounded-xl flex flex-col items-center bg-white"
                >
                  <h4 className="text-lg md:text-xl mb-3">{val.name}</h4>
                  <div className="flex justify-center w-full mb-3">
                    <Image
                      className="rounded-md"
                      src={`/assets/election/profile/${val.img_profile}`}
                      width={200}
                      height={200}
                      alt={val.name}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <button
                    onClick={() => openModal(val)}
                    className="relative h-10 w-36 md:w-40 lg:w-44 overflow-hidden border border-stone-900 text-stone-900 shadow-md transition-all duration-200"
                  >
                    <span className="relative z-10">เลือก</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />

        {modalOpen && selectedPost && (
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
                <h2 className="text-xl text-black font-bold mb-6 text-center">
                  ยืนยันการลงคะแนน
                </h2>
                {/* รูปภาพผู้สมัคร และ ผลงาน */}
                <div className="flex justify-between gap-8 mb-6">
                  {/* รูปภาพผู้สมัคร */}
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

                  {/* รูปภาพผลงาน */}
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

                {/* ข้อมูลส่วนตัว */}
                <div className="mb-6 flex justify-center">
                  <div className="flex justify-center"></div>
                  <div className="flex w-full max-w-3xl mx-auto">
                    {/* กล่องซ้าย */}
                    <div className="flex-1 pr-4 pl-32">
                      {/* กลุ่มข้อมูล 1 */}
                      <div className="mb-4">
                        <strong className="text-black font-bold">ชื่อ:</strong>{" "}
                        {selectedPost.name} {selectedPost.lastname}
                      </div>

                      {/* กลุ่มข้อมูล 2 */}
                      <div className="mb-4">
                        <strong className="text-black font-bold">
                          ชั้นเรียน:
                        </strong>{" "}
                        {selectedPost.class_room}
                      </div>

                      {/* กลุ่มข้อมูล 3 */}
                      <div className="mb-4">
                        <strong className="text-black font-bold">แผนก:</strong>{" "}
                        {selectedPost.department}
                      </div>
                    </div>

                    {/* กล่องขวา */}
                    <div className="flex-1 pl-4">
                      {/* กลุ่มข้อมูล 4 */}
                      <div className="mb-4">
                        <strong className="text-black font-bold">เกรด:</strong>{" "}
                        {selectedPost.grade}
                      </div>

                      {/* กลุ่มข้อมูล 5 */}
                      <div className="mb-4">
                        <strong className="text-black font-bold">
                          เบอร์หมายเลข:
                        </strong>{" "}
                        {selectedPost.number_no}
                      </div>

                      {/* กลุ่มข้อมูล 6 */}
                      <div className="mb-4">
                        <strong className="text-black font-bold">
                          เลขประจำตัว:
                        </strong>{" "}
                        {selectedPost.personal_ip}
                      </div>
                    </div>
                  </div>
                </div>

                {/* นโยบายและรายละเอียดพรรค */}
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
              </div>

              {/* ปุ่มการกระทำ */}
              <div className="p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeModal}
                  className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mr-2"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleVote}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
