import { getProjects } from '@/data/projects';
import HomeClient from './HomeClient';

export const revalidate = 60; // Re-fetch from Sanity every 60 seconds

export default async function Home() {
  const projects = await getProjects();
  return <HomeClient projects={projects} />;
}
