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
  const [isNoVote, setIsNoVote] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/election", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPostData(data.posts);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    getPosts();
  }, []);

  const handleVote = async () => {
    try {
      const voteData = isNoVote
        ? { user_type: session?.user?.user_type, number_no: 0 }
        : {
            user_type: session?.user?.user_type,
            number_no: selectedPost?.number_no,
          };

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voteData),
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
      ...post,
      user_type: session?.user?.user_type,
    });
    setIsNoVote(false);
    setModalOpen(true);
  };

  const openNoVoteModal = () => {
    setSelectedPost(null);
    setIsNoVote(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

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
        <div className="flex-grow bg-gray-100 text-center p-8 md:p-10 lg:p-12">
          <h3 className="text-black text-xl md:text-3xl lg:text-4xl font-bold mb-10">
            รายชื่อผู้สมัคร
          </h3>

          <h1></h1>

          {postData && postData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {postData.map((val) => (
                  <div
                    key={val._id}
                    className="shadow-xl p-6 rounded-lg flex flex-col items-center bg-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5">
                      {val.name}
                    </h4>
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
                    <button
                      onClick={() => openModal(val)}
                      className="relative h-12 w-44 md:w-48 lg:w-52 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl"
                    >
                      <span className="relative z-10">เลือก</span>
                    </button>
                  </div>
                ))}
              </div>
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
            <p className="text-gray-700 text-lg md:text-xl italic">
              ไม่มีข้อมูลผู้สมัครในขณะนี้
            </p>
          )}
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

                          <div className="mb-4">
                            <strong className="text-black font-bold">
                              เลขประจำตัว:
                            </strong>{" "}
                            {selectedPost.personal_ip}
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
