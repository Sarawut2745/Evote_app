"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function EditPostPage({ params }) {
  const { id } = params;
  const [postData, setPostData] = useState({});
  const [newTitle, setNewTitle] = useState("");
  const [newImg, setNewImg] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [newNumber_no, setNewNumber_no] = useState("");
  const [oldImgName, setOldImgName] = useState("");
  const [titleError, setTitleError] = useState("");
  const [imgError, setImgError] = useState("");
  const [numberNoError, setNumberNoError] = useState("");
  const router = useRouter();

  const getPostById = async (id) => {
    try {
      const res = await fetch(`/api/election/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      setPostData(data);
      setNewTitle(data.post?.title || "");
      setNewNumber_no(data.post?.number_no || "");
      if (data.post?.img) {
        setImgPreview(`/assets/${data.post.img}`);
        setOldImgName(data.post.img); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostById(id);
  }, [id]);

  const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };

      img.onerror = reject;
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImg(await resizeImage(file, 250, 250));
      setImgPreview(URL.createObjectURL(await resizeImage(file, 250, 250)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("number_no", newNumber_no);
    if (newImg) {
      formData.append("img", newImg);
    }

    try {
      const res = await fetch(`/api/election/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.Message || "Failed to update post");
      }

      router.push("/admin/management");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          แก้ไขข้อมูลผู้สมัคร
        </h3>
        <hr className="my-4" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {titleError && (
              <p className="text-white bg-red inline-block px-4 py-2 rounded-lg text-left mb-2">
                {titleError}
              </p>
            )}
            <label className="block text-lg font-medium text-gray-700 mb-2">
            ชื่อผู้สมัคร และเบอร์หมายเลข
            </label>
            <input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              type="text"
              className="w-full bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ป้อนชื่อผู้สมัคร และ เบอร์หมายเลข"
            />
          </div>

          <div>
            {imgError && (
              <p className="text-white bg-red inline-block px-4 py-2 rounded-lg text-left mb-2">
                {imgError}
              </p>
            )}
            <label className="block text-lg font-medium text-gray-700 mb-2">
            ตัวอย่างรูปภาพ
            </label>
            {imgPreview && (
              <div className="my-4">
                <img
                  src={imgPreview}
                  alt="Current Image"
                  className="w-[250px] h-[250px] object-cover rounded-lg shadow"
                />
              </div>
            )}
            <div className="relative">
              <input
                id="img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="img"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg inline-block cursor-pointer hover:bg-blue-600 transition duration-200"
              >
                เลือกรูป
              </label>
              <span className="ml-3 text-gray-500">
                {newImg ? newImg.name : oldImgName}
              </span>
            </div>
          </div>

          <div>
            {numberNoError && (
              <p className="text-white bg-red inline-block px-4 py-2 rounded-lg text-left mb-2">
                {numberNoError}
              </p>
            )}
            <label className="block text-lg font-medium text-gray-700 mb-2">
            เบอร์หมายเลข
            </label>
            <input
              id="number_no"
              type="number"
              value={newNumber_no}
              onChange={(e) => setNewNumber_no(e.target.value)}
              className="w-full bg-gray border border-gray py-2 px-4 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               placeholder="ป้อนเบอร์หมายเลข"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white border py-2 px-4 rounded text-lg"
            >
              แก้ไขข้อมูลผู้สมัคร
            </button>
            <Link
              href="/admin/management"
              className="bg-red hover:bg-red-600 text-white border py-2 px-4 rounded text-lg"
            >
              ย้อนกลับ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostPage;
