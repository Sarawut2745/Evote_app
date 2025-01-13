import React, { useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

// แยก Modal Component เพื่อลดการ re-render
const DeleteModal = memo(({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform scale-100 transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
        <p className="mb-4 text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-400 text-white py-2 px-4 rounded mr-2 transition-colors duration-200 ease-in-out hover:bg-green-500"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="bg-red text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out hover:bg-red"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteModal.displayName = 'DeleteModal';

// แยก Banner Item Component
const BannerItem = memo(({ background, index, onDeleteClick }) => (
  <tr key={background._id} className="border-b hover:bg-gray-50">
    <td className="px-6 py-4 text-gray-800">{index + 1}</td>
    <td className="px-6 py-4">
      <Image
        src={background.image}
        alt="Banner Image"
        width={320}
        height={180}
        loading="lazy"
        className="mx-auto rounded-lg shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
      />
    </td>
    <td className="px-6 py-4">
      <Link href={`/admin/background/edit/${background._id}`}>
        <FontAwesomeIcon
          icon={faEdit}
          className="text-blue-600 hover:text-blue-800 text-lg transition-colors"
        />
      </Link>
      <button
        onClick={() => onDeleteClick(background._id)}
        className="ml-4 text-red-600 hover:text-red-800 transition-colors"
      >
        <FontAwesomeIcon icon={faTrashAlt} className="text-lg text-red"/>
      </button>
    </td>
  </tr>
));

BannerItem.displayName = 'BannerItem';

// Main Component
function Background() {
  const [backgroundData, setBackgroundData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ใช้ useCallback เพื่อ memoize functions
  const getBanner = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/background", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("ดึงรูปภาพไม่สำเร็จ");

      const data = await res.json();
      setBackgroundData(data.background);
    } catch (error) {
      setError("Error loading Banner. Please try again later.");
      console.error("Error loading Banner:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) {
      setError("ไม่มีรูป");
      return;
    }

    try {
      const res = await fetch(`/api/background?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("ลบรูปภาพไม่สำเร็จ");

      setBackgroundData(prev => prev.filter(item => item._id !== deleteId));
      setIsModalOpen(false);
    } catch (error) {
      setError("Error deleting Banner. Please try again later.");
      console.error("Error deleting Banner:", error);
    }
  }, [deleteId]);

  const handleDeleteClick = useCallback((id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    getBanner();
  }, [getBanner]);

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      <div className="mb-8">
        <h3 className="text-3xl font-semibold text-gray-800">
          จัดการรูปพื้นหลัง
        </h3>
      </div>

      <Link
        className="btn bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md transition transform duration-150 ease-in-out hover:scale-105"
        href="/admin/background/create"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        เพิ่มรูปแบนเนอร์
      </Link>

      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500 text-xl">กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-xl">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-medium">ลำดับ</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-medium">รูปภาพ</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {backgroundData.length > 0 ? (
                  backgroundData.map((background, index) => (
                    <BannerItem
                      key={background._id}
                      background={background}
                      index={index}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      ไม่มี Banner
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

Background.displayName = 'Background';

export default Background;