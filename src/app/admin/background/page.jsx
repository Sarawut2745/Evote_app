"use client";
import Background from "../../../components/background/background"
import DefaultLayout from "../../../components/Layouts/DefaultLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Backgroun = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
   
    return <div>กำลังโหลด...</div>;
  }

  if (!session) {
    redirect("/login");
    return null;
  }

  return (
    <DefaultLayout>
     <Background></Background>
    </DefaultLayout>
  );
};

export default Backgroun;


