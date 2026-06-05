import { client, urlFor } from './client'

export interface Project {
  id: number;
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  category: string;
  location: string;
  coverImage: string;
  images: string[];
}

const PROJECT_QUERY = `*[_type == "project"] | order(orderRank asc) {
  "id": orderRank,
  letter,
  title,
  subtitle,
  description,
  year,
  category,
  location,
  coverImage,
  images
}`

/**
 * Fetch all projects from Sanity and transform the image references
 * into usable URLs that match the existing Project interface.
 */
export async function getProjects(): Promise<Project[]> {
  const raw = await client.fetch(PROJECT_QUERY)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    id: p.id ?? 0,
    letter: p.letter ?? '',
    title: p.title ?? '',
    subtitle: p.subtitle ?? '',
    description: p.description ?? '',
    year: p.year ?? '',
    category: p.category ?? '',
    location: p.location ?? '',
    coverImage: p.coverImage
      ? urlFor(p.coverImage).width(1200).quality(70).auto('format').url()
      : '',
    images: Array.isArray(p.images)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? p.images.map((img: any) =>
          urlFor(img).width(1200).quality(65).auto('format').url()
        )
      : [],
  }))
}
