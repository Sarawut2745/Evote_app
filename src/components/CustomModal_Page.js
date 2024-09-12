import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../css/CustomModal.css';

const CustomModal = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef(null); // Create a ref for the modal div

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="popup"
      unmountOnExit
      nodeRef={modalRef} // Attach the ref here
    >
      <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 max-w-md transform transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4">ยืนยันการลงคะแนน</h2>
          <p className="mb-6">คุณแน่ใจหรือไม่ว่าต้องการลงคะแนนนี้?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-red text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              className="bg-success text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default CustomModal;
