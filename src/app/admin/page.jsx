"use client";

import React from "react";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function admin() {
    
  const { data: session } = useSession();
  if (!session) redirect("/login");
  console.log(session);

  return (
    <div>
      <Navbar />
      <div>Admin</div>
    </div>
  );
}

export default admin;
