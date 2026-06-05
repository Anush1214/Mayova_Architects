import { getProjects } from '@/data/projects';
import HomeClient from './HomeClient';

export const revalidate = 3600; // Re-fetch from Sanity every hour (prevents cold-start TTFB spikes)

export default async function Home() {
  const projects = await getProjects();
  return <HomeClient projects={projects} />;
}
