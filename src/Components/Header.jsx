"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from "next/image";
import { assets } from '@/Assets/assets';

const Header = () => {
  const [email, setEmail] = useState("");
  const inputRef = useRef();
  const [isHovering, setIsHovering] = useState(false);
  
  // Get company from localStorage
  const company = typeof window !== 'undefined' ? localStorage.getItem("company") || "" : "";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("company", 'quoreit');
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
      const response = await axios.post(`${baseURL}/api/email`, formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
        inputRef.current.value = '';
      } else {
        toast.error(response.data.message || "Error");
      }
    } catch (error) {
      toast.error("Error occurred while subscribing");
      console.error('Subscribe error:', error);
    }
  };

  const onClear = () => {
    setEmail('');
    inputRef.current.value = '';
  };

  return (
    <div className='relative overflow-hidden'>
      {/* Background elements with theme colors */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#386861]/8 to-[#F7D270]/5 opacity-40'></div>
        <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#294944]/5 to-transparent opacity-30'></div>
        
        {/* Additional decorative gradients */}
        <div className='absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-t from-[#F7D270]/10 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-b from-[#386861]/10 to-transparent rounded-full blur-2xl'></div>
      </div>
      
      <div className='py-10 px-5 md:px-12 lg:px-28'>
        <div className='flex justify-between items-center'>
          {/* Logo section can be uncommented when needed */}
          {/* <Image src={assets.logo} width={180} alt='image' className='w-[130px] sm:w-auto'/> */}
        </div>

        <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative pt-24 pb-24'>
          {/* Header with logo and button */}
          <div className='flex justify-between items-center mb-12'>
            {/* Logo and Get Started button sections available for future use */}
          </div>

          <div className='text-center'>
            {/* New feature badge with theme colors and enhanced animation */}
          

            {/* Main heading with theme gradient text */}
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#386861] via-[#294944] to-[#386861] animate-gradient-x'>
                Latest Blogs
              </span>
              <br />
              <span className='text-[#294944] mt-2 block'>Stay Updated</span>
            </h1>

            {/* Subheading with theme colors */}
            <p className='my-8 max-w-2xl mx-auto text-lg text-[#386861] leading-relaxed font-medium'>
              Discover insightful articles, industry trends, and expert knowledge 
              delivered straight to your inbox. Join our community of readers today.
            </p>

            {/* Email subscription form with theme styling */}
            <form 
              onSubmit={onSubmitHandler} 
              className='flex justify-between max-w-xl mx-auto border-2 border-[#386861]/30 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 focus-within:shadow-2xl focus-within:border-[#F7D270] focus-within:scale-105'
            >
              <input 
                ref={inputRef}
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                placeholder='Enter your email address' 
                required 
                className='w-full px-6 py-4 outline-none placeholder-[#386861]/60 text-[#294944] text-lg bg-transparent'
              />
              <button 
                type="submit" 
                className='bg-gradient-to-r from-[#386861] via-[#294944] to-[#386861] text-[#F7D270] px-8 py-4 font-bold hover:from-[#294944] hover:via-[#386861] hover:to-[#294944] transition-all duration-300 flex items-center transform hover:scale-105 active:scale-95 shadow-lg'
              >
                Subscribe
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </form>

            {/* Clear button with theme styling */}
            {email && (
              <div className='mt-6 animate-fade-in'>
                <button 
                  onClick={onClear} 
                  className='inline-flex items-center px-4 py-2 text-sm text-[#386861] hover:text-[#294944] hover:bg-[#F7D270]/20 rounded-full transition-all duration-200 border border-[#F7D270]/50 hover:border-[#F7D270] shadow-md hover:shadow-lg'
                >
                  Clear email
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-200 hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Trust indicators with theme colors */}
            <div className='mt-12 flex justify-center items-center space-x-8 opacity-70'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-[#F7D270] rounded-full animate-pulse'></div>
                <span className='text-sm text-[#294944] font-medium'>Free Newsletter</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-[#386861] rounded-full animate-pulse delay-300'></div>
                <span className='text-sm text-[#294944] font-medium'>Weekly Updates</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-[#294944] rounded-full animate-pulse delay-700'></div>
                <span className='text-sm text-[#294944] font-medium'>Expert Insights</span>
              </div>
            </div>
          </div>

          {/* Enhanced decorative elements with theme colors */}
          <div className='absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-t from-[#F7D270]/20 to-[#386861]/10 blur-3xl animate-pulse'></div>
          <div className='absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-b from-[#386861]/20 to-[#294944]/15 blur-2xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-10 w-32 h-32 rounded-full bg-[#F7D270]/15 blur-xl animate-pulse delay-500'></div>
          <div className='absolute bottom-20 right-20 w-24 h-24 rounded-full bg-[#294944]/20 blur-lg animate-pulse delay-1500'></div>
        </div>
      </div>

      {/* Custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Header;
