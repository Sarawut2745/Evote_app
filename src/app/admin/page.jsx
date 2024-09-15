"use client";
import ChartsPage from "../../components/ChartsPage";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
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
    <div>
      <DefaultLayout>
        <ChartsPage />
      </DefaultLayout>
    </div>
  );
};

export default Home;
