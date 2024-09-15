import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import CustomModal from "../components/CustomModal";

function Navbar() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVote = async () => {
    if (session.user.user_type === null) {
      console.error("User type is not set");
      return;
    }

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_type: session.user.user_type, number_no: 0 }),
      });

      if (res.ok) {
        console.log("Vote registered successfully");
        await signOut({ redirect: false });
        setIsModalOpen(false);
      } else {
        console.error("Failed to register vote");
      }
    } catch (error) {
      console.error("Error during vote registration:", error);
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
              <form onSubmit={openModal}>
                <button
                  type="submit"
                  className="btn btn-success text-white border py-2 px-3 rounded-md text-lg shadow-md"
                >
                  ไม่ประสงค์ลงคะแนน
                </button>
              </form>
            </li>
            <li>
              <button
                 onClick={async () => {
                  await signOut({ redirect: false });
                 
                }}
                className="btn btn-error text-white border py-2 px-3 rounded-md text-lg shadow-md"
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleVote}
        title="ยืนยันการลงคะแนน"
        content="คุณแน่ใจว่าต้องการลงคะแนนสำหรับตัวเลือกนี้หรือไม่?"
      />
    </nav>
  );
}

export default Navbar;
