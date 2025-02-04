"use client";
import ChartsPage from "../../components/ChartsPage";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Home = () => {
  const { data: session, status } = useSession();

  // กรณีที่สถานะการโหลดข้อมูลยังไม่เสร็จ
  if (status === "loading") {
    return <div>กำลังโหลด...</div>;
  }

  // หากไม่มี session (ไม่ได้ล็อกอิน) ให้ทำการเปลี่ยนเส้นทางไปที่หน้า login
  if (!session) {
    redirect("/login");
    return null;
  }

  return (
    <div>
      <DefaultLayout>
        <ChartsPage />
      </DefaultLayout>
    </div>
  );
};

export default Home;
