"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiArrowRight } from 'react-icons/fi';

const Header = () => {
  const [email, setEmail] = useState("");
  const inputRef = useRef();
  
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
    
    <div className="relative overflow-hidden bg-gradient-to-br from-[#d4f8e8] to-[#aee6cf] pt-20 md:pt-2">
      
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300796b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 text-green-700">
          Latest Blogs
        </h1>
        <span className="block text-3xl sm:text-4xl font-medium text-gray-800 mt-2">
          Stay Updated
        </span>

        {/* Subheading */}
        <p className="mt-6 mb-10 max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
          Discover insightful articles, industry trends, and expert knowledge 
          delivered straight to your inbox. Join our community of readers today.
        </p>

        {/* Email form */}
        <form 
          onSubmit={onSubmitHandler} 
          className="relative flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <input 
              ref={inputRef}
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              placeholder="Enter your email address" 
              required 
              className="w-full px-6 py-4 pr-12 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            {email && (
              <button 
                type="button"
                onClick={onClear} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear email"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            Subscribe
            <FiArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            Free Newsletter
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            Weekly Updates
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            Expert Insights
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
