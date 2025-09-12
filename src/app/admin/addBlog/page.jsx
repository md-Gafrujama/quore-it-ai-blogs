'use client'

import { assets } from '@/Assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import parse from 'html-react-parser'
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
      // Add rich-text class to the editor for proper styling
      const editorElement = editorRef.current.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.classList.add('rich-text');
      }
    }
  }, [])

  // Fetch approved companies
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
      // Call the backend endpoint using axios with Authorization header
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
        // Set HTML content and ensure proper styling
        quillRef.current.root.innerHTML = response.data.content;
        // Add rich-text class to ensure proper styling
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
    formData.append('company', 'personifiedb2b');

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
    <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-10">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-md"
      >
        {/* Upload Thumbnail */}
        <p className="text-lg font-medium text-gray-700">Upload Thumbnail</p>
        <label htmlFor="image" className="mt-3 inline-block cursor-pointer">
          <Image
            className="rounded-xl border border-dashed border-gray-300 hover:scale-105 transition-transform"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            width={200}
            height={120}
            alt="thumbnail"
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          hidden
          required
        />

        {/* Blog Title */}
        <p className="text-lg font-medium text-gray-700 mt-6">Blog Title</p>
        <input
          name="title"
          onChange={onChangeHandler}
          value={data.title}
          className="w-full max-w-xl mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Type here..."
          required
        />

        {/* Author Section */}
        <div className="mt-6">
          <p className="text-lg font-medium text-gray-700">Author</p>
          <input
            name="author"
            onChange={onChangeHandler}
            value={data.author}
            className="w-full max-w-xl mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Author name..."
            required
          />
        </div>

        {/* Blog Description (Quill) */}
        <p className="text-lg font-medium text-gray-700 mt-6">Blog Description</p>
        <div className="max-w-xl min-h-[300px] relative mt-2 rounded-lg border border-gray-300 px-3 py-3">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button
            disabled={loading}
            type="button"
            onClick={generateContent}
            className="absolute bottom-2 right-2 text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md shadow transition-all"
          >
            Generate with AI
          </button>
        </div>

        {/* Blog Category */}
        <p className="text-lg font-medium text-gray-700 mt-6">Blog Category</p>
        <select
          name="category"
          onChange={onChangeHandler}
          value={data.category}
          className="w-40 mt-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:shadow-lg hover:bg-blue-50 transition-all duration-300 ease-in-out"
        >
          <option value="ABM">ABM</option>
          <option value="Advertising">Advertising</option>
          <option value="Content Creation">Content Creation</option>
          <option value="Demand Generation">Demand Generation</option>
          <option value="Intent Data">Intent Data</option>
          <option value="Sales">Sales</option>
        </select>

        {/* Approved Companies Dropdown
        <p className="text-lg font-medium text-gray-700 mt-6">Company</p>
        <select
          name="company"
          onChange={onChangeHandler}
          value={data.company}
          className="w-40 mt-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 hover:shadow-lg hover:bg-blue-50 transition-all duration-300 ease-in-out"
          required
        >
          <option value="">Select Company</option>
          {approvedCompanies.map(company => (
            <option key={company._id} value={company.company}>
              {company.company}
            </option>
          ))}
        </select> */}

        {/* Publish Now Checkbox */}
        <div className="flex gap-2 mt-4 items-center">
          <input
            type="checkbox"
            id="publish"
            checked={isPublished}
            onChange={e => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer"
          />
          <label htmlFor="publish" className="text-gray-700">Publish Now</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-8 w-40 h-10 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-all shadow"
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
  )
}

export default Page

