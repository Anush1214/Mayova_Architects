import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full grain-overlay cursor-smooth">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
