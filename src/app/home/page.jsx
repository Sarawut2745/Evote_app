import Image from "next/image";
import Link from "next/link";

export default function ElectionPage() {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white p-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">การเลือกตั้ง 2025</h1>
            <p>โปรดเลือกผู้สมัครที่คุณเชื่อมั่น</p>
          </div>
          <Link
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
            href={`/login`}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            เบอร์ผู้สมัครในการเลือกตั้ง
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ผู้สมัคร 1 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image
                src="https://via.placeholder.com/400x300"
                alt="ผู้สมัคร 1"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  ผู้สมัครเบอร์ 1
                </h3>
                <p className="text-gray-600">
                  คำอธิบายเกี่ยวกับผู้สมัครเบอร์ 1 และนโยบายของเขา
                </p>
              </div>
            </div>

            {/* ผู้สมัคร 2 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image
                src="https://via.placeholder.com/400x300"
                alt="ผู้สมัคร 2"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  ผู้สมัครเบอร์ 2
                </h3>
                <p className="text-gray-600">
                  คำอธิบายเกี่ยวกับผู้สมัครเบอร์ 2 และนโยบายของเขา
                </p>
              </div>
            </div>

            {/* ผู้สมัคร 3 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image
                src="https://via.placeholder.com/400x300"
                alt="ผู้สมัคร 3"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  ผู้สมัครเบอร์ 3
                </h3>
                <p className="text-gray-600">
                  คำอธิบายเกี่ยวกับผู้สมัครเบอร์ 3 และนโยบายของเขา
                </p>
              </div>
            </div>

            {/* ผู้สมัคร 4 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image
                src="https://via.placeholder.com/400x300"
                alt="ผู้สมัคร 4"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  ผู้สมัครเบอร์ 4
                </h3>
                <p className="text-gray-600">
                  คำอธิบายเกี่ยวกับผู้สมัครเบอร์ 4 และนโยบายของเขา
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 การเลือกตั้งไทย - ทุกสิทธิ์สงวนไว้</p>
        </div>
      </footer>
    </div>
  );
}
