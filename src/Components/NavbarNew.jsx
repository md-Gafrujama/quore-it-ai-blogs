"use client";
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const NavbarNew = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        router.push('/'); // Redirect to login page
    };
    return (
        <div className='flex justify-between items-center px-6 py-5 bg-white border-b border-gray-200'>
            {/* Left side - B2B Marketing text */}
            <div>
                <Link href="/" passHref>
                    <h1 className='text-sm font-semibold text-gray-600 tracking-wider cursor-pointer hover:text-blue-700 transition-colors'>
                        B2B MARKETING
                    </h1>
                </Link>
            </div>

            {/* Right side - Logout button */}
            <div>
                <button
                    className='px-6 py-2 bg-blue-700 text-white text-sm font-medium rounded-3xl hover:bg-blue-700 transition-colors'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default NavbarNew