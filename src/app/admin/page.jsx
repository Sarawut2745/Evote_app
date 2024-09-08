"use client";

import ECommerce from "../../components/Dashboard/E-commerce";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // You can add a loading state here if needed
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
    return null; // To avoid rendering below components while redirecting
  }

  return (
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
  );
};

export default Home;

