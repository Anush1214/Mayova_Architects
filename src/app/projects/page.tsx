import type { Metadata } from 'next';
import Projects from './Projects';
import { getProjects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects — MAYOVA Architects',
  description:
    'Explore the portfolio of MAYOVA Architects. Browse our work across architecture, interior design, urban planning, and landscape design.',
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <Projects projects={projects} />;
}
