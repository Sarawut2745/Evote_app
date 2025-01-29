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
    <nav className="flex justify-between items-center shadow-lg p-2 bg-gradient-to-r from-teal-500 to-teal-600">
      <div className="px-2">
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={65}
            height={65}
            alt="Next.js logo"
            className="rounded-lg"
          />
        </Link>
      </div>
      <ul className="flex space-x-4 px-4">
        {session && (
          <>
            <li>
              <button
                onClick={handleLogout} // Call handleLogout on click
                className="bg-white text-red px-4 py-2 rounded-md text-lg 
                  shadow-md hover:bg-red-50 transition-all duration-300 
                  border-2 border-transparent hover:border-red
                  focus:outline-none focus:ring-2 focus:ring-red"
                aria-label="Logout"
              >
                ออกจากระบบ
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
