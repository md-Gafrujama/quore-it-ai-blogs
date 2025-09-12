'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo1 from '../Assets/Logo1.png';
import Logo2 from '../Assets/Logo2.png';
import {
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-[#192825] text-white py-10 px-6 lg:px-20">
      {/* Toast Message */}

      {/* Top Logo and Centered Socials */}
      <div className="max-w-7xl mx-auto border-b border-gray-600 pb-6">
        <div className="flex items-center justify-center space-x-6">
          {/* Left: Logo with Text */}
          <div className="flex items-center ">
            <Image src={Logo1} alt="Kulan Logo 1" width={80} height={50} />
            <Image src={Logo2} alt="Kulan Logo 2"  width={140} height={50} />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-500" />

          {/* Right: Social Icons */}
          <div className="flex space-x-3">
            <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-600 rounded-full hover:bg-gray-700 transition">
              <FaInstagram />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-600 rounded-full hover:bg-gray-700 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-10">
        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-gray-300 mb-4">
            If your business hosts events or exhibitions, creative services can assist
            with event planning, booth design.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);

              formData.append("access_key", "c9f66eb3-7bae-487c-bd58-ab7a0f817bff");
              formData.append("subject", "New Newsletter Subscription");
              formData.append("from_name", "Kulan Newsletter");

              try {
                await fetch("https://api.web3forms.com/submit", {
                  method: "POST",
                  body: formData,
                });

                setSubscribed(true);
                e.target.reset();
                setTimeout(() => setSubscribed(false), 5000);
              } catch (error) {
                console.error("Submission error", error);
              }
            }}
            className="space-y-4"
          >
            {/* Email Input */}
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-[#132623] text-white border border-gray-700 rounded-md focus:outline-none"
            />

            {/* Subscribe Button and Message */}
            <div className="relative w-full">
              <button
                type="submit"
                className="relative w-full overflow-hidden bg-[#ffd800] text-black font-semibold py-2 px-4 rounded-md flex items-center justify-center group shadow-md"
              >
                <span className="relative z-10">Subscribe ↗</span>
                <span className="absolute inset-0 bg-[#326964] z-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-md" />
              </button>

              {subscribed && (
                <p className="text-emerald-300 font-medium text-sm mt-2">
                  Thank you for subscribing!
                </p>
              )}
            </div>
          </form>
        </div>



<div>
  <h3 className="text-lg font-semibold mb-4">About Us</h3>
  <ul className="space-y-2 text-sm text-gray-300">
    <li>
      <Link href="https://personifiedb2bmarketing.com/Contact" className="hover:text-[#ffd800]">Contact Us</Link>
    </li>
    <li>
      <Link href="https://personifiedb2bmarketing.com/About" className="hover:text-[#ffd800]">About Us</Link>
    </li>
    
  </ul>
</div>

<div>
  <h3 className="text-lg font-semibold mb-4">Solutions</h3>
  <ul className="space-y-2 text-sm text-gray-300">
    <li>
      <Link href="https://personifiedb2bmarketing.com/ContentSyndication" className="hover:text-[#ffd800]">B2B Content Sydication</Link>
    </li>
    <li>
      <Link href="https://personifiedb2bmarketing.com/B2BDataIntent" className="hover:text-[#ffd800]">B2B Data & Intent
</Link>
    </li>
    <li>
      <Link href="https://personifiedb2bmarketing.com/SalesDevelopment" className="hover:text-[#ffd800]">Sales Devlopment</Link>
    </li>
    
    
  </ul>
</div>


        {/* Our Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Contact</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#ffd800]" /> personifiedb2bmarketing@gmail.com
            </li>
           
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-600 pt-6 text-center text-sm text-gray-400">
     © 2025 Personifind.com | 
        <span className="text-[#ffd800]">All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;