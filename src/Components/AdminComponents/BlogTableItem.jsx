
import React from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import { baseURL } from '@/config/api';
const BlogTableItem = ({ blog, fetchBlogs, index }) => {
    const router = useRouter();
    const isPublished = blog.isPublished;
    const BlogDate = blog.createdAt ? new Date(blog.createdAt) : (blog.date ? new Date(blog.date) : null);
    const { axios } = useAppContext();

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
      <tr className='bg-white border-b'>
        <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
          {/* <Image width={40} height={40} src={blog.authorImg ? blog.authorImg : assets.profile_icon} alt={blog.author || 'author'} /> */}
          <p>{blog.author || 'No author'}</p>
        </th>
        <td className='px-6 py-4'>
          {blog.title || 'no title'}
        </td>
        <td className='px-6 py-4'>
          {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleDateString() : 'No date'}
        </td>
        <td className='px-6 py-4'>
          {isPublished ? (
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
              Published
            </span>
          ) : (
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
              Draft
            </span>
          )}
        </td>
        <td className='px-6 py-4'>
          <div className="flex gap-2">
            {isPublished ? (
              <button
                className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs border border-yellow-600 font-semibold"
                onClick={handleUnpublish}
                title="Unpublish blog"
              >
                <EyeSlashIcon className="w-4 h-4" />
                Unpublish
              </button>
            ) : (
              <button
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs border border-blue-600 font-semibold"
                onClick={handlePublish}
                title="Publish blog"
              >
                <EyeIcon className="w-4 h-4" />
                Publish
              </button>
            )}
            <button
              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs border border-red-600 font-semibold"
              onClick={handleDelete}
              title="Delete blog"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </td>
      </tr>
    )
}

export default BlogTableItem