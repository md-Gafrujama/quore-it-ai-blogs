import BlogClient from './BlogClient';

// Generate metadata for each individual blog
export async function generateMetadata({ params }) {
  console.log('Generating metadata for slug:', params.id);
  
  try {
    // Get base URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    console.log('Using base URL:', baseUrl);
    
    // Fetch blog data by slug using native fetch (server-side)
    const apiUrl = `${baseUrl}/api/blog/slug/${params.id}`;
    console.log('Fetching from:', apiUrl);
    
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      console.error('API response not ok:', res.status, res.statusText);
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('API response data:', data);
    
    const blog = data.blog;

    if (!blog) {
      console.log('No blog found for slug:', params.id);
      return {
        title: 'Blog Not Found - AI Blog',
        description: 'This blog post does not exist or has been removed.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    console.log('Generating metadata for blog:', blog.title);
    
    // Clean description for better SEO
    const cleanDescription = blog.description
      ?.replace(/<[^>]+>/g, '') // Remove HTML tags
      ?.replace(/\s+/g, ' ') // Replace multiple spaces with single space
      ?.trim()
      ?.slice(0, 160) || 'Read this insightful article on AI Blog.';
    
    const blogUrl = `${baseUrl}/blogs/${blog.slug}`;
    const publishDate = blog.date || blog.createdAt;
    const modifiedDate = blog.updatedAt || publishDate;
    
    const metadata = {
      title: `${blog.title} - AI Blog`,
      description: cleanDescription,
      keywords: [
        blog.category?.toLowerCase(),
        'blog',
        'article',
        'technology',
        'startup',
        'lifestyle',
        blog.author?.toLowerCase(),
        ...(blog.title?.toLowerCase().split(' ').slice(0, 5) || [])
      ].filter(Boolean),
      authors: [{ name: blog.author || 'Admin' }],
      creator: blog.author || 'Admin',
      publisher: 'AI Blog',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: blogUrl,
      },
      openGraph: {
        title: blog.title,
        description: cleanDescription,
        url: blogUrl,
        siteName: 'AI Blog',
        images: [
          {
            url: blog.image,
            width: 1200,
            height: 630,
            alt: blog.title,
            type: 'image/jpeg',
          },
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: publishDate,
        modifiedTime: modifiedDate,
        authors: [blog.author || 'Admin'],
        section: blog.category,
        tags: [blog.category, 'blog', 'article'],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: cleanDescription,
        images: [blog.image],
        creator: '@yourhandle', // Replace with your Twitter handle
        site: '@yourhandle', // Replace with your Twitter handle
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: {
        google: 'your-google-verification-code', // Add your Google verification code
        yandex: 'your-yandex-verification-code', // Add if needed
        yahoo: 'your-yahoo-verification-code', // Add if needed
      },
      other: {
        'article:published_time': publishDate,
        'article:modified_time': modifiedDate,
        'article:author': blog.author || 'Admin',
        'article:section': blog.category,
        'article:tag': blog.category,
      },
    };
    
    console.log('Generated metadata:', metadata);
    return metadata;
    
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog - AI Blog',
      description: 'Read insightful articles on technology, startups, and lifestyle.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function Page({ params }) {
  // Pass slug to BlogClient for client-side logic
  return <BlogClient slug={params.id} />;
}



