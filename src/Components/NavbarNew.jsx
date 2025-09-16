"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/Assets/assets";

const NavbarNew = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/");
  };

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Hamburger and Logo */}
          <div className="flex items-center space-x-4">
            {children}
            <div className="flex items-center">
              {/* <Image src={assets.logo} width={120} alt="Logo" className="w-auto h-8" style={{filter: 'hue-rotate(180deg) saturate(2) brightness(0.8)'}} /> */}
              <span className="text-[#00D7A4] font-bold text-lg">B2B MARKETING</span>
            </div>
          </div>

          {/* Right side - Logout */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-[#00A085] hover:bg-[#008A73] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md mr-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default NavbarNew;
