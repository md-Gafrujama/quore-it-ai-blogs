import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// Utility function to sanitize image URLs
const cleanImageUrl = (url) => {
  if (!url) return '';
  return url.replace(/^[\[\(\s]+|[\]\)\s]+$/g, '');
}

// Utility to strip HTML tags safely
const stripHtml = (html) => {
  if (!html) return '';
  if (typeof window !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return '';
}

const BlogItem = ({ title, description, category, image, slug }) => {
  const safeImage = cleanImageUrl(image);
  const placeholder = '/images/placeholder_blog.png';
  const imgSrc = safeImage || placeholder;

  const snippet = stripHtml(description).slice(0, 120) + (description.length > 120 ? '...' : '');

  return (
    <article
      className='max-w-[330px] sm:max-w-[300px] bg-white border border-black transition-all hover:shadow-[-7px_7px_0px_#000000] cursor-pointer rounded-md overflow-hidden'
      tabIndex={0}
      role="link"
      aria-label={`Read blog titled ${title}`}
      onClick={() => window.location.href = `/blogs/${slug}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') window.location.href = `/blogs/${slug}`;
      }}
    >
      <Image
        src={imgSrc}
        alt={title || 'Blog Image'}
        width={400}
        height={400}
        className='border-b border-black object-cover w-full h-[220px]'
        loading="lazy"
      />

      <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm rounded-sm'>{category}</p>

      <div className="p-5">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>
        <p className='mb-3 text-sm tracking-tight text-gray-700'>{snippet}</p>

        <Link href={`/blogs/${slug}`} className='inline-flex items-center py-2 font-semibold text-center text-blue-600 hover:underline' aria-label={`Read more about ${title}`}>
          Read more
          <Image src={assets.arrow} alt="" width={12} className="ml-2" />
        </Link>
      </div>
    </article>
  )
}

export default BlogItem;
