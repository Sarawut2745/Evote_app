"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [postData, setPostData] = useState([]);

  console.log(postData);

  const getPosts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/election", {
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

  const { data: session } = useSession();
  if (!session) redirect("/login");
  console.log(session);

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow bg-white text-center p-10">
          <h3 className="text-black text-title-md2">รายชื่อผู้สมัคร</h3>
          <div className="grid grid-cols-6 mt-3 gap-5">
            {postData && postData.length > 0 ? (
              postData.map((val) => (
                <div
                  key={val._id}
                  className="shadow-xl col-span-2 my-3 p-3 rounded-xl flex flex-col items-center"
                >
                  <h4 className="text-2xl">{val.title}</h4>
                  <div className="flex justify-center w-full">
                    <Image
                      className="my-3 rounded-md"
                      src={`/assets/${val.img}`}
                      width={500}
                      height={250}
                      alt={val.title}
                    />
                  </div>
                  <button class="relative h-12 w-40 overflow-hidden border border-stone-900 text-stone-900 shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-stone-900 before:duration-300 before:ease-out hover:text-white hover:shadow-stone-900 hover:before:h-40 hover:before:w-40 hover:before:opacity-80">
                    <span class="relative z-10">เลือก</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="bg-gray-300 p-3 mt-3">
                ยังไม่มีข้อมูลคนเลือกตั้ง.
              </p>
            )}
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
