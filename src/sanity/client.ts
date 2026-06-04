import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: 't2v89pic',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true, // Use CDN for fast reads
  stega: { enabled: false }, // Disable visual editing overhead in production
})

const builder = createImageUrlBuilder({ projectId: 't2v89pic', dataset: 'production' })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
