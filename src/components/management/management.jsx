import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import DeleteBtn from "../DeleteBtn";

export default function Management() {
  const [postData, setPostData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch all posts
  const getPosts = async () => {
    try {
      const res = await fetch("/api/election", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPostData(data.posts);
    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error("Failed to search posts");
      }

      const data = await response.json();
      setPostData(data.posts);
    } catch (error) {
      console.log("Search error: ", error);
    }
  };

  const handleReset = async () => {
    setSearchQuery("");
    getPosts();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">การจัดการ</h3>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <form
          className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 max-w-lg bg-white border border-gray-300 rounded-lg shadow-md p-4"
          onSubmit={handleSearch}
        >
          <input
            className="flex-1 bg-white border border-gray-300 text-gray-700 placeholder-gray-500 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="ค้นหา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex space-x-4 md:space-x-2 mt-4 md:mt-0">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white border border-transparent py-2 px-4 rounded-lg text-lg shadow-md transition duration-150 ease-in-out"
            >
              ค้นหา
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="bg-gray hover:bg-gray text-black border border-transparent py-2 px-4 rounded-lg text-lg shadow-md transition duration-150 ease-in-out"
            >
              รีเซ็ต
            </button>
          </div>
        </form>

        <Link
          className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-sm transition border-green-500 duration-150 ease-in-out"
          href={`/admin/management/create`}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          เพิ่มผู้สมัคร
        </Link>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-center text-gray-600 py-2 px-4">#</th>
              <th className="text-center text-gray-600 py-2 px-4">รูปภาพ</th>
              <th className="text-left text-gray-600 py-2 px-4">ชื่อ</th>
              <th className="text-left text-gray-600 py-2 px-4">
                เบอร์หมายเลข
              </th>
              <th className="text-center text-gray-600 py-2 px-4">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {postData.length > 0 ? (
              postData.map((post, index) => (
                <tr key={post._id}>
                  <td className="text-gray-700 text-center py-2 px-4">
                    {index + 1}
                  </td>
                  <td className="text-center py-2 px-4">
                    <img
                      src={`/assets/election/profile/${post.img_profile}`}
                      width={100}
                      alt={post.title}
                      className="mx-auto rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="text-gray-700 py-2 px-4">{post.name}</td>
                  <td className="text-gray-700 py-2 px-4">{post.number_no}</td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center space-x-4">
                      <Link
                        className="btn bg-amber-400 hover:bg-amber-500 text-white py-1 px-3 rounded-lg shadow-sm transition border-amber-400 duration-150 ease-in-out"
                        href={`/admin/management/edit/${post._id}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <DeleteBtn id={post._id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  ไม่มีผู้สมัคร
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
