"use client";
import Management from "../../../components/management/management"
import DefaultLayout from "../../../components/Layouts/DefaultLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Home = () => {
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
     <Management></Management>
    </DefaultLayout>
  );
};

export default Home;


