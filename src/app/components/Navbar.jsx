"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      className="flex justify-between items-center shadow-md p-2"
      style={{ backgroundColor: "rgb(228, 0, 58)" }}
    >
      <div>
        <Link href="/">
          <Image
            src={"/images/logo.png"}
            width={65}
            height={65}
            alt="nextjs logo"
          />
        </Link>
      </div>
      <ul className="flex space-x-4">
        {session && (
          <li>
            <a
              onClick={() => signOut()}
              className="bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2"
            >
              Logout
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
