"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Simple date formatter
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-61 overflow-hidden">
          <motion.img
            src={image || "/default-blog.jpg"}
            alt={title || "Blog"}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              imageLoaded ? "scale-100" : "scale-110"
            }`}
            // style={{
            //   filter: isHovered
            //     ? "brightness(1.1) contrast(1.1)"
            //     : "brightness(1) contrast(1)",
            // }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {category}
              </span>
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {formatDate(blog.createdAt || new Date())}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug mb-3 transition-colors duration-300 ${
              isHovered ? "text-green-600" : "text-gray-900"
            }`}
          >
            {title?.length > 90 ? `${title.slice(0, 90)}...` : title}
          </h3>

          {/* Button */}
          <div className="mt-auto">
            <motion.button
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              READ MORE
              <motion.svg
                className="w-4 h-4 ml-2"
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
      <section className="relative bg-gradient-to-r from-[#e8f3f2] via-[#d9e8e6] to-[#e8f3f2] text-gray-800 py-15 overflow-hidden">
  {/* Animated elements */}
  <div className="absolute inset-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-[#386861]/20 rounded-full"
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * 600,
          scale: 0 
        }}
        animate={{ 
          y: [null, -100],
          scale: [0, 1, 0],
          opacity: [0, 0.5, 0]
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
        className="text-3xl md:text-6xl font-bold mb-6"
        animate={{ 
          backgroundImage: 'linear-gradient(45deg, #1a3d3a, #2a5a54)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}
      >
        <span className="text-[#32800F]">Explore Our</span>  <br />
        <span className="text-[#32800F]">Knowledge Hub</span>
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Dive into a curated collection of insights, trends, and expert
        knowledge designed to elevate your understanding and inspire
        action.
      </motion.p>

      {/* Smaller Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-4 max-w-md mx-auto"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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