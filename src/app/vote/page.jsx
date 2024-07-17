"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
        <div className="flex-grow text-center p-10">
          <div className="grid grid-cols-4 mt-3 gap-5">
            {postData && postData.length > 0 ? (
              postData.map((val) => (
                <div key={val._id} className="shadow-xl my-10 p-10 rounded-xl">
                  <h4 className="text-2xl">{val.title}</h4>
                  <Image
                    className="my-3 rounded-md"
                    src={val.img}
                    width={300}
                    height={0}
                    alt={val.title}
                  />
                  <p>{val.content}</p>
                </div>
              ))
            ) : (
              <p className="bg-gray-300 p-3 mt-3">
                You do not have any posts yet.
              </p>
            )}
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
