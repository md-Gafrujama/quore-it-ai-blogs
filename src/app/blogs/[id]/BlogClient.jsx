"use client";
import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Head from 'next/head';
import BlogItem from '@/Components/BlogItem';
import { motion } from 'framer-motion';
import NavbarNew from "@/Components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGooglePlusG, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { baseURL, company } from '@/config/api';

const BlogClient = ({ slug }) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const inputRef = useRef(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // SEO Structured Data
  const generateStructuredData = (blog) => {
    if (!blog) return null;
    const blogUrl = `${baseURL}/blogs/${blog.slug}`;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
      "image": blog.image,
      "author": { "@type": "Person", "name": blog.author || "Admin" },
      "publisher": {
        "@type": "Organization",
        "name": "AI Blog",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseURL}/logo.png`
        }
      },
      "datePublished": blog.date || blog.createdAt,
      "dateModified": blog.updatedAt || blog.date || blog.createdAt,
      "mainEntityOfPage": { "@type": "WebPage", "@id": blogUrl },
      "url": blogUrl,
      "articleSection": blog.category,
      "keywords": [blog.category, "blog", "article", "technology", "startup", "lifestyle"],
      "wordCount": blog.description?.replace(/<[^>]+>/g, '').split(' ').length || 0,
      "commentCount": comments.length,
      "comment": comments.map(comment => ({
        "@type": "Comment",
        "author": { "@type": "Person", "name": comment.name },
        "text": comment.content,
        "dateCreated": comment.createdAt
      }))
    };
  };

  // Fetch blog data
  const fetchBlogData = async () => {
    if (!slug) return;
    try {
      const response = await axios.get(`${baseURL}/api/blog/slug/${slug}`);
      if (response.data.success && response.data.blog && response.data.blog.company === company) {
        setData(response.data.blog);
      } else {
        setData(null);
      }
    } catch {
      setData(null);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    if (!slug) return;
    try {
      const res = await axios.post(`${baseURL}/api/blog/comments`, { blogSlug: slug });
      if (res.data.success) setComments(res.data.comments);
    } catch {}
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${baseURL}/api/blog/add-comment`, {
        blog: data._id,
        name,
        content,
      });
      if (res.data.success) {
        setName('');
        setContent('');
        fetchComments();
        toast.success('Comment added successfully!');
      }
    } catch {
      toast.error('Error adding comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social share handler
  const handleSocialShare = (platform) => {
    if (!data) return;
    const url = encodeURIComponent(`${baseURL}/blogs/${slug}`);
    const title = encodeURIComponent(data.title);
    const description = encodeURIComponent(
      data.description?.replace(/<[^>]+>/g, '').slice(0, 160) || ''
    );
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}&hashtags=blog,article`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'googleplus':
        shareUrl = `https://plus.google.com/share?url=${url}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, 'share-dialog', 'width=600,height=500,resizable=yes,scrollbars=yes');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const trimmed = (email || '').trim();
    if (!trimmed) {
      toast.error('Please enter your email');
      return;
    }
    setIsSubscribing(true);
    try {
      const { data } = await axios.post(`${baseURL}/api/blog/subscribe`, {
        email: trimmed, company: company
      }, {
        headers: { "Content-Type": "application/json" }
      });
      if (data?.success) {
        toast.success(data.msg || 'Subscribed successfully');
        setEmail('');
        if (inputRef.current) inputRef.current.value = '';
      } else {
        toast.error(data?.message || 'Subscription failed');
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      toast.error(apiMessage || error.message || 'Error occurred while subscribing');
    } finally {
      setIsSubscribing(false);
    }
  };

  const onClear = () => {
    setEmail('');
    if (inputRef.current) inputRef.current.value = '';
  };

  useEffect(() => { if (slug) { fetchBlogData(); fetchComments(); } }, [slug]);

  // Fetch related blogs after main blog is loaded
  useEffect(() => {
    if (data && data.category) {
      const fetchRelated = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/blog/all`);
          if (response.data.success) {
            const related = response.data.blogs.filter(
              (b) => b.category === data.category && b.slug !== data.slug && b.isPublished !== false && b.company === company
            ).slice(0, 3);
            setRelatedBlogs(related);
          }
        } catch {
          setRelatedBlogs([]);
        }
      };
      fetchRelated();
    }
  }, [data]);

  // Blog Not Found
  const BlogNotFound = () => (
    <>
      <div className='min-h-screen bg-gradient-to-br from-[#294944] via-[#386861] to-[#294944] flex items-center justify-center px-3 sm:px-6 md:px-12 lg:px-28 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-10 relative'>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl mx-auto w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 xs:mb-6 sm:mb-8 bg-gradient-to-r from-[#F7D270] to-[#eac25f] rounded-full flex items-center justify-center shadow-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-[#294944]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 xs:mb-3 sm:mb-4">404</motion.h1>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-[#F7D270] mb-3 xs:mb-4 sm:mb-6 px-3 xs:px-4">Blog Not Found</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 mb-6 xs:mb-6 sm:mb-8 leading-relaxed px-3 xs:px-4 max-w-lg mx-auto">
            The blog post you're looking for doesn't exist or has been moved. <br className="hidden xs:block" />
            Let's get you back to discovering amazing content.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-3 xs:px-4">
            <Link href="/blogs" className="w-full xs:w-auto bg-[#F7D270] hover:bg-[#eac25f] text-[#294944] px-6 xs:px-8 py-3 xs:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm xs:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
              </svg>
              Browse All Blogs
            </Link>
            <Link href="/" className="w-full xs:w-auto bg-transparent border-2 border-[#F7D270] text-[#F7D270] hover:bg-[#F7D270] hover:text-[#294944] px-6 xs:px-8 py-3 xs:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm xs:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );

  // MAIN RENDER
  return (data ? (
    <>
      <NavbarNew />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(data)) }} />
      </Head>
      {/* Blog Hero */}
      <div className='relative bg-gradient-to-br from-[#294944] via-[#386861] to-[#294944] py-20 px-5 md:px-12 lg:px-28 overflow-hidden'>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        <div className='relative z-10'>
          <div className='text-center my-20 max-w-4xl mx-auto'>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className='inline-block bg-[#F7D270]/20 backdrop-blur-sm border border-[#F7D270]/30 rounded-full px-4 py-2 mb-6'>
              <span className='text-[#F7D270] text-sm font-medium'>{data.category}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-4xl md:text-6xl font-bold max-w-[900px] mx-auto leading-tight text-white mb-8 tracking-tight'>
              {data.title}
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='flex flex-col md:flex-row items-center justify-center gap-6 text-[#E5F2EF]'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center text-white font-semibold'>
                  {data.author?.charAt(0) || 'A'}
                </div>
                <span className='text-lg font-medium'>By {data.author}</span>
              </div>
              <div className='flex items-center gap-2 text-[#E5F2EF]'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className='text-lg'>{new Date(data.createdAt || data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className='relative -mt-20 z-20'>
        <div className='mx-5 max-w-4xl md:mx-auto'>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className='relative'>
            <Image
              className='rounded-2xl w-full shadow-2xl bg-white'
              src={data.image}
              width={1200}
              height={600}
              alt={data.title}
              style={{
                aspectRatio: '2/1',
                objectFit: 'cover',
                objectPosition: 'center',
                width: '100%',
                height: '600px',
                maxHeight: '600px',
                minHeight: '600px'
              }}
            />
          </motion.div>

          <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }} className='mt-12'>
            <div className='blog-content-wrapper max-w-none'>
              <style jsx>{`
                .blog-content-wrapper h1,
                .blog-content-wrapper h2,
                .blog-content-wrapper h3,
                .blog-content-wrapper h4,
                .blog-content-wrapper h5,
                .blog-content-wrapper h6 {
                  font-weight: 900;
                  color: #22223B;
                  margin-top: 2.5rem;
                  margin-bottom: 1.2rem;
                  letter-spacing: -0.02em;
                  line-height: 1.16;
                }
                .blog-content-wrapper h1 {
                  font-size: 2.75rem;
                  font-weight: 800;
                  line-height: 1.1;
                  margin: 3rem 0 2rem 0;
                  color: #0f172a;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  letter-spacing: -0.02em;
                  position: relative;
                }
                .blog-content-wrapper h2 {
                  font-size: 2.25rem;
                  background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
                  border-left: 4px solid #386861;
                  padding-left: 1.2rem;
                  border-radius: 10px;
                }
                .blog-content-wrapper h3 {
                  font-size: 1.6rem;
                  border-bottom: 2px solid #F7D270;
                  padding-bottom: 5px;
                }
                .blog-content-wrapper h4 { font-size: 1.3rem; }
                .blog-content-wrapper h5 { font-size: 1.1rem; }
                .blog-content-wrapper h6 { font-size: 1rem; }
                .blog-content-wrapper strong, .blog-content-wrapper b {
                  font-weight: 900;
                  padding: 1px 6px;
                  background: linear-gradient(120deg, #FFFBE8 0%, #F7D270 80%, #e4e4e7 100%);
                  border-radius: 4px;
                  color: #294944;
                }
                .blog-content-wrapper p {
                  margin: 1.5rem 0;
                  line-height: 1.85;
                  color: #444;
                  font-size: 19px;
                  text-align: justify;
                  text-justify: inter-word;
                }
                .blog-content-wrapper p:first-of-type::first-letter {
                  font-size: 3.3rem;
                  font-weight: 700;
                  line-height: 1;
                  color: #386861;
                  float: left;
                  margin: 8px 12px 0 0;
                  font-family: serif;
                }
                .blog-content-wrapper ul, .blog-content-wrapper ol {
                  margin: 2rem 0;
                  padding-left: 2.5rem;
                }
                .blog-content-wrapper blockquote {
                  border-left: 6px solid #386861;
                  background: #f0fdf4;
                  padding: 1.5rem 2.2rem;
                  font-size: 1.2rem;
                  color: #334155;
                  border-radius: 12px;
                  margin: 2.5rem 0;
                  font-style: italic;
                }
                .blog-content-wrapper img {
                  margin: 2rem auto;
                  border-radius: 16px;
                  width: 90%;
                  display: block;
                  object-fit: contain;
                  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.13);
                }
                .blog-content-wrapper a {
                  color: #386861;
                  text-decoration: underline;
                  font-weight: 700;
                }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
          </motion.article>

          {/* Comments Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }} className="p-8 md:p-12 my-16 rounded-xl bg-white border shadow ">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#294944]">Comments ({comments.length})</h2>
            </div>
            <div className="space-y-6 mb-12">
              {comments.map((c) => (
                <div key={c._id} className="bg-gradient-to-r from-white to-[#F7D270]/30 p-5 rounded-xl border border-[#E8F1EF]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[#294944] text-lg">{c.name}</div>
                      <div className="text-gray-700 mt-2 leading-relaxed">{c.content}</div>
                      <div className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Join the conversation</h3>
              <form onSubmit={addComment} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#294944] mb-2">Your Name</label>
                  <input className="w-full border-2 border-[#E8F1EF] px-4 py-3 rounded-xl" placeholder="Enter your name"
                    value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#294944] mb-2">Your Comment</label>
                  <textarea rows={5} className="w-full border-2 border-[#E8F1EF] px-4 py-3 rounded-xl" placeholder="Share your thoughts..."
                    value={content} onChange={e => setContent(e.target.value)} required />
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="bg-[#386861] text-[#F7D270] px-8 py-3 rounded-xl hover:bg-[#294944] font-medium shadow">
                  {isSubmitting ? (<>
                    <svg className="animate-spin h-5 w-5 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> Posting...</>) : (<>Post Comment</>)}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="p-8 md:p-12 my-16 relative overflow-hidden rounded-xl bg-white border shadow">
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#294944]">Stay Updated</h3>
              <p className="text-gray-600 mb-8 text-lg">Get the latest insights and updates delivered straight to your inbox.</p>
              <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input ref={inputRef} onChange={(e) => setEmail(e.target.value)} value={email}
                  type="email" name="email" placeholder='Enter your email address' required
                  className='flex-1 px-6 py-4 rounded-xl bg-white border border-gray-300 placeholder-gray-500 text-black outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300' />
                <button type="submit" disabled={isSubscribing}
                  className='bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap'>
                  {isSubscribing ? (<>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> Subscribing...</>) : (<>Subscribe</>)}
                </button>
              </form>
              {email &&
                <button onClick={onClear}
                  className='inline-flex items-center text-gray-600 hover:text-black transition-colors duration-200 mt-4 text-sm'>
                  Clear email
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>}
            </div>
          </motion.div>

          {/* Social Share Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }} className='p-8 my-16 text-center'>
            <div className="w-12 h-12 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className='text-2xl font-bold mb-4 text-[#294944]'>Share this article</h3>
            <p className='text-gray-600 mb-6'>Spread the knowledge with your network</p>
            <div className='flex justify-center gap-4 flex-wrap'>
              <button onClick={() => handleSocialShare('facebook')}
                className="group bg-[#386861] hover:bg-[#294944] text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" title="Share on Facebook">
                <FontAwesomeIcon icon={faFacebookF} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button onClick={() => handleSocialShare('twitter')}
                className="group bg-[#F7D270] hover:bg-[#eac25f] text-[#294944] p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" title="Share on Twitter">
                <FontAwesomeIcon icon={faTwitter} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button onClick={() => handleSocialShare('googleplus')}
                className="group bg-[#386861] hover:bg-[#294944] text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" title="Share on Google Plus">
                <FontAwesomeIcon icon={faGooglePlusG} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button onClick={() => handleSocialShare('linkedin')}
                className="group bg-[#F7D270] hover:bg-[#eac25f] text-[#294944] p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" title="Share on LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 &&
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }} className="my-24 bg-gradient-to-br from-white to-[#F7F7D0]/40 py-16 px-6 rounded-3xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-[#F7D270] px-6 py-3 rounded-full shadow-lg text-[#294944] font-bold mb-6">
                  <span>Related Articles</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#294944]">Continue Your Learning Journey</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Explore these handpicked articles that complement your current reading
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {relatedBlogs.map((blog, index) => (
                  <motion.article key={blog.slug}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 + (index * 0.1) }}
                    className="group cursor-pointer h-full" onClick={() => window.location.href = `/blogs/${blog.slug}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-gray-200 h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-sm text-[#294944] text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-sm">{blog.category}</span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="h-16 mb-3">
                          <h3 className="text-lg font-bold text-[#294944] leading-tight line-clamp-2 group-hover:text-[#386861] transition-colors duration-300">{blog.title}</h3>
                        </div>
                        <div className="h-12 mb-4 flex-1">
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {blog.description?.replace(/<[^>]+>/g, '').slice(0, 100)}...
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-6 h-6 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center text-white font-medium text-xs">
                              {blog.author?.charAt(0) || 'A'}
                            </div>
                            <span className="font-medium">
                              {new Date(blog.createdAt || blog.date).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-[#386861] group-hover:text-[#294944] transition-colors duration-300">
                            <span className="text-sm font-medium mr-1">Read</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          }
        </div>
      </div>
      <Footer />
    </>
  ) : data === null ? (<BlogNotFound />) : (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#294944] via-[#386861] to-[#294944]'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7D270] to-[#eac25f] rounded-full animate-ping opacity-20" />
          <div className="relative w-20 h-20 bg-gradient-to-r from-[#F7D270] to-[#eac25f] rounded-full flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-[#294944]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
        <h2 className='text-2xl font-semibold text-white mb-4'>Loading your content</h2>
        <p className='text-gray-200'>Please wait while we prepare your reading experience...</p>
      </div>
    </div>
  ));
};

export default BlogClient;
