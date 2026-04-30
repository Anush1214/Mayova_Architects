import type { Metadata } from 'next';
import News from './News';

export const metadata: Metadata = {
  title: 'News — MAYOVA Architects',
  description:
    'Latest news, awards, and events from MAYOVA Architects. Stay updated on our projects, exhibitions, and industry recognition.',
};

export default function NewsPage() {
  return <News />;
}
