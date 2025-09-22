
import React from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon, TrashIcon ,PencilIcon } from '@heroicons/react/24/outline'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import { baseURL } from '@/config/api';
const BlogTableItem = ({ blog, fetchBlogs, index }) => {
    const router = useRouter();
    const isPublished = blog.isPublished;
    const BlogDate = blog.createdAt ? new Date(blog.createdAt) : (blog.date ? new Date(blog.date) : null);
    const { axios } = useAppContext();

   const handleEdit = () => {
     router.push(`/admin/editBlog/${blog._id}`);
   }
     
    const handlePublish = async () => {
      try {
        // const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.post(`${baseURL}/api/blog/toggle-publish`, { id: blog._id });
        if (data.success) {
          toast.success('Blog published!');
          fetchBlogs();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    const handleUnpublish = async () => {
      try {
        // const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.post(`${baseURL}/api/blog/toggle-publish`, { id: blog._id });
        if (data.success) {
          toast.success('Blog unpublished!');
          fetchBlogs();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    const handleDelete = async () => {
      if (confirm('Are you sure you want to delete this blog?')) {
        try {
          // const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
          const { data } = await axios.post(`${baseURL}/api/blog/delete`, { id: blog._id });
          if (data.success) {
            toast.success('Blog deleted!');
            fetchBlogs();
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    return (
      <tr className='bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100'>
        <td className='px-6 py-4'>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00D7A4] to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {(blog.author || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="font-medium text-gray-900">{blog.author || 'No author'}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>
        </td>
        <td className='px-6 py-4'>
          <div className="max-w-xs">
            <p className="font-medium text-gray-900 truncate" title={blog.title}>
              {blog.title || 'No title'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Blog post</p>
          </div>
        </td>
        <td className='px-6 py-4 hidden md:table-cell'>
          <div className="text-sm">
            <p className="text-gray-900 font-medium">
              {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleDateString() : 'No date'}
            </p>
            <p className="text-gray-500">
              {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
            </p>
          </div>
        </td>
        <td className='px-6 py-4 hidden sm:table-cell'>
          {isPublished ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Published
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              Draft
            </span>
          )}
        </td>
        <td className='px-6 py-4'>
          <div className="flex items-center gap-2">
            {isPublished ? (
              <button
                className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={handleUnpublish}
                title="Unpublish blog"
              >
                <EyeSlashIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Unpublish</span>
              </button>
            ) : (
              <button
                className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-[#00D7A4] to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={handlePublish}
                title="Publish blog"
              >
                <EyeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Publish</span>
              </button>
            )}
            <button
              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={handleDelete}
              title="Delete blog"
            >
              <TrashIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
                <button
              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={handleEdit}
              title="Edit blog"
            >
              <PencilIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </td>
      </tr>
    )
}

export default BlogTableItem