"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function DeleteBtn({ id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/election?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      window.location.reload();
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsModalOpen(false);
    }, 300); // Duration matches animation timing
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-transform duration-300 ease-in-out transform active:scale-95"
      >
        <FontAwesomeIcon icon={faTrash} className="text-white" />
      </button>

      {isModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 
            transition-opacity duration-300 ease-in-out ${isClosing ? "opacity-0" : "opacity-100"}`}
          onClick={closeModal}
        >
          <div
            className={`bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-300 
              ease-in-out ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
            <p className="mb-4 text-lg">
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้สมัครนี้?
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2 transition-colors duration-200 ease-in-out hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  closeModal();
                }}
                className="bg-red-500 text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out hover:bg-red-600"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteBtn;
