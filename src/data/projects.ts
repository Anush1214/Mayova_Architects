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

export const projects: Project[] = [
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
