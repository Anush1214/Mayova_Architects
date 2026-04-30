import type { Metadata } from 'next';
import Projects from './Projects';

export const metadata: Metadata = {
  title: 'Projects — MAYOVA Architects',
  description:
    'Explore the portfolio of MAYOVA Architects. Browse our work across architecture, interior design, urban planning, and landscape design.',
};

export default function ProjectsPage() {
  return <Projects />;
}
