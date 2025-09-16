"use client";
import React, { useEffect, useState } from 'react'
import CommentTableItem from '@/Components/AdminComponents/CommentTableItem'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import { baseURL } from '@/config/api';
import { ChatBubbleLeftRightIcon, MagnifyingGlassIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const Comments = () => {
    const [comments, setComments] = useState([])
    const [filter, setFilter] = useState('Not Approved')
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    const {axios} = useAppContext();

    const fetchComments = async ()=>{
        try {
          setLoading(true)
          const { data } = await axios.get(`${baseURL}/api/admin/comments`)
          data.success ? setComments(data.comments) : toast.error(data.message)
        } catch (error) {
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
    }

    useEffect(()=>{
        fetchComments()
    },[])

    // Filter and search comments
    const filteredComments = comments.filter((comment) => {
        const matchesFilter = filter === "Approved" ? comment.isApproved === true : comment.isApproved === false;
        const matchesSearch = searchTerm === '' || 
                             comment.blog?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             comment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             comment.content?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const approvedCount = comments.filter(comment => comment.isApproved).length;
    const pendingCount = comments.filter(comment => !comment.isApproved).length;

    return (
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen'>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00D7A4] to-teal-600 rounded-xl flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Comments Management</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Review and manage blog comments from your readers</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                                <p className="text-3xl font-bold text-gray-900">{comments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <CheckCircleIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        {/* Filter Buttons */}
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setFilter('Not Approved')} 
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    filter === 'Not Approved' 
                                        ? 'bg-gradient-to-r from-[#00D7A4] to-teal-600 text-white shadow-md' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <ClockIcon className="w-4 h-4" />
                                Pending Review ({pendingCount})
                            </button>
                            <button 
                                onClick={() => setFilter('Approved')} 
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    filter === 'Approved' 
                                        ? 'bg-gradient-to-r from-[#00D7A4] to-teal-600 text-white shadow-md' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                Approved ({approvedCount})
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search comments, blogs, or authors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00D7A4] focus:ring-4 focus:ring-teal-100 transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Comments Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D7A4]"></div>
                            <span className="ml-4 text-gray-600 text-lg">Loading comments...</span>
                        </div>
                    ) : filteredComments.length === 0 ? (
                        <div className="text-center py-16">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms.' : `No ${filter.toLowerCase()} comments available.`}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Blog Title & Comment
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredComments.map((comment) => (
                                        <CommentTableItem 
                                            key={comment._id} 
                                            comment={comment} 
                                            fetchComments={fetchComments} 
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comments
