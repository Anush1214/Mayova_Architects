export interface Project {
  id: number;
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  category: string;
  location: string;
  imagePath: string;
}

export const projects: Project[] = [
  {
    id: 1,
    letter: 'M',
    title: 'Casa Solene',
    subtitle: 'Carved Into Limestone',
    description:
      'A coastal residence carved into the limestone cliffs of Mallorca. Concrete planes, raw oak and a single 12-meter window framing the Mediterranean horizon.',
    year: '2024',
    category: 'Residential',
    location: 'Mallorca, ES',
    imagePath: '/images/projects/project-1.png',
  },
  {
    id: 2,
    letter: 'A',
    title: 'Atelier Norte',
    subtitle: 'The Intervention Disappears',
    description:
      'A 220m² apartment renovation in the Eixample. The intervention disappears: lime plaster, walnut, and a single travertine threshold marking the day from the night.',
    year: '2023',
    category: 'Interior',
    location: 'Barcelona, ES',
    imagePath: '/images/projects/project-2.png',
  },
  {
    id: 3,
    letter: 'Y',
    title: 'Jardín de Arena',
    subtitle: 'Choreographing Light',
    description:
      'A xeric garden of 4,000m² composed entirely of native Mediterranean species. Walls of rammed earth follow the slope, choreographing the daily passage of light.',
    year: '2024',
    category: 'Landscape',
    location: 'Barcelona, ES',
    imagePath: '/images/projects/project-3.png',
  },
  {
    id: 4,
    letter: 'O',
    title: 'Olea Tower',
    subtitle: 'Threaded by Olive Groves',
    description:
      'Mixed-use master plan for a former industrial parcel. A grid of nine pavilions in board-marked concrete, threaded by olive groves and shared courtyards.',
    year: '2023',
    category: 'Planning',
    location: 'Barcelona, ES',
    imagePath: '/images/projects/project-4.png',
  },
  {
    id: 5,
    letter: 'V',
    title: 'Villa Vesta',
    subtitle: 'Oriented to the Mountain',
    description:
      'A timber-framed retreat in the Pyrenees. Cross-laminated spruce, a corten chimney, and a deep porch oriented to the north face of the mountain.',
    year: '2022',
    category: 'Residential',
    location: 'Pyrenees, ES',
    imagePath: '/images/projects/project-5.png',
  },
  {
    id: 6,
    letter: 'A',
    title: 'Ágora Pool House',
    subtitle: 'Infinite Colonnade',
    description:
      'A pool house composed as a single, infinitely extending colonnade. Microcement, brushed brass, and a still pool that doubles the architecture upward.',
    year: '2024',
    category: 'Architecture',
    location: 'Barcelona, ES',
    imagePath: '/images/projects/project-6.png',
  },
];
