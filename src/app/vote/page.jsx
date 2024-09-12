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
        signOut();
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
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow bg-white text-center p-10">
  <h3 className="text-black text-title-md2">รายชื่อผู้สมัคร</h3>
  {postData && postData.length > 0 && (
    <div className="grid grid-cols-4 gap-5">
      {postData.map((val) => (
        <div
          key={val._id}
          className="shadow-xl my-3 p-3 rounded-xl flex flex-col items-center"
        >
          <h4 className="text-2xl">{val.title}</h4>
          <div className="flex justify-center w-full">
            <Image
              className="my-3 rounded-md"
              src={`/assets/${val.img}`}
              width={250}
              height={250}
              alt={val.title}
              objectFit="cover" // หรือ "contain" ถ้าต้องการ
            />
          </div>
          <button
            onClick={() => openModal(val)}
            className="relative h-12 w-40 overflow-hidden border border-stone-900 text-stone-900 shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-stone-900 before:duration-300 before:ease-out hover:text-white hover:shadow-stone-900 hover:before:h-40 hover:before:w-40 hover:before:opacity-80"
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
