import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default function Management() {
  const [postData, setPostData] = useState([]);

  const getPosts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/election", {
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

  return (
    <div>
      <div className="pb-3">
        <form className="flex items-center space-x-4 max-w-lg w-full">
          <input
            className="flex-1 bg-white border border-black text-black placeholder-slate-500 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Search..."
            style={{ maxWidth: "300px" }}
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white border border-transparent py-2 px-4 rounded-lg text-lg shadow-md transition duration-150 ease-in-out"
          >
            Search
          </button>
        </form>
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th className="text-black text-base">NO.</th>
              <th className="text-black text-base">IMAGE</th>
              <th className="text-black text-base">NAME</th>
              <th className="text-black text-base">NUMBER</th>
              <th className="text-black text-base">MANAGEMENT</th>
            </tr>
          </thead>
          <tbody>
            {postData.length > 0 ? (
              postData.map((post, index) => (
                <tr key={index}>
                  <td className="text-black text-base">{index + 1}</td>
                  <td className="text-black text-base">
                    <img
                      src={`/assets/${post.img}`}
                      width={100}
                      alt={post.title}
                    />
                  </td>
                  <td className="text-black text-base">{post.title}</td>
                  <td className="text-black text-base">{post.number_no}</td>
                  <td>
                    <Link
                      className="btn bg-amber-400 rounded shadow-sm border-amber-400"
                      href={`/admin/management/edit/${post._id}`}
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-white" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No posts available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
