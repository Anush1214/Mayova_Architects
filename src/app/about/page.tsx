import type { Metadata } from 'next';
import About from './About';

export const metadata: Metadata = {
  title: 'About — MAYOVA Architects',
  description:
    'Learn about MAYOVA Architects, our founding partners, design philosophy, and approach to creating timeless architectural spaces.',
};

export default function AboutPage() {
  return <About />;
}
