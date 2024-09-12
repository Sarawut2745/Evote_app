"use client";

import React, { useState } from 'react';
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function RegisterPage() {

    const [name, setName] = useState("");
    const [user_type, setUserType] = useState(""); // Renamed from room to user_type
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { data: session } = useSession();

    // Handle redirect early, no further rendering if redirecting
    if (session) {
        redirect('/vote');
        return null;  // Prevent rendering anything else after redirect
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Please enter your name.");
            return;
        }

        try {
            // Check if the user already exists
            const resCheckUser = await fetch("/api/usercheck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, user_type }) // Use user_type here
            });

            const { user } = await resCheckUser.json();

            if (user) { 
                setError("User already exists.");
                return;
            }

            // Register the new user
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, user_type }) // Use user_type here
            });

            if (res.ok) {
                const form = e.target;
                setError("");
                setSuccess("User registration successful!");
                form.reset();
            } else {
                const data = await res.json();
                setError(data.message || "User registration failed.");
            }

        } catch (error) {
            setError("Error during registration: " + error.message);
        }
    }

    return (
        <Container>
            <Navbar />
            <div className='flex-grow bg-white'>
                <div className="flex justify-center items-center">
                    <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
                        <h3 className='text-3xl'>Register Page</h3>
                        <hr className='my-3' />
                        <form onSubmit={handleSubmit}>

                            {error && (
                                <div className='bg-red w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {success}
                                </div>
                            )}

                            <input 
                                type="text" 
                                onChange={(e) => setName(e.target.value)} 
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='Enter your name' 
                            />
                            <input 
                                type="text" 
                                onChange={(e) => setUserType(e.target.value)} // Update user_type here
                                className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' 
                                placeholder='Enter your class' 
                            />
                            <button 
                                type='submit' 
                                className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'
                            >
                                Sign Up
                            </button>
                        </form>
                        <hr className='my-3' />
                        <p>
                            Go to <Link href="/login" className='text-blue-500 hover:underline'>Login</Link> Page
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </Container>
    )
}

export default RegisterPage;
