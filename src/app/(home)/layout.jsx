import { baseURL } from '@/config/api';

export const metadata = {
  title: 'Quore IT Blog – Technology Insights, Trends & Analysis',
  description: 'Stay updated with the latest in technology, recruitment, startups & industry trends. Quore IT shares expert perspectives and research-driven insights.',
  keywords: ['technology', 'startup', 'lifestyle', 'blog', 'articles', 'insights'],
  openGraph: {
    title: 'Quore IT Blog – Technology Insights, Trends & Analysis',
    description: 'Stay updated with the latest in technology, recruitment, startups & industry trends. Quore IT shares expert perspectives and research-driven insights.',
    type: 'website',
    url: baseURL,
    siteName: 'AI Blog',
    images: [
      {
        url: '/logo.png', // Add your logo path
        width: 1200,
        height: 630,
        alt: 'AI Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quore IT Blog – Technology Insights, Trends & Analysis',
    description: 'Discover the latest insights on technology, startups, and lifestyle.',
    images: ['/logo.png'], // Add your logo path
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