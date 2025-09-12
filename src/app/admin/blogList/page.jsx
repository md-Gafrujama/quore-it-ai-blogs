"use client";
import React, { useEffect, useState } from 'react';
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { baseURL } from '@/config/api';

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const { axios } = useAppContext();

  // Fetch blogs for company "Zto"
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const company = localStorage.getItem("company");
      const { data } = await axios.get(`${baseURL}/api/admin/blogs?company=quoreit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        const sortedBlogs = data.blogs.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date);
          const dateB = new Date(b.createdAt || b.date);
          return dateB - dateA;
        });
        setBlogs(sortedBlogs);
      } else {
        toast.error(data.message || 'Failed to fetch blogs');
        setBlogs([]);
      }
    } catch (error) {
      toast.error(error.message);
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1>All blogs for company specific</h1>
      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
              <th scope='col' className='px-2 py-4'> Blog Title </th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Status </th>
              <th scope='col' className='px-2 py-4'> Actions </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(blogs) && blogs.length > 0 ? (
              blogs.map((blog, index) => {
                try {
                  return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />;
                } catch (err) {
                  return <tr key={blog._id}><td colSpan={5}>Error rendering blog: {blog.title}</td></tr>;
                }
              })
            ) : (
              <tr><td colSpan={5} className="text-center py-8">No blogs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
