import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";

async function getCandidate(id) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/election/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    return null;
  }
}

export default async function CandidateDetail({ params }) {
  const candidate = await getCandidate(params.id);

  if (!candidate) {
    return notFound();
  }

  const candidateData = candidate.post;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-[#d6ccc2] shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-xl font-bold text-gray-800">
            การเลือกตั้งวิทยาลัย
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-6 text-gray-700 text-sm">
            <li>
              <Link href="/" className="hover:text-blue-500">
                หน้าหลัก
              </Link>
            </li>
            <li>
              <Link href="/candidate-info" className="hover:text-blue-500">
                ข้อมูลผู้สมัคร
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-blue-500">
                เข้าสู่ระบบ
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Blog Content */}
      <main className="max-w-3xl mx-auto py-16 px-4 md:px-0">
        {/* Cover Image */}
        {candidateData.img_profile && (
          <div className="mb-8">
            <Image
              src={`/assets/election/profile/${candidateData.img_profile}`}
              alt={`ภาพของ ${candidateData.name}`}
              width={800}
              height={400}
              className="rounded-lg object-cover shadow"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {candidateData.name} {candidateData.lastname}
        </h1>

        {/* Metadata */}
        <div className="text-sm text-gray-500 mb-12">
          สมาชิกฝ่ายพัฒนานวัตกรรมในโปรแกรมเมอร์
        </div>

        {/* Slogan */}
        <blockquote className="border-l-4 border-pink-500 pl-4 italic text-pink-700 mb-10">
          "{candidateData.party_slogan}"
        </blockquote>

        {/* Description */}
        <section className="prose prose-p:text-gray-700 prose-p:leading-relaxed mb-12">
          <h2>คำอธิบาย</h2>
          <p>{candidateData.description || "ไม่มีคำอธิบายเพิ่มเติม"}</p>
        </section>

        {/* Policies */}
        <section className="prose prose-p:text-gray-700 prose-p:leading-relaxed mb-12">
          <h2>แนวทางการดำเนินงาน</h2>
          <p>{candidateData.party_policies}</p>
        </section>

        {/* Work Showcase */}
        {candidateData.img_work && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ผลงาน
            </h2>
            <Image
              src={`/assets/election/work/${candidateData.img_work}`}
              alt={`ผลงานของ ${candidateData.name}`}
              width={800}
              height={450}
              className="rounded-lg shadow"
            />
          </section>
        )}

        {!candidateData.img_work && (
          <p className="text-gray-500 text-center">ไม่มีภาพผลงานแสดง</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
