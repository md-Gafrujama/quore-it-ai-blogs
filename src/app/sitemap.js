export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-blogs-with-super-admin.vercel.app';
  
  try {
    // Fetch all published blogs
    const blogsResponse = await fetch(`${baseUrl}/api/blog/all`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    let blogs = [];
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      blogs = blogsData.blogs || [];
    }

    // Generate sitemap entries for blogs
    const blogEntries = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.date || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    return [...staticPages, ...blogEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with just static pages
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
} 