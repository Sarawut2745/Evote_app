import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function UserManage() {
  // กำหนดสถานะสำหรับการจัดเรียงข้อมูล
  const [sortOrder, setSortOrder] = useState({
    name: "asc",
    user_type: "asc",
  });

  // กำหนดสถานะสำหรับข้อมูลผู้ใช้
  const [data, setData] = useState([]);
  // กำหนดสถานะสำหรับการโหลดข้อมูล
  const [loading, setLoading] = useState(true);
  // กำหนดสถานะสำหรับข้อผิดพลาด
  const [error, setError] = useState(null);
  // กำหนดสถานะสำหรับข้อมูลที่กรองแล้ว
  const [filteredData, setFilteredData] = useState([]);
  // กำหนดสถานะสำหรับคำค้นหา
  const [searchQuery, setSearchQuery] = useState("");
  // กำหนดสถานะสำหรับการเปิด/ปิดโมดัล
  const [isModalOpen, setIsModalOpen] = useState(false);
  // กำหนดสถานะสำหรับผู้ใช้ที่เลือก
  const [selectedUser, setSelectedUser] = useState(null);

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        setData(users);
        setFilteredData(users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ฟิลเตอร์ข้อมูลผู้ใช้ตามคำค้นหาที่ป้อน
  useEffect(() => {
    if (searchQuery) {
      setFilteredData(
        data.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  // ฟังก์ชันสำหรับเปิดโมดัล
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // ฟังก์ชันสำหรับปิดโมดัล
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // ฟังก์ชันสำหรับลบผู้ใช้
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/user/${selectedUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const updatedData = data.filter((user) => user._id !== selectedUser._id);
      setData(updatedData);
      setFilteredData(updatedData);
      closeModal();
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
      console.error(error);
    }
  };

  // ฟังก์ชันสำหรับการจัดเรียงข้อมูลตามชื่อและประเภทผู้ใช้
  const handleSort = (column) => {
    const newSortOrder = sortOrder[column] === "asc" ? "desc" : "asc";
    setSortOrder((prev) => ({ ...prev, [column]: newSortOrder }));

    const sortedData = [...filteredData].sort((a, b) => {
      if (column === "name") {
        return newSortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (column === "user_type") {
        return newSortOrder === "asc"
          ? a.user_type.localeCompare(b.user_type)
          : b.user_type.localeCompare(a.user_type);
      }
      return 0;
    });

    setFilteredData(sortedData);
  };

  // ฟังก์ชันสำหรับรีเซ็ตคำค้นหา
  const handleReset = () => {
    setSearchQuery("");
    setFilteredData(data);
  };

  // แสดงข้อความขณะโหลดข้อมูล
  if (loading) return <div>Loading...</div>;
  // แสดงข้อความหากมีข้อผิดพลาด
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          จัดการข้อมูลผู้สมัคร
        </h3>
      </div>

      {/* ช่องค้นหาข้อมูล */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 max-w-lg bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full md:w-auto">
          <input
            className="flex-1 bg-white border border-gray-300 text-gray-700 placeholder-gray-500 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="ค้นหาชื่อ"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex space-x-4 md:space-x-2 px-2 mt-4 md:mt-0">
            {/* ปุ่มรีเซ็ตการค้นหา */}
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-black border border-transparent py-2 px-4 rounded-lg text-lg shadow-md transition duration-150 ease-in-out"
            >
              รีเซ็ต
            </button>
          </div>
        </div>

        {/* ลิงก์ไปยังหน้าสำหรับเพิ่มผู้สมัครและนำเข้า Excel */}
        <div className="flex space-x-4">
          <Link
            className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out"
            href="/admin/user_manage/create"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            เพิ่มผู้สมัคร
          </Link>
          <Link
            className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out"
            href="/admin/user_manage/import"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            นำเข้า Excel
          </Link>
        </div>
      </div>

      {/* ตารางแสดงข้อมูลผู้สมัคร */}
      <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-md w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {/* การจัดเรียงตามชื่อ */}
              <th
                className="text-left text-gray-600 py-3 px-6 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                เลขประจำตัวนักศึกษา {sortOrder.name === "asc" ? "↑" : "↓"}
              </th>
              <th className="text-left text-gray-600 py-3 px-6">
                เลขบัตรประชาชน
              </th>
              {/* การจัดเรียงตามประเภทผู้ใช้ */}
              <th
                className="text-left text-gray-600 py-3 px-6 cursor-pointer"
                onClick={() => handleSort("user_type")}
              >
                ระดับชั้น {sortOrder.user_type === "asc" ? "↑" : "↓"}
              </th>
              <th className="text-center text-gray-600 py-3 px-6">การจัดการ</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row._id}>
                  <td className="text-gray-700 py-3 px-6">{row.name}</td>
                  <td className="text-gray-700 py-3 px-6">
                    {row.posonal_number}
                  </td>
                  <td className="text-gray-700 py-3 px-6">{row.user_type}</td>
                  <td className="py-3 px-6">
                    <div className="flex justify-center gap-2">
                      {/* ลิงก์ไปยังหน้าสำหรับแก้ไขข้อมูลผู้สมัคร */}
                      <Link
                        className="bg-amber-400 hover:bg-amber-500 text-white py-2 px-3 rounded-lg shadow-sm transition duration-150 ease-in-out"
                        href={`/admin/user_manage/edit/${row._id}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      {/* ปุ่มลบผู้สมัคร */}
                      <button
                        className="bg-red_1-500 hover:bg-red_1-600 text-white py-2 px-3 rounded-lg shadow-sm transition duration-150 ease-in-out"
                        onClick={() => openModal(row)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  ไม่มีข้อมูลผู้ใช้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* โมดัลยืนยันการลบผู้สมัคร */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96">
            <h2 className="text-xl font-semibold text-gray-800">ยืนยันการลบ</h2>
            <p className="mt-2 text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการลบ <strong>{selectedUser?.name}</strong>
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              {/* ปุ่มยกเลิก */}
              <button
                className="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition"
                onClick={closeModal}
              >
                ยกเลิก
              </button>
              {/* ปุ่มลบข้อมูล */}
              <button
                className="bg-red_1-500 hover:bg-red_1-600 text-white py-2 px-4 rounded-lg transition"
                onClick={handleDeleteUser}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManage;
