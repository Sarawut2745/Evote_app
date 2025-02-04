import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Management() {
  const [postData, setPostData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // ฟังก์ชันเพื่อดึงข้อมูลโพสต์
  const getPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/election", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถดึงโพสต์ได้");
      }

      const data = await res.json();
      setPostData(data.posts);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการโหลดโพสต์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // เรียกใช้งานฟังก์ชัน getPosts เมื่อ component ถูก render ครั้งแรก
    getPosts();
  }, []);

  useEffect(() => {
    // ใช้ดีบาวซ์เพื่อเลื่อนเวลาในการค้นหา
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    // ค้นหาโพสต์เมื่อมีการเปลี่ยนแปลงคำค้นหาหรือรีเซ็ตโพสต์
    if (debouncedSearchQuery) {
      handleSearch();
    } else {
      getPosts();
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/search?query=${debouncedSearchQuery}`);
      if (!response.ok) {
        throw new Error("ไม่สามารถค้นหาโพสต์ได้");
      }

      const data = await response.json();
      setPostData(data.posts);
    } catch (error) {
      setError("การค้นหาล้มเหลว กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // ฟังก์ชันเพื่อลบโพสต์
    const res = await fetch(`/api/election?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setModalOpen(false);
      getPosts();
    }
  };

  const closeModal = () => {
    // ฟังก์ชันเพื่อปิดโมดัล
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setModalOpen(false);
      setSelectedId(null);
    }, 300); // เวลาปิดโมดัลให้ตรงกับเวลาของแอนิเมชัน
  };

  const openModal = (id) => {
    // ฟังก์ชันเพื่อเปิดโมดัลและเลือก ID
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleReset = () => {
    // ฟังก์ชันเพื่อล้างคำค้นหา
    setSearchQuery("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          จัดการข้อมูลผู้สมัคร
        </h3>
      </div>
  
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 max-w-lg bg-white border border-gray-300 rounded-lg shadow-md p-4">
          {/* ช่องกรอกคำค้นหาผู้สมัคร */}
          <input
            className="flex-1 bg-white border border-gray-300 text-gray-700 placeholder-gray-500 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="ค้นหาชื่อ"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex space-x-4 md:space-x-2 mt-4 md:mt-0 px-2">
            {/* ปุ่มรีเซ็ตคำค้นหา */}
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray hover:bg-gray text-black border border-transparent py-2 px-4 rounded-lg text-lg shadow-md transition duration-150 ease-in-out"
            >
              รีเซ็ต
            </button>
          </div>
        </div>
  
        {/* ลิงก์ไปยังหน้าสำหรับเพิ่มผู้สมัครใหม่ */}
        <Link
          className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-sm transition border-green-500 duration-150 ease-in-out"
          href={`/admin/management/create`}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          เพิ่มผู้สมัคร
        </Link>
      </div>
  
      {/* ตารางแสดงข้อมูลผู้สมัคร */}
      <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-md">
        {loading ? (
          // แสดงข้อความระหว่างที่โหลดข้อมูล
          <div className="py-4 text-center text-gray-500">กำลังโหลด...</div>
        ) : error ? (
          // แสดงข้อความหากเกิดข้อผิดพลาด
          <div className="py-4 text-center text-red">{error}</div>
        ) : (
          // แสดงตารางข้อมูลผู้สมัคร
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-center text-gray-600 py-2 px-4">#</th>
                <th className="text-center text-gray-600 py-2 px-4">รูปภาพ</th>
                <th className="text-left text-gray-600 py-2 px-4">ชื่อ</th>
                <th className="text-left text-gray-600 py-2 px-4">นามกุล</th>
                <th className="text-left text-gray-600 py-2 px-4">เบอร์หมายเลข</th>
                <th className="text-center text-gray-600 py-2 px-4">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {postData.length > 0 ? (
                postData.map((post, index) => (
                  <tr key={post._id}>
                    <td className="text-gray-700 text-center py-2 px-4">
                      {index + 1}
                    </td>
                    <td className="text-center py-2 px-4">
                      {/* รูปภาพของผู้สมัคร */}
                      <Image
                        src={`/assets/election/profile/${post.img_profile}`}
                        width={100}
                        height={100}
                        alt={post.name}
                        className="mx-auto rounded-lg shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                      />
                    </td>
                    <td className="text-gray-700 py-2 px-4">{post.name}</td>
                    <td className="text-gray-700 py-2 px-4">{post.lastname}</td>
                    <td className="text-gray-700 py-2 px-4">
                      {post.number_no}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex justify-center space-x-4">
                        {/* ลิงก์ไปยังหน้าสำหรับแก้ไขข้อมูลผู้สมัคร */}
                        <Link
                          className="btn bg-amber-400 hover:bg-amber-500 text-white py-2 px-5 rounded-lg shadow-sm transition border-base-content duration-150 ease-in-out text-lg"
                          href={`/admin/management/edit/${post._id}`}
                        >
                          <FontAwesomeIcon icon={faEdit} className="text-xl" />{" "}
                        </Link>
                        {/* ปุ่มสำหรับลบผู้สมัคร */}
                        <button
                          onClick={() => openModal(post._id)}
                          className="btn bg-red_1-500 hover:bg-red_1-600 text-white py-2 px-5 rounded-lg shadow-sm transition duration-150 ease-in-out text-lg"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xl" />{" "}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* แสดงข้อความเมื่อไม่มีข้อมูลผู้สมัคร */}
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    ไม่มีผู้สมัคร
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
  
      {/* โมดัลยืนยันการลบ */}
      {modalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 
            transition-opacity duration-300 ease-in-out ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-300 
              ease-in-out ${
                isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
            <p className="mb-4 text-lg">
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้สมัครนี้?
            </p>
            <div className="flex justify-end">
              {/* ปุ่มยกเลิก */}
              <button
                onClick={closeModal}
                className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mr-2"
              >
                ยกเลิก
              </button>
              {/* ปุ่มลบ */}
              <button
                onClick={() => handleDelete(selectedId)}
                className="btn bg-red hover:bg-red text-white py-2 px-4 rounded-lg"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}