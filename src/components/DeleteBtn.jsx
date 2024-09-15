"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function DeleteBtn({ id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/election?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      window.location.reload();
    }
  };

  return (
    <>
      <a
        onClick={() => setIsModalOpen(true)}
        className="btn bg-red rounded shadow-sm border-red py-1 px-3 cursor-pointer"
      >
        <FontAwesomeIcon icon={faTrash} className="text-white" />
      </a>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform scale-100 transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
            <p className="mb-4 text-lg">
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้สมัครนี้นี้ ?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-success text-gray py-2 px-4 rounded mr-2 transition-colors duration-200 ease-in-out hover:bg-success"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setIsModalOpen(false);
                }}
                className="bg-red text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out hover:bg-red"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteBtn;
