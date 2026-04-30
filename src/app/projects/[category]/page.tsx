import type { Metadata } from 'next';
import CategoryPage from './CategoryPage';
import { categoryProjects } from '@/data/siteData';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${title} — MAYOVA Architects`,
    description: `Explore MAYOVA Architects' ${title.toLowerCase()} projects. Browse our portfolio of ${title.toLowerCase()} design work.`,
  };
}

export function generateStaticParams() {
  return Object.keys(categoryProjects).map((category) => ({ category }));
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  return <CategoryPage category={category} />;
}
