import { baseURL } from '@/config/api';

export const metadata = {
  title: ' Latest Technology & Startup Insights',
  description: 'Discover the latest insights on technology, startups, and lifestyle. Read expert articles and stay updated with trending topics.',
  keywords: ['technology', 'startup', 'lifestyle', 'blog', 'articles', 'insights'],
  openGraph: {
    title: ' Latest Technology & Startup Insights',
    description: 'Discover the latest insights on technology, startups, and lifestyle. Read expert articles and stay updated with trending topics.',
    type: 'website',
    url: baseURL,
    siteName: 'Latest Technology & Startup Insights',
    images: [
      {
        url: '/image.png', // Add your logo path
        width: 1200,
        height: 630,
        alt: 'AI Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ' Latest Technology & Startup Insights',
    description: 'Discover the latest insights on technology, startups, and lifestyle.',
    images: ['/image.png'], // Add your logo path
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
};

export default function HomeLayout({ children }) {
  return children;
} 