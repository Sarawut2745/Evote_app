"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [img, setImg] = useState(null);
    const [number_no, setNumber] = useState("");

    const router = useRouter();

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
                body: formData
            });

            if (res.ok) {
                router.push("/admin");
            } else {
                throw new Error("Failed to create a post");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container mx-auto py-10'>
            <h3 className='text-3xl font-bold'>Create Post</h3>
            <hr className='my-3' />
            <Link href="/" className='bg-gray-500 inline-block text-white border py-2 px-3 rounded my-2'>Go back</Link>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    value={title}
                    className='w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2'
                    placeholder='Post title'
                />
                <input
                    onChange={(e) => setImg(e.target.files[0])}
                    type="file"
                />
                <input
                    onChange={(e) => setNumber(e.target.value)}
                    value={number_no}
                    className='w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2'
                    placeholder='Enter your content'
                />
                <button
                    type='submit'
                    className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'
                >
                    Create Post
                </button>
            </form>
        </div>
    )
}

export default CreatePostPage
