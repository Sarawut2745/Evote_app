"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function DeleteBtn({ id }) {
  const router = useRouter(); // Initialize router

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`/api/election?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/management"); // Use router.push to navigate
      }
    }
  };

  return (
    <a
      onClick={handleDelete}
      className="btn bg-red rounded shadow-sm border-red py-1 px-3 cursor-pointer"
    >
      <FontAwesomeIcon icon={faTrash} className="text-white" />
    </a>
  );
}

export default DeleteBtn;
