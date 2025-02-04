"use client";

import React, { useState } from "react";

export default function UploadForm() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Array.from(images).forEach((file) => {
      formData.append("images", file);
    });

    try {
      setLoading(true);
      const response = await fetch("/api/background", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Images uploaded successfully!");
      } else {
        setMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Upload Your Images
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="images"
            className="block text-lg font-medium text-gray-700"
          >
            Choose Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors duration-300`}
        >
          {loading ? "Uploading..." : "Upload Images"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-lg ${
              message.includes("success")
                ? "text-green-600"
                : "text-red_1-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
