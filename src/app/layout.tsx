import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'MAYOVA Architects — Created To Create',
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
    title: 'MAYOVA Architects — Created To Create',
    description:
      'Architecture, Interior, Landscaping & Product Designing — Created To Create.',
    type: 'website',
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
