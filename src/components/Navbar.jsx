"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();
  const [postData, setPostData] = useState([]);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/vote", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPostData(data.posts);

      
        if (data.posts.length > 0) {
          const userTypeFromPostData = data.posts[0].user_type;
          setUserType(userTypeFromPostData);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    getPosts();
  }, []);

  const handleVote = async (e) => {
    e.preventDefault();
    if (userType === null) {
      console.error("User type is not set");
      return;
    }

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_type: userType, number_no: 0 }),
      });

      if (res.ok) {
        console.log("Vote registered successfully");
       
      } else {
        console.error("Failed to register vote");
       
      }
    } catch (error) {
      console.error("Error during vote registration:", error);
     
    }
  };

  return (
    <nav className="flex justify-between items-center shadow-md p-2 bg-teal-500">
      <div>
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={65}
            height={65}
            alt="Next.js logo"
          />
        </Link>
      </div>
      <ul className="flex space-x-4">
        {session && (
          <>
            <li>
              <form onSubmit={handleVote}>
                <button
                  type="submit"
                  className="btn btn-success text-white border py-2 px-3 rounded-md text-lg shadow-md m-0"
                >
                  ไม่ประสงค์ลงคะแนน
                </button>
              </form>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="btn btn-error text-white border py-2 px-3 rounded-md text-lg shadow-md m-0"
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
