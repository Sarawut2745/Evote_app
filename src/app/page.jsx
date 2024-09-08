"use client";

import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow bg-white text-center p-52">
            
        </div>
        <Footer />
      </Container>
    </main>
  );
}
