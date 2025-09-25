import BlogClient from './BlogClient';

// Generate metadata for each individual blog
export async function generateMetadata({ params }) {
  const slug = params.id;
  console.log('Generating metadata for slug:', slug);

  try {
    // Use the correct base URL for production
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quore-it-ai-blogs.vercel.app';
    console.log('Using base URL:', baseUrl);

    // Try the external API first since we don't have local API routes
    const apiUrl = `https://ai-blogs-with-super-admin.vercel.app/api/blog/slug/${slug}`;
    console.log('Fetching from:', apiUrl);

    const res = await fetch(apiUrl, {
      cache: 'no-store', // or revalidate: 3600 if you want caching
    });

    if (!res.ok) {
      console.error('API response not ok:', res.status, res.statusText);
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }

    const data = await res.json();
    console.log('API response data:', data);

    const blog = data.blog;
    if (!blog || (blog.company && blog.company !== 'quoreit')) {
      console.log('No blog found for slug:', slug);
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

    // Ensure description is at least 100 characters for LinkedIn
    let cleanDescription = blog.description
      ?.replace(/<[^>]+>/g, '') // Remove HTML tags
      ?.replace(/\s+/g, ' ')
      ?.trim() || '';
    
    // If description is too short, create a longer one
    if (cleanDescription.length < 100) {
      cleanDescription = `${blog.title} - Discover insightful content about ${blog.category?.toLowerCase() || 'technology'} and more. Read this comprehensive article that explores key concepts, practical insights, and expert perspectives to enhance your understanding.`;
    }
    
    // Limit to 160 characters for optimal SEO
    cleanDescription = cleanDescription.slice(0, 160);

    const blogUrl = `${baseUrl}/blogs/${blog.slug}`;
    const publishDate = blog.date || blog.createdAt;
    const modifiedDate = blog.updatedAt || publishDate;

    // Ensure image URL is absolute for proper LinkedIn sharing
    const imageUrl = blog.image?.startsWith('http') ? blog.image : `${baseUrl}${blog.image}`;

    console.log('Generated metadata for blog:', {
      title: blog.title,
      imageUrl,
      blogUrl,
      description: cleanDescription
    });

    return {
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
      ].filter(Boolean),
      authors: [{ name: blog.author || 'Admin' }],
      creator: blog.author || 'Admin',
      publisher: 'AI Blog',
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
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
            type: 'image/jpeg',
          },
          {
            url: imageUrl,
            width: 1920,
            height: 1080,
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
        images: [imageUrl],
        creator: '@yourhandle',
        site: '@yourhandle',
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
      other: {
        'article:published_time': publishDate,
        'article:modified_time': modifiedDate,
        'article:author': blog.author || 'Admin',
        'article:section': blog.category,
        'article:tag': blog.category,
        // Explicit og tags for better LinkedIn compatibility
        'og:image': imageUrl,
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:alt': blog.title,
        'og:image:type': 'image/jpeg',
        'og:image:secure_url': imageUrl,
        // Additional LinkedIn specific tags
        'og:title': blog.title,
        'og:description': cleanDescription,
        'og:url': blogUrl,
        'og:type': 'article',
        'og:site_name': 'AI Blog',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog - AI Blog',
      description:
        'Read insightful articles on technology, startups, and lifestyle. Discover comprehensive content that explores innovative ideas, practical solutions, and expert perspectives to enhance your knowledge and understanding.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function Page({ params }) {
  return <BlogClient slug={params.id} />;
}
