// This file now re-exports the Project type from Sanity queries.
// The static data has been migrated to Sanity CMS.
// To fetch projects, use getProjects() from '@/sanity/queries'.
export type { Project } from '@/sanity/queries';
export { getProjects } from '@/sanity/queries';
