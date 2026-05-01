import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['200', '300', '400', '500'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});
import Navbar from '@/components/ui/Navbar';
import CustomCursor from '@/components/ui/CustomCursor';

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
      <body className="min-h-full grain-overlay font-sans">
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
