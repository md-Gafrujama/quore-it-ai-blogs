import React from 'react'
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { baseURL } from '@/config/api';
import { CheckCircleIcon, TrashIcon, UserCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const {data} = await axios.post(`${baseURL}/api/admin/approve-comment`, {id: _id})
      if (data.success) {
        toast.success(data.message)
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  const deleteComment = async () => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this comment?');
      if(!confirm) return;

      const {data} = await axios.post(`${baseURL}/api/admin/delete-comment`, {id: _id})
      if (data.success) {
        toast.success(data.message)
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <tr className='bg-white hover:bg-gray-50 transition-colors duration-200'>
      <td className='px-6 py-6'>
        <div className="space-y-4">
          {/* Blog Title */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <DocumentTextIcon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Blog Post</p>
              <p className="font-semibold text-gray-900 line-clamp-2" title={blog?.title}>
                {blog?.title || 'No title'}
              </p>
            </div>
          </div>

          {/* Commenter Info */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00D7A4] to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCircleIcon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Commenter</p>
              <p className="font-medium text-gray-900">
                {comment.name || 'Anonymous'}
              </p>
            </div>
          </div>

          {/* Comment Content */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-2">Comment</p>
            <p className="text-gray-900 leading-relaxed line-clamp-3" title={comment.content}>
              {comment.content || 'No content'}
            </p>
          </div>
        </div>
      </td>
      
      <td className='px-6 py-6 hidden md:table-cell'>
        <div className="text-sm">
          <p className="text-gray-900 font-medium">
            {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleDateString() : 'No date'}
          </p>
          <p className="text-gray-500 mt-1">
            {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
          </p>
        </div>
      </td>
      
      <td className='px-6 py-6'>
        <div className='flex items-center gap-3'>
          {!comment.isApproved ? (
            <button
              onClick={approveComment}
              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              title="Approve comment"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Approve</span>
            </button>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Approved
            </span>
          )}
          
          <button
            onClick={deleteComment}
            className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            title="Delete comment"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem