"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faSpinner,
  faDownload,
  faArrowLeft,
  faCheck,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const UserImport = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [allData, setAllData] = useState([]); // เก็บข้อมูลทั้งหมดที่โหลดเข้ามา

  const validateData = (data) => {
    const errors = [];
    data.forEach((row, index) => {
      if (!row.name) {
        errors.push(`แถวที่ ${index + 1}: เลขประจำตัวนักศึกษาไม่ถูกต้อง`);
      }
      if (!row.posonal_number || row.posonal_number.length !== 13) {
        errors.push(`แถวที่ ${index + 1}: เลขบัตรประชาชนไม่ถูกต้อง`);
      }
      if (!row.user_type) {
        errors.push(`แถวที่ ${index + 1}: ระดับชั้นไม่ถูกต้อง`);
      }
    });
    return errors;
  };

  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setLoading(true);
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process and validate data
        const processedData = jsonData.map((row) => ({
          name: row["เลขประจำตัวนักศึกษา"]?.toString().trim(),
          posonal_number: row["เลขบัตรประชาชน"]?.toString().trim(),
          user_type: row["ระดับชั้น"]?.toString().trim(),
        }));

        // Log processed data
        console.log("Processed Data:", processedData);

        // Validate the data
        const validationErrors = validateData(processedData);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
          setMessage("พบข้อผิดพลาดในไฟล์ Excel กรุณาตรวจสอบข้อมูล");
          setPreview(processedData.slice(0, 5));
          setCanSubmit(false); // ปิดการกดปุ่มเพิ่มข้อมูลหากมีข้อผิดพลาด
          return;
        }

        setPreview(processedData.slice(0, 5)); // แสดงตัวอย่าง 5 แถวแรก
        setAllData(processedData); // เก็บข้อมูลทั้งหมดที่ผ่านการตรวจสอบแล้ว
        setCanSubmit(true); // อนุญาตให้กดปุ่มเพิ่มข้อมูลเมื่อข้อมูลถูกต้อง

        setMessage("ข้อมูลพร้อมสำหรับการเพิ่ม");
      } catch (error) {
        setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
        setErrors([]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddUsers = async () => {
    try {
      setLoading(true);
      // Upload to API using the full data set (not just preview)
      const response = await fetch("/api/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: allData }), // ส่งข้อมูลทั้งหมดที่เก็บไว้
      });

      if (!response.ok) {
        throw new Error("Failed to import users");
      }

      const result = await response.json();
      setMessage(`นำเข้าข้อมูลสำเร็จ ${result.imported} รายการ`);
      setErrors([]);
    } catch (error) {
      setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
      setErrors([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        เลขประจำตัวนักศึกษา: "",
        เลขบัตรประชาชน: "",
        ระดับชั้น: "",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "user_import_template.xlsx");
  };

  // ฟังก์ชันรีเซ็ต
  const resetForm = () => {
    setMessage("");
    setPreview([]);
    setAllData([]); // รีเซ็ตข้อมูลทั้งหมด
    setErrors([]);
    setCanSubmit(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              ดาวน์โหลดเทมเพลต Excel
            </button>
          </div>

          <div className="mb-6">
            <div className="max-w-xl mx-auto">
              <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                <FontAwesomeIcon
                  icon={loading ? faSpinner : faUpload}
                  className={`text-3xl text-gray-400 mb-2 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="text-gray-600">
                  เลือกไฟล์ Excel หรือลากไฟล์มาวาง
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      processExcelFile(file);
                    }
                  }}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.includes("สำเร็จ")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <h4 className="text-red-700 font-semibold mb-2">พบข้อผิดพลาด:</h4>
              <ul className="list-disc list-inside text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {preview.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">
                ตัวอย่างข้อมูล (5 แถวแรก)
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        เลขประจำตัวนักศึกษา
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        เลขบัตรประชาชน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ระดับชั้น
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.posonal_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.user_type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* เพิ่มปุ่มกดเพิ่มข้อมูล */}
          <div className="mt-6 flex gap-4">
            {/* ปุ่มเพิ่มข้อมูล */}
            {canSubmit && (
              <button
                onClick={handleAddUsers}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                เพิ่มข้อมูล
              </button>
            )}

            {/* ปุ่มรีเซ็ต */}
            {canSubmit && (
              <button
                onClick={resetForm}
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition duration-300"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faUndo} className="mr-2" />
                รีเซ็ต
              </button>
            )}

            {/* ปุ่มกลับ */}
            <Link
              href="/admin/user_manage"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              กลับ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserImport;
