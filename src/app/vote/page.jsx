"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CustomModal from "../../components/CustomModal_Page";

export default function Home() {
  const [postData, setPostData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(false);
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
      user_type: session.user.user_type,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
          <h3 className="text-black text-lg md:text-xl lg:text-2xl mb-6">รายชื่อผู้สมัคร</h3>
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
                    className="relative h-10 w-36 md:w-40 lg:w-44 overflow-hidden border border-stone-900 text-stone-900 shadow-md transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-stone-900 before:duration-300 before:ease-out hover:text-white hover:shadow-stone-900 hover:before:h-full hover:before:w-full hover:before:opacity-80"
                  >
                    <span className="relative z-10">เลือก</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
        <CustomModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleVote}
          title="ยืนยันการลงคะแนน"
          content="คุณแน่ใจว่าต้องการลงคะแนนสำหรับตัวเลือกนี้หรือไม่?"
        />
      </Container>
    </main>
  );
}
