"use client";
import DefaultLayout from "../../../components/Layouts/DefaultLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import UserManage from "../../../components/user_manament/UserManage";

const user_manage = () => {
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
        <UserManage></UserManage>
    </DefaultLayout>
  );
};

export default user_manage;


