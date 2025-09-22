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
import { faFacebookF, faTwitter, faGooglePlusG, faLinkedinIn, faShare } from '@fortawesome/free-brands-svg-icons';
import { baseURL, company } from '@/config/api';

const ProfessionalBlogClient = ({ slug }) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const inputRef = useRef(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // SEO Metadata generation
  const generateStructuredData = (blog) => {
    if (!blog) return null;
    
    const blogUrl = `${baseURL}/blogs/${blog.slug}`;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
      "image": {
        "@type": "ImageObject",
        "url": blog.image,
        "width": 1200,
        "height": 675,
        "aspectRatio": "16:9"
      },
      "author": {
        "@type": "Person",
        "name": blog.author || "Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": company || "Professional Blog",
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
      "keywords": [blog.category, "blog", "article", "professional", "insights"],
      "wordCount": blog.description?.replace(/<[^>]+>/g, '').split(' ').length || 0,
      "commentCount": comments.length,
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ReadAction",
        "userInteractionCount": viewCount
      }
    };
  };

  // Fetch blog data with error handling
  const fetchBlogData = async () => {
    if (!slug) return;
    try {
      const response = await axios.get(`${baseURL}/api/blog/slug/${slug}`);
      if (response.data.success && response.data.blog && response.data.blog.company === company) {
        setData(response.data.blog);
        setViewCount(response.data.blog.views || 0);
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

  // Add comment with validation
  const addComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${baseURL}/api/blog/add-comment`, {
        blog: data._id,
        name: name.trim(),
        content: content.trim(),
      });
      if (res.data.success) {
        setName('');
        setContent('');
        fetchComments();
        toast.success('Comment posted successfully!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced social share with tracking
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
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}&hashtags=blog,professional`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
        break;
      case 'googleplus':
        shareUrl = `https://plus.google.com/share?url=${url}`;
        break;
      default:
        return;
    }
    
    // Track share event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: platform,
        content_type: 'article',
        content_id: slug
      });
    }
    
    window.open(shareUrl, 'share-dialog', 'width=600,height=500,resizable=yes,scrollbars=yes');
  };

  // Newsletter subscription with validation
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const trimmedEmail = (email || '').trim();

    if (!trimmedEmail) {
      toast.error('Please enter a valid email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email format');
      return;
    }

    setIsSubscribing(true);

    try {
      const { data } = await axios.post(`${baseURL}/api/blog/subscribe`, {
        email: trimmedEmail,
        company: company,
        source: 'blog_post',
        referrer: slug
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (data?.success) {
        toast.success(data.msg || 'Successfully subscribed to our newsletter!');
        setEmail('');
        if (inputRef.current) inputRef.current.value = '';
        
        // Track subscription event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'subscribe', {
            method: 'email',
            content_type: 'newsletter'
          });
        }
      } else {
        toast.error(data?.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      toast.error(apiMessage || 'An error occurred. Please try again later.');
      console.error('Subscribe error:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Bookmark functionality
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
    const isCurrentlyBookmarked = bookmarks.includes(slug);
    
    if (isCurrentlyBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark !== slug);
      localStorage.setItem('blogBookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast.success('Bookmark removed');
    } else {
      bookmarks.push(slug);
      localStorage.setItem('blogBookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast.success('Bookmarked for later reading');
    }
  };

  // Reading progress indicator
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchBlogData();
      fetchComments();
      
      // Check bookmark status
      const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(slug));
    }
  }, [slug]);

  // Fetch related blogs
  useEffect(() => {
    if (data && data.category) {
      const fetchRelated = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/blog/all`);
          if (response.data.success) {
            const related = response.data.blogs.filter(
              (b) => b.category === data.category && 
                     b.slug !== data.slug && 
                     b.isPublished !== false && 
                     b.company === company
            ).slice(0, 3);
            setRelatedBlogs(related);
          }
        } catch (err) {
          console.error('Error fetching related blogs:', err);
          setRelatedBlogs([]);
        }
      };
      fetchRelated();
    }
  }, [data]);

  // Blog Not Found Component
  const BlogNotFound = () => (
    <>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>

          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-blue-300 mb-6">Article Not Found</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            The article you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/blogs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse Articles
            </Link>
            <Link 
              href="/"
              className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );

  // Loading Component
  const LoadingComponent = () => (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Loading Article</h2>
        <p className='text-gray-600'>Preparing your professional reading experience...</p>
      </div>
    </div>
  );

  // Main render
  return (data ? (
    <>
      <NavbarNew />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Head>
        <title>{data.title} | Professional Blog</title>
        <meta name="description" content={data.description?.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta name="keywords" content={`${data.category}, blog, article, professional, insights`} />
        <meta name="author" content={data.author || 'Admin'} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description?.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta property="og:image" content={data.image} />
        <meta property="og:url" content={`${baseURL}/blogs/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Professional Blog" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.description?.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta name="twitter:image" content={data.image} />
        
        {/* Article Meta Tags */}
        <meta property="article:published_time" content={data.createdAt || data.date} />
        <meta property="article:modified_time" content={data.updatedAt || data.date || data.createdAt} />
        <meta property="article:author" content={data.author || 'Admin'} />
        <meta property="article:section" content={data.category} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(data)) }}
        />
      </Head>
      
      {/* Hero Section with Enhanced Design */}
      <section className='relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-5 md:px-12 lg:px-28 overflow-hidden'>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>
        
        <div className='relative z-10 max-w-5xl mx-auto'>
          <div className='text-center'>
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='inline-block bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-2 mb-8'
            >
              <span className='text-blue-300 text-sm font-medium uppercase tracking-wider'>{data.category}</span>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto leading-tight text-white mb-8 tracking-tight'
            >
              {data.title}
            </motion.h1>
            
            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='flex flex-wrap items-center justify-center gap-8 text-gray-300 mb-12'
            >
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold'>
                  {data.author?.charAt(0) || 'A'}
                </div>
                <div className='text-left'>
                  <div className='font-semibold text-white'>By {data.author}</div>
                  <div className='text-sm text-gray-400'>Author</div>
                </div>
              </div>
              
              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(data.createdAt || data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{viewCount || 0} views</span>
              </div>

              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7m5 4h.01M12 16h.01" />
                </svg>
                <span>{Math.ceil((data.description?.replace(/<[^>]+>/g, '').length || 0) / 200)} min read</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='flex flex-wrap items-center justify-center gap-4'
            >
              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isBookmarked 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Image Section with 16:9 Aspect Ratio */}
      <section className='relative -mt-20 z-20 px-5 md:px-12 lg:px-28'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className='max-w-6xl mx-auto'
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white p-2">
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <Image 
                className='rounded-2xl w-full h-full object-cover' 
                src={data.image} 
                width={1920} 
                height={1080} 
                alt={data.title}
                priority
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Article Content Section */}
      <section className='py-20 px-5 md:px-12 lg:px-28'>
        <div className='max-w-4xl mx-auto'>
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className='prose prose-lg prose-blue max-w-none'
          >
            <style jsx>{`
              .prose {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.8;
                color: #1f2937;
                font-size: 18px;
              }
              
              .prose h1 {
                font-size: 2.75rem;
                font-weight: 800;
                line-height: 1.1;
                margin: 3rem 0 2rem 0;
                color: #0f172a;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              
              .prose h2 {
                font-size: 2.25rem;
                font-weight: 700;
                line-height: 1.2;
                margin: 3rem 0 1.5rem 0;
                color: #1e293b;
                padding: 1.5rem 2rem;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-radius: 12px;
                border-left: 5px solid #3b82f6;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              
              .prose h3 {
                font-size: 1.75rem;
                font-weight: 600;
                line-height: 1.3;
                margin: 2.5rem 0 1.25rem 0;
                color: #334155;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 0.5rem;
              }
              
              .prose h3::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 40px;
                height: 2px;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              }
              
              .prose p {
                margin: 1.75rem 0;
                line-height: 1.8;
                color: #374151;
                font-size: 18px;
                text-align: justify;
              }
              
              .prose strong, .prose b {
                font-weight: 700;
                color: #0f172a;
                background: linear-gradient(120deg, #dbeafe 0%, #3b82f6 35%, #dbeafe 100%);
                background-size: 200% 100%;
                background-position: 100% 0;
                transition: background-position 0.3s ease;
                padding: 2px 6px;
                border-radius: 4px;
              }
              
              .prose strong:hover, .prose b:hover {
                background-position: 0% 0;
              }
              
              .prose a {
                color: #3b82f6;
                text-decoration: none;
                font-weight: 600;
                background: linear-gradient(120deg, transparent 0%, transparent 95%, #bfdbfe 95%);
                background-size: 0% 100%;
                background-repeat: no-repeat;
                transition: all 0.4s ease;
                border-radius: 2px;
                padding: 2px 4px;
                margin: 0 -2px;
              }
              
              .prose a:hover {
                background-size: 100% 100%;
                color: #1e40af;
                transform: translateY(-1px);
              }
              
              .prose blockquote {
                border: none;
                padding: 2rem 2.5rem;
                margin: 3rem 0;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 16px;
                font-style: italic;
                color: #334155;
                position: relative;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                border-left: 6px solid #3b82f6;
                font-size: 1.125rem;
                line-height: 1.7;
              }
              
              .prose ul li {
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
              
              .prose ul li:hover {
                border-left-color: #3b82f6;
                background: linear-gradient(90deg, #f1f5f9 0%, transparent 100%);
              }
              
              .prose ul li::before {
                content: '●';
                color: #3b82f6;
                font-size: 1.5rem;
                position: absolute;
                left: 1rem;
                top: 0.5rem;
              }
              
              .prose img {
                margin: 3rem auto;
                border-radius: 16px;
                width: 100%;
                max-width: 900px;
                height: auto;
                display: block;
                object-fit: cover;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                aspect-ratio: 16/9;
              }
              
              .prose img:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              }
              
              .prose code {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                color: #f1f5f9;
                padding: 0.375rem 0.75rem;
                border-radius: 6px;
                font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
                font-size: 0.875rem;
                font-weight: 500;
              }
              
              .prose pre {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #f1f5f9;
                padding: 2rem;
                border-radius: 16px;
                overflow-x: auto;
                margin: 3rem 0;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
              }
              
              .prose table {
                width: 100%;
                border-collapse: collapse;
                margin: 3rem 0;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              }
              
              .prose th, .prose td {
                padding: 1.25rem 1.5rem;
                text-align: left;
                border-bottom: 1px solid #f1f5f9;
              }
              
              .prose th {
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                font-weight: 600;
                font-size: 0.95rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
              
              .prose tr:nth-child(even) {
                background: #f8fafc;
              }
              
              .prose tr:hover {
                background: #f1f5f9;
              }
              
              .prose hr {
                border: none;
                height: 2px;
                background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
                margin: 4rem 0;
                border-radius: 1px;
              }

              @media (max-width: 768px) {
                .prose {
                  font-size: 16px;
                }
                .prose h1 {
                  font-size: 2rem;
                }
                .prose h2 {
                  font-size: 1.75rem;
                  padding: 1rem 1.5rem;
                }
                .prose h3 {
                  font-size: 1.5rem;
                }
              }
            `}</style>
            
            <div dangerouslySetInnerHTML={{ __html: data.description }} />
          </motion.article>

          {/* Article Footer Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {data.author?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Written by {data.author}</h3>
                  <p className="text-gray-600">Professional content creator and industry expert</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleBookmark}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Comments Section */}
      <section className="py-20 px-5 md:px-12 lg:px-28 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Discussion ({comments.length})</h2>
            </div>
            
            {/* Comments List */}
            <div className="space-y-8 mb-16">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">{comment.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No comments yet</h3>
                  <p className="text-gray-600">Be the first to share your thoughts on this article.</p>
                </div>
              )}
            </div>
            
            {/* Comment Form */}
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">Join the Conversation</h3>
              <form onSubmit={addComment} className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Name</label>
                  <input
                    className="w-full border-2 border-gray-200 px-6 py-4 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-300 text-gray-900 placeholder-gray-400 text-lg"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Comment</label>
                  <textarea
                    rows={6}
                    className="w-full border-2 border-gray-200 px-6 py-4 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none text-lg leading-relaxed"
                    placeholder="Share your thoughts, questions, or insights..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !content.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 text-lg shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Publish Comment
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-20 px-5 md:px-12 lg:px-28 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Stay Informed</h2>
          <p className="text-xl text-blue-200 mb-12 leading-relaxed max-w-2xl mx-auto">
            Get the latest professional insights, industry trends, and expert analysis delivered directly to your inbox.
          </p>
          
          <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <input 
              ref={inputRef}
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              name="email"
              placeholder='Enter your professional email address' 
              required 
              className='flex-1 px-8 py-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 placeholder-blue-200 text-white outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-300 text-lg'
            />
            <button 
              type="submit" 
              disabled={isSubscribing}
              className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap text-lg shadow-lg hover:shadow-xl'
            >
              {isSubscribing ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-8 text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No spam, ever
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              100% Secure
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Unsubscribe anytime
            </div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Social Share Section */}
      <section className="py-20 px-5 md:px-12 lg:px-28">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Share This Article</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Help others discover valuable insights by sharing this article with your professional network.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { platform: 'facebook', icon: faFacebookF, color: 'bg-[#1877F2] hover:bg-[#166FE5]', name: 'Facebook' },
              { platform: 'twitter', icon: faTwitter, color: 'bg-[#1DA1F2] hover:bg-[#1A91DA]', name: 'Twitter' },
              { platform: 'linkedin', icon: faLinkedinIn, color: 'bg-[#0A66C2] hover:bg-[#004182]', name: 'LinkedIn' },
              { platform: 'googleplus', icon: faGooglePlusG, color: 'bg-[#DD4B39] hover:bg-[#C23321]', name: 'Google+' }
            ].map(({ platform, icon, color, name }) => (
              <button
                key={platform}
                onClick={() => handleSocialShare(platform)}
                className={`group ${color} text-white p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex flex-col items-center gap-3 min-w-[120px]`}
                title={`Share on ${name}`}
              >
                <FontAwesomeIcon 
                  icon={icon} 
                  className="text-2xl group-hover:scale-110 transition-transform duration-300" 
                />
                <span className="text-sm font-semibold">{name}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 mb-4">Or copy the link to share:</p>
            <div className="flex items-center gap-4 max-w-md mx-auto">
              <input 
                type="text" 
                value={`${baseURL}/blogs/${slug}`} 
                readOnly 
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${baseURL}/blogs/${slug}`);
                  toast.success('Link copied to clipboard!');
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Related Articles Section */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 px-5 md:px-12 lg:px-28 bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-lg border border-gray-100 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-gray-600 font-semibold">Related Reading</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Continue Your Professional Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore these carefully curated articles that complement your current reading and deepen your expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((blog, index) => (
                <motion.article
                  key={blog.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.2 + (index * 0.1) }}
                  className="group cursor-pointer h-full"
                  onClick={() => window.location.href = `/blogs/${blog.slug}`}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:border-gray-200 h-full flex flex-col group-hover:-translate-y-2">
                    {/* Image with 16:9 aspect ratio */}
                    <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                          {blog.category}
                        </span>
                      </div>
                      
                      {/* Reading time */}
                      <div className="absolute bottom-4 right-4">
                        <div className="flex items-center gap-2 bg-black/75 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{Math.ceil((blog.description?.replace(/<[^>]+>/g, '').length || 0) / 200)} min</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3 flex-1">
                        {blog.description?.replace(/<[^>]+>/g, '').slice(0, 150)}...
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {blog.author?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{blog.author || 'Admin'}</div>
                            <div className="text-gray-500 text-sm">
                              {new Date(blog.createdAt || blog.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                          <span className="text-sm font-semibold mr-2">Read Article</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="text-center mt-16">
              <Link 
                href="/blogs" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl text-lg"
              >
                <span>Explore All Articles</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </section>
      )}
      
      <Footer />
    </>
  ) : data === null ? (
    <BlogNotFound />
  ) : (
    <LoadingComponent />
  ));
};

export default ProfessionalBlogClient;
