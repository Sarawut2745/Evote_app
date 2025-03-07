import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter(); // Initialize the router

  const handleLogout = async () => {
    // Use signOut with redirect set to true to avoid manual routing
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="flex justify-between items-center shadow-md p-4 bg-[#d6ccc2] text-gray-800">
      <div className="flex items-center space-x-3">
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={50}
            height={50}
            alt="Logo"
            className="rounded-lg"
          />
        </Link>
        <h1 className="text-xl font-semibold tracking-wide">
          การเลือกตั้งวิทยาลัย อาชีวศึกษา สุพรรณบุรี
        </h1>
      </div>
      
      <ul className="flex space-x-4">
        {session ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-1 rounded-md text-lg 
                shadow-lg hover:bg-red-700 transition-all duration-300 
                border-2 border-transparent hover:border-red-800
                focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Logout"
            >
              ออกจากระบบ
            </button>
          </li>
        ) : (
          <li>
            {/* You can enable the login button below if necessary */}
            {/* 
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-1 rounded-md text-lg 
                shadow-lg hover:bg-blue-700 transition-all duration-300 
                border-2 border-transparent hover:border-blue-800
                focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              เข้าสู่ระบบ
            </Link>
            */}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
