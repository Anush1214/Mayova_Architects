import { client, urlFor } from './client'

export interface Project {
  /** Sanity document _id — stable, unique, ideal for React keys */
  sanityId: string;
  /** Numeric ordering value (from orderRank). Used for display order only. */
  id: number;
  /** URL-safe slug derived from title — used for anchors & routes */
  slug: string;
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
  _id,
  "slug": slug.current,
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

/** Raw shape returned by the GROQ query before image URL transformation */
interface RawProject {
  _id: string;
  slug: string | null;
  id: number | null;
  letter: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  year: string | null;
  category: string | null;
  location: string | null;
  coverImage: { asset: { _ref: string } } | null;
  images: Array<{ asset: { _ref: string } }> | null;
}

/**
 * Fetch all projects from Sanity and transform the image references
 * into usable URLs that match the Project interface.
 *
 * Gracefully returns an empty array on network/CMS errors so the
 * UI can render an empty-state instead of crashing.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const raw: RawProject[] = await client.fetch(PROJECT_QUERY)

    return raw.map((p) => ({
      sanityId: p._id,
      id: p.id ?? 0,
      slug: p.slug ?? p.title?.toLowerCase().replace(/\s+/g, '-') ?? '',
      letter: p.letter ?? '',
      title: p.title ?? '',
      subtitle: p.subtitle ?? '',
      description: p.description ?? '',
      year: p.year ?? '',
      category: p.category ?? '',
      location: p.location ?? '',
      coverImage: p.coverImage
        ? urlFor(p.coverImage).auto('format').url()
        : '',
      images: Array.isArray(p.images)
        ? p.images.map((img) =>
            urlFor(img).auto('format').url()
          )
        : [],
    }))
  } catch (error) {
    console.error('[MAYOVA] Failed to fetch projects from Sanity:', error)
    return []
  }
}
