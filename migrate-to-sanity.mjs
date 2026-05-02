import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projects = [
  {
    id: 1,
    letter: 'M',
    title: 'Mayova Studio',
    subtitle: 'Created to Create',
    description:
      'The Mayova Architects studio — a workspace designed to inspire. Raw concrete floors, a live-edge conference table, biophilic details, and the brand\'s iconic "CREATE" etched on glass partition walls. Every surface is a statement of intent.',
    year: '2024',
    category: 'Interior',
    location: 'Surat, IN',
    coverImage: '/images/projects/mayova-1.jpg',
    images: [
      '/images/projects/mayova-1.jpg',
      '/images/projects/mayova-2.jpg',
      '/images/projects/mayova-3.jpg',
      '/images/projects/mayova-4.jpg',
      '/images/projects/mayova-5.jpg',
      '/images/projects/mayova-6.jpg',
      '/images/projects/mayova-7.jpg',
      '/images/projects/mayova-8.jpg',
      '/images/projects/mayova-9.jpg',
      '/images/projects/mayova-10.jpg',
    ],
  },
  {
    id: 2,
    letter: 'K',
    title: 'Krop AI Office',
    subtitle: 'Biophilic Tech Headquarters',
    description:
      'A biophilic tech office interior for Krop AI. Wave-form acoustic ceilings, a living moss-logo feature wall, and warm oak joinery ground a space that blends the organic with the precision of a design-forward startup.',
    year: '2023',
    category: 'Commercial',
    location: 'Surat, IN',
    coverImage: '/images/projects/kropi-5.jpg',
    images: [
      '/images/projects/kropi-1.jpg',
      '/images/projects/kropi-2.jpg',
      '/images/projects/kropi-3.jpg',
      '/images/projects/kropi-4.jpg',
      '/images/projects/kropi-5.jpg',
      '/images/projects/kropi-6.jpg',
      '/images/projects/kropi-7.jpg',
      '/images/projects/kropi-8.jpg',
      '/images/projects/kropi-9.jpg',
    ],
  },
  {
    id: 3,
    letter: 'C',
    title: 'Cave Salon',
    subtitle: 'A Dark Study in Luxury',
    description:
      'A premium barber salon conceived as a monochromatic cave. Arched mirror alcoves, circular pendant lights, and a sculptural reception desk carve a space that feels both editorial and deeply tactile.',
    year: '2024',
    category: 'Interior',
    location: 'Surat, IN',
    coverImage: '/images/projects/cave-3.jpg',
    images: [
      '/images/projects/cave-1.jpg',
      '/images/projects/cave-2.jpg',
      '/images/projects/cave-3.jpg',
      '/images/projects/cave-4.jpg',
      '/images/projects/cave-5.jpg',
      '/images/projects/cave-6.jpg',
      '/images/projects/cave-7.jpg',
    ],
  },
];

// Verify token is provided
if (!process.env.SANITY_API_TOKEN) {
  console.error("ERROR: You must provide a SANITY_API_TOKEN environment variable.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 't2v89pic',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-05-02',
  token: process.env.SANITY_API_TOKEN,
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadImage(imagePath, retries = 3) {
  // Remove leading slash so path.join doesn't treat it as absolute root
  const cleanPath = imagePath.replace(/^\//, '');
  const fullPath = path.join(__dirname, 'public', cleanPath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: Image not found locally: ${fullPath}`);
    return null;
  }
  
  const buffer = fs.readFileSync(fullPath);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Uploading ${path.basename(fullPath)}... (attempt ${attempt})`);
      const asset = await client.assets.upload('image', buffer, {
        filename: path.basename(fullPath),
      });
      
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    } catch (err) {
      console.warn(`Upload failed (attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt < retries) {
        const delay = attempt * 3000; // 3s, 6s, 9s
        console.log(`Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        console.error(`Failed to upload ${path.basename(fullPath)} after ${retries} attempts.`);
        return null;
      }
    }
  }
}

async function migrate() {
  console.log("Starting Migration to Sanity...");
  
  for (const p of projects) {
    console.log(`\n--- Migrating Project: ${p.title} ---`);
    
    // Upload Cover Image
    const coverImageAsset = await uploadImage(p.coverImage);
    
    // Upload Gallery Images
    const imagesAssets = [];
    for (const img of p.images) {
      const asset = await uploadImage(img);
      if (asset) {
        // Sanity array items require a _key
        asset._key = Math.random().toString(36).substring(7);
        imagesAssets.push(asset);
      }
    }

    const doc = {
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.title.toLowerCase().replace(/\s+/g, '-') },
      letter: p.letter,
      subtitle: p.subtitle,
      description: p.description,
      year: p.year,
      category: p.category,
      location: p.location,
      coverImage: coverImageAsset,
      images: imagesAssets,
      orderRank: p.id,
    };

    console.log(`Creating document in Sanity: ${p.title}...`);
    await client.create(doc);
    console.log(`Success: ${p.title} created!`);
  }
  
  console.log('\n✅ MIGRATION COMPLETE! All projects and images are now in Sanity.');
}

migrate().catch(console.error);
