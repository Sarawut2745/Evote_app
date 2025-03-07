import React from "react";

function Footer({ className = "" }) {
  return (
    <footer className={`bg-[#d6ccc2] py-10 ${className}`}>
      <div className="mt-1 text-center text-gray-500 text-lg">
        © {new Date().getFullYear()} วิทยาลัยอาชีวศึกษาสุพรรณบุรี.
        สงวนลิขสิทธิ์.
      </div>
    </footer>
  );
}

export default Footer;
