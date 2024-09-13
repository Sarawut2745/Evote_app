"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState(null);
  const [number_no, setNumber] = useState("");
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");

  const router = useRouter();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setPreview(null);
      setFileName("Choose a file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !img || !number_no) {
      alert("Please complete all inputs.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("img", img);
    formData.append("number_no", number_no);

    try {
      const res = await fetch("/api/election", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/management");
      } else {
        throw new Error("Failed to create a post");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Add Election
        </h3>
        <hr className="my-4" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Name Election
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              value={title}
              className="w-full bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Name Election"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="relative">
              <input
                id="file-input"
                type="file"
                onChange={handleImgChange}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg inline-block cursor-pointer hover:bg-blue-600 transition duration-200"
              >
                Choose File
              </label>
              <span className="ml-3 text-gray-500">{fileName}</span>
            </div>
          </div>

          {preview && (
            <div className="my-4">
              <p className="text-lg font-medium text-gray-700 mb-2">
                Image Preview
              </p>
              <img
                src={preview}
                alt="Image preview"
                className="w-[250px] h-[250px] object-cover rounded-lg shadow"
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Number
            </label>
            <input
              onChange={(e) => setNumber(e.target.value)}
              value={number_no}
              type="number"
              className="w-full bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your Number"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white border py-2 px-4 rounded text-lg"
            >
              Create Post
            </button>
            <Link
              href="/admin/management"
              className="bg-red hover:bg-red text-white border py-2 px-4 rounded text-lg"
            >
              Go back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
