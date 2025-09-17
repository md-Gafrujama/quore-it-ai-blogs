import BlogClient from './BlogClient';

// Generate metadata for each individual blog
export async function generateMetadata({ params }) {
  const slug = params.id;
  console.log('Generating metadata for slug:', slug);

  try {
    // Use API_BASE_URL for server (better than NEXT_PUBLIC_BASE_URL)
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    console.log('Using base URL:', baseUrl);

    const apiUrl = `${baseUrl}/api/blog/slug/${slug}`;
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
    if (!blog) {
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

    const cleanDescription =
      blog.description
        ?.replace(/<[^>]+>/g, '') // Remove HTML tags
        ?.replace(/\s+/g, ' ')
        ?.trim()
        ?.slice(0, 160) || 'Read this insightful article on AI Blog.';

    const blogUrl = `${baseUrl}/blogs/${blog.slug}`;
    const publishDate = blog.date || blog.createdAt;
    const modifiedDate = blog.updatedAt || publishDate;

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
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog - AI Blog',
      description:
        'Read insightful articles on technology, startups, and lifestyle.',
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
