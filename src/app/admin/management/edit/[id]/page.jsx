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
      console.log("DATA post: ", data);
      setPostData(data);
      setNewTitle(data.post?.title || "");
      setNewNumber_no(data.post?.number_no || "");
      if (data.post?.img) {
        setImgPreview(`/assets/${data.post.img}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostById(id);
  }, [id]);

  // Function to resize image
  const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to desired output size
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob
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
      setNewImg(await resizeImage(file, 250, 250)); // Resize image to 500x250
      setImgPreview(URL.createObjectURL(await resizeImage(file, 250, 250)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('number_no', newNumber_no);
    if (newImg) {
      formData.append('img', newImg); // Append resized File object
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
      <nav className="bg-slate-900 text-white py-4 mx-auto px-6 shadow-md mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold">Edit Election</h3>
        </div>
      </nav>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="mb-6">
          {titleError && (
            <p className="text-white bg-red inline-block px-4 py-2 rounded-lg text-left mb-2">
              {titleError}
            </p>
          )}
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            type="text"
            className="w-full bg-gray border border-black py-2 px-4 rounded text-lg"
            placeholder="Enter title"
          />
        </div>
        <div className="mb-6">
          {imgError && (
            <p className="text-white bg-red inline-block px-4 py-2 rounded-lg text-left mb-2">
              {imgError}
            </p>
          )}
          <label className="block text-gray-700 font-medium mb-2" htmlFor="img">
            Image
          </label>
          {imgPreview && (
            <div className="mb-4">
              <img src={imgPreview} alt="Current Image" className="w-full h-auto" />
            </div>
          )}
          <input
            id="img"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className=""
          />
        </div>

        <div className="mb-6">
          {numberNoError && (
            <p className="text-white bg-red inline-block px-4 py-2 rounded-lg text-left mb-2">
              {numberNoError}
            </p>
          )}
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="number_no"
          >
            Number
          </label>
          <input
            id="number_no"
            value={newNumber_no}
            onChange={(e) => setNewNumber_no(e.target.value)}
            className="w-full bg-gray border border-black py-2 px-4 rounded text-lg"
            placeholder="Enter number"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white border py-2 px-4 rounded text-lg"
          >
            Edit Election
          </button>
          <Link
            href="/admin/management"
            className="bg-red hover:bg-red text-white border py-2 px-4 rounded text-lg"
          >
            Go Back
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditPostPage;
