

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
import { baseURL , company} from '@/config/api';

const BlogClient = ({ slug }) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Email subscription state variables
  const [email, setEmail] = useState('');
  const inputRef = useRef(null);
  // Related blogs state
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Generate structured data for SEO
  const generateStructuredData = (blog) => {
    if (!blog) return null;
    
    const blogUrl = `${baseURL}/blogs/${blog.slug}`;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
      "image": blog.image,
      "author": {
        "@type": "Person",
        "name": blog.author || "Admin"
      },
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
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": blogUrl
      },
      "url": blogUrl,
      "articleSection": blog.category,
      "keywords": [blog.category, "blog", "article", "technology", "startup", "lifestyle"],
      "wordCount": blog.description?.replace(/<[^>]+>/g, '').split(' ').length || 0,
      "commentCount": comments.length,
      "comment": comments.map(comment => ({
        "@type": "Comment",
        "author": {
          "@type": "Person",
          "name": comment.name
        },
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
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setData(null);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    if (!slug) return;
    try {
      const res = await axios.post(`${baseURL}/api/blog/comments`, { blogSlug: slug });
      if (res.data.success) setComments(res.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
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
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social share handler with enhanced metadata
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
    window.open(
      shareUrl,
      'share-dialog',
      'width=600,height=500,resizable=yes,scrollbars=yes'
    );
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
        email: trimmed,
        company: company
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
      console.error('Subscribe error:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const onClear = () => {
    setEmail('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlogData();
      fetchComments();
    }
  }, [slug]);

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
        } catch (err) {
          setRelatedBlogs([]);
        }
      };
      fetchRelated();
    }
  }, [data]);

  // Blog Not Found Component
  const BlogNotFound = () => (
    <>
      <div className='min-h-screen bg-gradient-to-br from-[#294944] via-[#386861] to-[#294944] flex items-center justify-center px-3 sm:px-6 md:px-12 lg:px-28 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-10 relative'>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl mx-auto w-full"
        >
          {/* 404 Icon */}
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

          {/* Error Message */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 xs:mb-3 sm:mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-[#F7D270] mb-3 xs:mb-4 sm:mb-6 px-3 xs:px-4"
          >
            Blog Not Found
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 mb-6 xs:mb-6 sm:mb-8 leading-relaxed px-3 xs:px-4 max-w-lg mx-auto"
          >
            The blog post you're looking for doesn't exist or has been moved. 
            <br className="hidden xs:block" />
            Let's get you back to discovering amazing content.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-3 xs:px-4"
          >
            <Link 
              href="/blogs"
              className="w-full xs:w-auto bg-[#F7D270] hover:bg-[#eac25f] text-[#294944] px-6 xs:px-8 py-3 xs:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm xs:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
              </svg>
              Browse All Blogs
            </Link>
            
            <Link 
              href="/"
              className="w-full xs:w-auto bg-transparent border-2 border-[#F7D270] text-[#F7D270] hover:bg-[#F7D270] hover:text-[#294944] px-6 xs:px-8 py-3 xs:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm xs:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 xs:mt-16 flex justify-center space-x-6 xs:space-x-8"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-3 h-3 xs:w-4 xs:h-4 bg-[#F7D270] rounded-full opacity-60"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );

  return (data ? (
    <>
      <NavbarNew/>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(data)) }}
        />
      </Head>
      
      {/* Hero Section with Green/Yellow theme to match navbar */}
      <div className='relative bg-gradient-to-br from-[#294944] via-[#386861] to-[#294944] py-20 px-5 md:px-12 lg:px-28 overflow-hidden'>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className='relative z-10'>
          <div className='text-center my-20 max-w-4xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='inline-block bg-[#F7D270]/20 backdrop-blur-sm border border-[#F7D270]/30 rounded-full px-4 py-2 mb-6'
            >
              <span className='text-[#F7D270] text-sm font-medium'>{data.category}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-4xl md:text-6xl font-bold max-w-[900px] mx-auto leading-tight text-white mb-8 tracking-tight'
            >
              {data.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='flex flex-col md:flex-row items-center justify-center gap-6 text-[#E5F2EF]'
            >
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
                <span className='text-lg'>
                  {new Date(data.createdAt || data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Blog Content Section */}
      <div className='relative -mt-20 z-20'>
        <div className='mx-5 max-w-4xl md:mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='relative'
          >
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
          
          {/* Premium Blog Content Format */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='mt-12'
          >
            <div 
              className='blog-content-wrapper max-w-none'
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                lineHeight: '1.8',
                color: '#1f2937',
                fontSize: '18px',
              }}
            >
              <style jsx>{`
                .blog-content-wrapper {
                  counter-reset: figure-counter;
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
                
                .blog-content-wrapper h1::after {
                  content: '';
                  position: absolute;
                  bottom: -10px;
                  left: 0;
                  width: 60px;
                  height: 4px;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  border-radius: 2px;
                }
                
                .blog-content-wrapper h2 {
                  font-size: 2.25rem;
                  font-weight: 700;
                  line-height: 1.2;
                  margin: 3rem 0 1.5rem 0;
                  color: #1e293b;
                  position: relative;
                  padding: 1.5rem 2rem;
                  background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
                  border-radius: 12px;
                  border-left: 5px solid #386861;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                
                .blog-content-wrapper h2::before {
                  content: '▍';
                  color: #386861;
                  font-size: 2rem;
                  position: absolute;
                  left: 0.5rem;
                  top: 50%;
                  transform: translateY(-50%);
                }
                
                .blog-content-wrapper h3 {
                  font-size: 1.75rem;
                  font-weight: 600;
                  line-height: 1.3;
                  margin: 2.5rem 0 1.25rem 0;
                  color: #334155;
                  position: relative;
                  padding-bottom: 0.5rem;
                  border-bottom: 2px solid #e2e8f0;
                }
                
                .blog-content-wrapper h3::after {
                  content: '';
                  position: absolute;
                  bottom: -2px;
                  left: 0;
                  width: 40px;
                  height: 2px;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                }
                
                .blog-content-wrapper h4 {
                  font-size: 1.375rem;
                  font-weight: 600;
                  line-height: 1.4;
                  margin: 2rem 0 1rem 0;
                  color: #475569;
                  position: relative;
                  padding-left: 1rem;
                }
                
                .blog-content-wrapper h4::before {
                  content: '◆';
                  color: #386861;
                  position: absolute;
                  left: 0;
                  font-size: 0.8em;
                }
                
                .blog-content-wrapper p {
                  margin: 1.75rem 0;
                  line-height: 1.8;
                  color: #374151;
                  font-size: 18px;
                  text-align: justify;
                  text-justify: inter-word;
                }
                
                .blog-content-wrapper strong, 
                .blog-content-wrapper b {
                  font-weight: 700;
                  color: #0f172a;
                  background: linear-gradient(120deg, #F7F7D0 0%, #F7D270 35%, #F7F7D0 100%);
                  background-size: 200% 100%;
                  background-position: 100% 0;
                  transition: background-position 0.3s ease;
                  padding: 2px 6px;
                  border-radius: 4px;
                  box-shadow: 0 2px 4px rgba(56, 104, 97, 0.15);
                }
                
                .blog-content-wrapper strong:hover,
                .blog-content-wrapper b:hover {
                  background-position: 0% 0;
                }
                
                .blog-content-wrapper em, 
                .blog-content-wrapper i {
                  font-style: italic;
                  color: #1e293b;
                  background: linear-gradient(120deg, #ddd6fe 0%, #8b5cf6 30%, #ddd6fe 100%);
                  background-size: 200% 100%;
                  background-position: 100% 0;
                  transition: background-position 0.3s ease;
                  padding: 2px 4px;
                  border-radius: 3px;
                }
                
                .blog-content-wrapper em:hover,
                .blog-content-wrapper i:hover {
                  background-position: 0% 0;
                }
                
                .blog-content-wrapper a {
                  color: #386861;
                  text-decoration: none;
                  font-weight: 600;
                  background: linear-gradient(120deg, transparent 0%, transparent 95%, #F7D270 95%);
                  background-size: 0% 100%;
                  background-repeat: no-repeat;
                  transition: all 0.4s ease;
                  border-radius: 2px;
                  padding: 2px 4px;
                  margin: 0 -2px;
                }
                
                .blog-content-wrapper a:hover {
                  background-size: 100% 100%;
                  color: #294944;
                  transform: translateY(-1px);
                  box-shadow: 0 4px 8px rgba(247, 210, 112, 0.4);
                }
                
                .blog-content-wrapper blockquote {
                  border: none;
                  padding: 2rem 2.5rem;
                  margin: 3rem 0;
                  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                  border-radius: 16px;
                  font-style: italic;
                  color: #334155;
                  position: relative;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                  border-left: 6px solid #386861;
                  font-size: 1.125rem;
                  line-height: 1.7;
                }
                
                .blog-content-wrapper blockquote::before {
                  content: '"';
                  font-size: 5rem;
                  color: #386861;
                  position: absolute;
                  top: -20px;
                  left: 30px;
                  font-family: serif;
                  opacity: 0.4;
                  font-weight: bold;
                }
                
                .blog-content-wrapper blockquote::after {
                  content: '"';
                  font-size: 3rem;
                  color: #386861;
                  position: absolute;
                  bottom: 10px;
                  right: 30px;
                  font-family: serif;
                  opacity: 0.4;
                  font-weight: bold;
                }
                
                .blog-content-wrapper ul, 
                .blog-content-wrapper ol {
                  margin: 2rem 0;
                  padding-left: 0;
                  list-style: none;
                }
                
                .blog-content-wrapper ul li {
                  margin: 1rem 0;
                  line-height: 1.7;
                  position: relative;
                  padding-left: 2rem;
                  background: linear-gradient(90deg, #f8fafc 0%, transparent 100%);
                  padding: 0.75rem 1rem 0.75rem 2.5rem;
                  border-radius: 8px;
                  border-left: 3px solid #e2e8f0;
                  transition: all 0.3s ease;
                }
                
                .blog-content-wrapper ul li:hover {
                  border-left-color: #386861;
                  background: linear-gradient(90deg, #f1f5f9 0%, transparent 100%);
                }
                
                .blog-content-wrapper ul li::before {
                  content: '●';
                  color: #386861;
                  font-size: 1.5rem;
                  position: absolute;
                  left: 1rem;
                  top: 0.5rem;
                }
                
                .blog-content-wrapper ol li {
                  margin: 1rem 0;
                  line-height: 1.7;
                  position: relative;
                  padding-left: 3rem;
                  counter-increment: item;
                  background: linear-gradient(90deg, #fef7ff 0%, transparent 100%);
                  padding: 0.75rem 1rem 0.75rem 3.5rem;
                  border-radius: 8px;
                  border-left: 3px solid #F7D270;
                }
                
                .blog-content-wrapper ol li::before {
                  content: counter(item);
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  color: white;
                  font-weight: bold;
                  font-size: 0.875rem;
                  position: absolute;
                  left: 1rem;
                  top: 0.75rem;
                  width: 1.75rem;
                  height: 1.75rem;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                
                .blog-content-wrapper img {
                  margin: 2rem auto;
                  border-radius: 16px;
                  width: 85%;
                  max-width: 900px;
                  max-height: 520px;
                  height: auto;
                  display: block;
                  object-fit: contain;
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  box-shadow: 
                    0 0 0 1px rgba(0, 0, 0, 0.05),
                    0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 20px 40px -7px rgba(0, 0, 0, 0.1);
                  position: relative;
                  filter: brightness(0.92) saturate(0.95);
                }

                @media (max-width: 768px) {
                  .blog-content-wrapper img {
                    width: 100%;
                    max-height: 360px;
                  }
                }
                
                .blog-content-wrapper img:hover {
                  transform: translateY(-8px) scale(1.02);
                  box-shadow: 
                    0 0 0 1px rgba(0, 0, 0, 0.05),
                    0 25px 50px -12px rgba(0, 0, 0, 0.25),
                    0 40px 60px -15px rgba(0, 0, 0, 0.3);
                }
                
                .blog-content-wrapper img::after {
                  content: '';
                  position: absolute;
                  inset: 0;
                  border-radius: 20px;
                  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%);
                  pointer-events: none;
                }
                
                .blog-content-wrapper code {
                  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                  color: #f1f5f9;
                  padding: 0.375rem 0.75rem;
                  border-radius: 6px;
                  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', monospace;
                  font-size: 0.875rem;
                  font-weight: 500;
                  border: 1px solid #475569;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .blog-content-wrapper pre {
                  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                  color: #f1f5f9;
                  padding: 2rem;
                  border-radius: 16px;
                  overflow-x: auto;
                  margin: 3rem 0;
                  box-shadow: 
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    0 20px 25px -5px rgba(0, 0, 0, 0.3);
                  position: relative;
                }
                
                .blog-content-wrapper pre::before {
                  content: '';
                  position: absolute;
                  top: 1rem;
                  left: 1rem;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: #ef4444;
                  box-shadow: 20px 0 0 #f59e0b, 40px 0 0 #22c55e;
                }
                
                .blog-content-wrapper pre code {
                  background: transparent;
                  padding: 0;
                  border-radius: 0;
                  border: none;
                  box-shadow: none;
                  color: inherit;
                }
                
                .blog-content-wrapper table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 3rem 0;
                  background: white;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                  border: 1px solid #e2e8f0;
                }
                
                .blog-content-wrapper th, 
                .blog-content-wrapper td {
                  padding: 1.25rem 1.5rem;
                  text-align: left;
                  border-bottom: 1px solid #f1f5f9;
                }
                
                .blog-content-wrapper th {
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  color: white;
                  font-weight: 600;
                  font-size: 0.95rem;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                }
                
                .blog-content-wrapper tr:nth-child(even) {
                  background: #f8fafc;
                }
                
                .blog-content-wrapper tr:hover {
                  background: #f1f5f9;
                  transform: scale(1.01);
                  transition: all 0.2s ease;
                }
                
                .blog-content-wrapper hr {
                  border: none;
                  height: 2px;
                  background: linear-gradient(90deg, transparent, #386861, #F7D270, transparent);
                  margin: 4rem 0;
                  border-radius: 1px;
                }
                
                .blog-content-wrapper mark {
                  background: linear-gradient(120deg, #fef3c7 0%, #f59e0b 50%, #fef3c7 100%);
                  background-size: 200% 100%;
                  background-position: 100% 0;
                  animation: highlight 2s ease-in-out infinite alternate;
                  padding: 3px 8px;
                  border-radius: 6px;
                  color: #92400e;
                  font-weight: 600;
                  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
                }
                
                @keyframes highlight {
                  to {
                    background-position: 0% 0;
                  }
                }
                
                .blog-content-wrapper p:first-of-type {
                  font-size: 20px;
                  color: #1f2937;
                  font-weight: 400;
                  line-height: 1.75;
                  margin-top: 3rem;
                  position: relative;
                }
                
                .blog-content-wrapper p:first-of-type::first-letter {
                  font-size: 5rem;
                  font-weight: 800;
                  line-height: 1;
                  color: transparent;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  float: left;
                  margin: 8px 12px 0 0;
                  font-family: serif;
                  text-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
                }
              `}</style>
              <div dangerouslySetInnerHTML={{__html: data.description}} />
            </div>
          </motion.article>

          {/* Comments Section with Enhanced Design */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="p-8 md:p-12 my-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Comments ({comments.length})</h2>
            </div>
            
            <div className="space-y-6 mb-12">
              {comments.map((c) => (
                <div key={c._id} className="bg-gradient-to-r from-white to-[#F7F7D0]/30 p-6 rounded-xl border border-[#E8F1EF] hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{c.name}</div>
                      <div className="text-gray-700 mt-2 leading-relaxed">{c.content}</div>
                      <div className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Comment Form */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Join the conversation</h3>
              <form onSubmit={addComment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#294944] mb-2">Your Name</label>
                  <input
                    className="w-full border-2 border-[#E8F1EF] px-4 py-3 rounded-xl focus:border-[#386861] focus:ring-4 focus:ring-[#386861]/15 transition-all duration-300 text-gray-900 placeholder-gray-400"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#294944] mb-2">Your Comment</label>
                  <textarea
                    rows={5}
                    className="w-full border-2 border-[#E8F1EF] px-4 py-3 rounded-xl focus:border-[#386861] focus:ring-4 focus:ring-[#386861]/15 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Share your thoughts..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#386861] text-[#F7D270] px-8 py-3 rounded-xl hover:bg-[#294944] transition-all duration-300 font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Post Comment
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Newsletter Subscription with Enhanced Design */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="p-8 md:p-12 my-16 relative overflow-hidden"
          >
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-black">Stay in the loop</h3>
              <p className="text-gray-600 mb-8 text-lg">Get the latest insights and updates delivered straight to your inbox.</p>
              
              <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  ref={inputRef}
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  type="email" 
                  name="email"
                  placeholder='Enter your email address' 
                  required 
                  className='flex-1 px-6 py-4 rounded-xl bg-white border border-gray-300 placeholder-gray-500 text-black outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300'
                />
                <button 
                  type="submit" 
                  disabled={isSubscribing}
                  className='bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap'
                >
                  {isSubscribing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
              
              {email && (
                <button 
                  onClick={onClear} 
                  className='inline-flex items-center text-gray-600 hover:text-black transition-colors duration-200 mt-4 text-sm'
                >
                  Clear email
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>

          {/* Enhanced Share Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className='p-8 my-16 text-center'
          >
            <div className="w-12 h-12 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className='text-2xl font-bold  mb-4'>Share this article</h3>
            <p className='text-600 mb-6'>Spread the knowledge with your network</p>
            
            <div className='flex justify-center gap-4 flex-wrap'>
              <button
                onClick={() => handleSocialShare('facebook')}
                className="group bg-[#386861] hover:bg-[#294944] text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                title="Share on Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>

              <button
                onClick={() => handleSocialShare('twitter')}
                className="group bg-[#F7D270] hover:bg-[#eac25f] text-[#294944] p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                title="Share on Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>

              <button
                onClick={() => handleSocialShare('googleplus')}
                className="group bg-[#386861] hover:bg-[#294944] text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                title="Share on Google Plus"
              >
                <FontAwesomeIcon icon={faGooglePlusG} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>

              <button
                onClick={() => handleSocialShare('linkedin')}
                className="group bg-[#F7D270] hover:bg-[#eac25f] text-[#294944] p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                title="Share on LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="text-xl group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>

          {/* Professional Related Blogs Section */}
          {relatedBlogs.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              // className="my-24 bg-gradient-to-br from-white to-[#F7F7D0]/40 py-16 px-6 rounded-3xl"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-[#E8F1EF] mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-medium">Related Articles</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#294944]">
                  Continue Your Learning Journey
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Explore these handpicked articles that complement your current reading
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {relatedBlogs.map((blog, index) => (
                  <motion.article
                    key={blog.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 + (index * 0.1) }}
                    className="group cursor-pointer h-full"
                    onClick={() => window.location.href = `/blogs/${blog.slug}`}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-gray-200 h-full flex flex-col">
                      {/* Fixed height image container */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-sm text-[#294944] text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-sm">
                            {blog.category}
                          </span>
                        </div>
                        
                        {/* Reading time */}
                        <div className="absolute bottom-3 right-3">
                          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>2 min</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Fixed height content container */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Title with fixed height */}
                        <div className="h-16 mb-3">
                          <h3 className="text-lg font-bold text-[#294944] leading-tight line-clamp-2 group-hover:text-[#386861] transition-colors duration-300">
                            {blog.title}
                          </h3>
                        </div>
                        
                        {/* Description with fixed height */}
                        <div className="h-12 mb-4 flex-1">
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {blog.description?.replace(/<[^>]+>/g, '').slice(0, 100)}...
                          </p>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-6 h-6 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center text-white font-medium text-xs">
                              {blog.author?.charAt(0) || 'A'}
                            </div>
                            <span className="font-medium">
                              {new Date(blog.createdAt || blog.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
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
              
              {/* View all button */}
              <div className="text-center mt-10">
                <Link 
                  href="/blogs" 
                  className="inline-flex items-center gap-2 text-gray-900 px-6 py-3 transition-all duration-300 font-medium"
                >
                  <span>View All Articles</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>
            </motion.section>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  ) : data === null ? (
    <BlogNotFound />
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#294944] via-[#386861] to-[#294944]'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7D270] to-[#eac25f] rounded-full animate-ping opacity-20"></div>
          <div className="relative w-20 h-20 bg-gradient-to-r from-[#F7D270] to-[#eac25f] rounded-full flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-[#294944]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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