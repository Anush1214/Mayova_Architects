import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* ── Fonts: load only the weights actually used in the design ── */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400'],            // body=300, UI labels=400
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '600'],            // headings=400/600
  style: ['normal', 'italic'],
});

import Navbar from '@/components/ui/Navbar';
import CursorLoader from '@/components/ui/CursorLoader';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF7F2',
};

export const metadata: Metadata = {
  title: 'MAYOVA Architects',
  description:
    'MAYOVA Architects is a contemporary architecture studio based in Udupi, India. Architecture, Interior, Landscaping & Product Designing — Created To Create.',
  keywords: [
    'architecture',
    'architects',
    'interior design',
    'landscaping',
    'product designing',
    'Udupi',
    'MAYOVA',
    'MAYOVA Architects',
    'Vignesh V Rao',
    'architectural studio',
    'India',
  ],
  openGraph: {
    title: 'MAYOVA Architects',
    description:
      'Architecture, Interior, Landscaping & Product Designing — Created To Create.',
    type: 'website',
  },
  icons: {
    icon: '/images/logo/logo-full.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Sanity CDN for faster LCP */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="min-h-full grain-overlay font-sans">
        <CursorLoader />
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
