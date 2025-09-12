"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { baseURL, company } from "@/config/api";

const Company = company;

// Blog categories
const blogCategories = [
  "All",
  "ABM",
  "Advertising",
  "Content Creation",
  "Demand Generation",
  "Intent Data",
  "Sales",
];

const BlogCard = ({ blog, index }) => {
  const { title, description = "", category, image, _id, slug } = blog;
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    window.location.href = `/blogs/${slug || _id}`;
  };

  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const wordsPerMinute = 200;
    const words = text.replace(/<[^>]+>/g, "").split(" ").length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative cursor-pointer h-[420px]"
      onClick={handleClick}
    >
      {/* Main Card Container with fixed height */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#F7D270]/50 h-full flex flex-col">
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7D270]/0 via-[#F7D270]/0 to-[#386861]/0 group-hover:from-[#F7D270]/5 group-hover:via-[#F7D270]/3 group-hover:to-[#386861]/5 transition-all duration-700"></div>
        
        {/* Image Section - Fixed Height */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={image || "/default-blog.jpg"}
            alt={title || "Blog"}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'scale-100' : 'scale-110'
            }`}
            style={{
              filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)',
            }}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay with animated opacity */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-[#294944]/90 via-[#294944]/30 to-transparent"
            animate={{
              opacity: isHovered ? 0.8 : 0.6
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Animated Category Badge */}
          {category && (
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
            >
              <motion.span 
                className="inline-flex items-center px-4 py-2 bg-[#F7D270] text-[#294944] text-xs font-bold rounded-full shadow-lg"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.span>
            </motion.div>
          )}

          {/* Interactive Reading Time with Icon Animation */}
          <motion.div 
            className="absolute bottom-4 left-4 flex items-center space-x-2 text-white bg-black/30 backdrop-blur-sm rounded-full px-3 py-1"
            whileHover={{ scale: 1.05 }}
          >
            <motion.svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </motion.svg>
            <span className="text-sm font-medium">{readingTime} min read</span>
          </motion.div>

          {/* Floating Action Buttons */}
          <motion.div 
            className="absolute top-4 left-4 flex space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* Content Section - Flexible Height */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Title with Character Limit */}
          <motion.h3 
            className="text-xl font-bold text-[#294944] mb-3 leading-tight"
            animate={{ color: isHovered ? "#386861" : "#294944" }}
            transition={{ duration: 0.3 }}
          >
            {title?.length > 60 ? `${title.slice(0, 60)}...` : title}
          </motion.h3>

          {/* Description with Fixed Height */}
          <div className="flex-1 mb-4">
            <div
              className="text-gray-600 text-sm leading-relaxed h-16 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: description
                  ? description.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
                  : "Discover insights and knowledge in this featured article...",
              }}
            />
          </div>

          {/* Interactive Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <motion.button 
              className="flex items-center space-x-2 text-[#386861] hover:text-[#294944] font-semibold group/btn"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Read More</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </motion.button>

           
          </div>
        </div>

        {/* Animated Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent, transparent, ${isHovered ? '#F7D270' : 'transparent'})`,
            padding: '2px',
          }}
          animate={{
            background: isHovered 
              ? 'linear-gradient(45deg, #F7D270, transparent, transparent, #386861)' 
              : 'linear-gradient(45deg, transparent, transparent, transparent, transparent)',
          }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

const FilterButton = ({ category, isActive, onClick, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 relative overflow-hidden ${
      isActive
        ? "bg-[#F7D270] text-[#294944] shadow-lg"
        : "bg-white text-[#294944] hover:bg-[#F7D270]/20 border border-gray-200"
    }`}
  >
    <motion.span
      className="relative z-10"
      animate={{ y: 0 }}
      whileHover={{ y: -1 }}
    >
      {category}
    </motion.span>
    {isActive && (
      <motion.div
        layoutId="activeFilter"
        className="absolute inset-0 bg-[#F7D270]"
        initial={false}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    )}
  </motion.button>
);

const SearchBar = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="relative max-w-xl mx-auto"
      whileFocus={{ scale: 1.02 }}
    >
      <motion.div
        className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 ${
          isFocused ? 'shadow-xl ring-2 ring-[#F7D270]/50' : ''
        }`}
        animate={{ 
          boxShadow: isFocused 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <input
          type="text"
          placeholder="Search articles, topics, or insights..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-6 py-4 pl-14 pr-12 text-[#294944] placeholder-gray-400 bg-transparent rounded-2xl focus:outline-none text-lg"
        />
        <motion.div 
          className="absolute left-5 top-1/2 transform -translate-y-1/2"
          animate={{ scale: isFocused ? 1.1 : 1, color: isFocused ? '#F7D270' : '#9CA3AF' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </motion.div>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [company, setCompany] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCompany(Company);
      console.log(company);
    }
  }, []);

  const fetchBlogs = async () => {
    if (!company) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/admin/blogs?company=${company}`
      );
      const filteredBlogs =
        response.data?.blogs?.filter((blog) => blog.company === company) || [];
      setBlogs(filteredBlogs);
      setSearchResults(filteredBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [company]);

  const handleSearch = (searchTerm) => {
    setInput(searchTerm);
    if (!searchTerm.trim()) {
      setSearchResults(blogs);
      return;
    }
    const filtered = blogs.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input, blogs]);

  const getFilteredBlogs = () => {
    let filtered = searchResults;
    if (menu !== "All") {
      filtered = filtered.filter((item) => item.category === menu);
    }
    return filtered;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F7D270]/5 to-[#386861]/10">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-r from-[#294944] via-[#386861] to-[#294944] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#F7D270]/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * 600,
                scale: 0 
              }}
              animate={{ 
                y: [null, -100],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              animate={{ 
                backgroundImage: ['linear-gradient(45deg, #F7D270, #ffffff)', 'linear-gradient(45deg, #ffffff, #F7D270)'],
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="text-[#F7D270]">Explore</span> Our <br />
              <span className="text-white">Knowledge Hub</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Dive into a curated collection of insights, trends, and expert
              knowledge designed to elevate your understanding and inspire
              action.
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8"
            >
              <SearchBar value={input} onChange={setInput} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Filter Section */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {blogCategories.map((category, index) => (
              <FilterButton
                key={category}
                category={category}
                isActive={menu === category}
                onClick={() => setMenu(category)}
                index={index}
              />
            ))}
          </div>
          
          {/* Results Counter */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[#386861] font-medium">
              {getFilteredBlogs().length} articles found
              {menu !== "All" && ` in ${menu}`}
              {input && ` matching "${input}"`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-[#F7D270] border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-[#294944] text-lg font-medium">
                Loading amazing content...
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${menu}-${input}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {getFilteredBlogs().length > 0 ? (
                getFilteredBlogs().map((item, index) => (
                  <BlogCard key={item._id} blog={item} index={index} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-6"
                  >
                    <svg className="w-24 h-24 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#294944] mb-3">
                    No Articles Found
                  </h3>
                  <p className="text-[#386861] text-lg max-w-md mx-auto">
                    {input
                      ? `No results match "${input}". Try adjusting your search or exploring different categories.`
                      : "No articles available in this category yet. Check back soon for new content!"}
                  </p>
                  {input && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput("")}
                      className="mt-6 px-6 py-3 bg-[#F7D270] text-[#294944] rounded-full font-semibold hover:bg-[#F7D270]/90 transition-colors"
                    >
                      Clear Search
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default BlogList;