'use client'

import { assets } from '@/Assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useRouter } from 'next/navigation';
import { baseURL } from '@/config/api';

const Page = () => {
  const [isPublished, setIsPublished] = useState(false);
  const router = useRouter();
  const { axios } = useAppContext()
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'ABM',
    author: 'Alex Bennett',
    authorImg: '/author_img.png',
    company: '',
  })

  const [approvedCompanies, setApprovedCompanies] = useState([])

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      })
      const editorElement = editorRef.current.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.classList.add('rich-text');
      }
    }
  }, [])

  useEffect(() => {
    const fetchApprovedCompanies = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/super-admin/getRequests`)
        const data = res.data
        let companies = []
        if (Array.isArray(data)) {
          companies = data.filter(c => c.status === "approved")
        } else if (Array.isArray(data.data)) {
          companies = data.data.filter(c => c.status === "approved")
        }
        setApprovedCompanies(companies)
      } catch (error) {
        setApprovedCompanies([])
      }
    }
    fetchApprovedCompanies()
  }, [axios])

  const generateContent = async () => {
    if (!data.title) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${baseURL}/api/blog/generate`,
        { prompt: data.title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        quillRef.current.root.innerHTML = response.data.content;
        const editorElement = editorRef.current.querySelector('.ql-editor');
        if (editorElement && !editorElement.classList.contains('rich-text')) {
          editorElement.classList.add('rich-text');
        }
        toast.success('AI content generated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Generate content error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Failed to generate content');
    } finally {
      setLoading(false)
    }
  }

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => ({ ...data, [name]: value }))
  }

  const company = localStorage.getItem("company");
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!data.title || !data.category || !data.author || !image || !company) {
      toast.error('Please fill all required fields');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', quillRef.current.root.innerHTML);
    formData.append('category', data.category);
    formData.append('author', data.author);
    formData.append('authorImg', data.authorImg);
    formData.append('image', image);
    formData.append('isPublished', isPublished);
    formData.append('company', 'quoreit');

    try {
      setLoading(true)
      const response = await axios.post(`${baseURL}/api/blog/add`, formData);
      if (response.data.success) {
        toast.success('Blog added successfully!');
        setTimeout(() => {
          router.push('/admin/blogList');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Failed to add blog');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-6 md:py-10 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Create New Blog</h1>
          <p className="text-gray-600">Share your insights with the world. Create engaging content that resonates.</p>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-teal-100"
        >
          <p className="text-lg font-semibold text-gray-700 mb-3">Upload Thumbnail</p>
          <label htmlFor="image" className="inline-block cursor-pointer group">
            <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-[#00D7A4] hover:border-teal-500 transition-all duration-300 group-hover:scale-105">
              <Image
                className="object-cover"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                width={200}
                height={120}
                alt="thumbnail"
              />
              <div className="absolute inset-0 bg-[#00D7A4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />

          <div className="mt-8">
            <p className="text-lg font-semibold text-gray-700 mb-3">Blog Title</p>
            <input
              name="title"
              onChange={onChangeHandler}
              value={data.title}
              className="w-full max-w-2xl px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#00D7A4] focus:ring-4 focus:ring-teal-100 transition-all duration-200"
              type="text"
              placeholder="Enter an engaging title..."
              required
            />
          </div>

          <div className="mt-6">
            <p className="text-lg font-semibold text-gray-700 mb-3">Author</p>
            <input
              name="author"
              onChange={onChangeHandler}
              value={data.author}
              className="w-full max-w-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#00D7A4] focus:ring-4 focus:ring-teal-100 transition-all duration-200"
              type="text"
              placeholder="Author name..."
              required
            />
          </div>

          <div className="mt-8">
            <p className="text-lg font-semibold text-gray-700 mb-3">Blog Description</p>
            <div className="max-w-4xl min-h-[350px] relative rounded-xl border-2 border-gray-200 focus-within:border-[#00D7A4] transition-colors duration-200">
              <div ref={editorRef} className="h-full"></div>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-[#00D7A4] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#00D7A4] font-medium">Generating content...</span>
                  </div>
                </div>
              )}
              <button
                disabled={loading}
                type="button"
                onClick={generateContent}
                className="absolute bottom-3 right-3 px-4 py-2 bg-[#00D7A4] hover:bg-teal-600 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
              >
                ✨ Generate with AI
              </button>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-lg font-semibold text-gray-700 mb-3">Blog Category</p>
            <select
              name="category"
              onChange={onChangeHandler}
              value={data.category}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 bg-white focus:outline-none focus:border-[#00D7A4] focus:ring-4 focus:ring-teal-100 hover:border-teal-300 transition-all duration-200"
            >
              <option value="ABM">ABM</option>
              <option value="Advertising">Advertising</option>
              <option value="Content Creation">Content Creation</option>
              <option value="Demand Generation">Demand Generation</option>
              <option value="Intent Data">Intent Data</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={e => setIsPublished(e.target.checked)}
              className="w-5 h-5 text-[#00D7A4] border-2 border-gray-300 rounded focus:ring-teal-400 focus:ring-2"
            />
            <label htmlFor="publish" className="text-gray-700 font-medium cursor-pointer">
              Publish immediately after creation
            </label>
          </div>

          <button
            type="submit"
            className="mt-10 px-8 py-3 bg-[#00D7A4] hover:bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Add Blog"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page
