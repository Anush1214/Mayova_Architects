export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imagePath: string;
  linkedin?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Ar. Vignesh V Rao',
    role: 'Principal Architect & Founder',
    bio: 'Driven by a passion for design that responds to people and place, Ar. Vignesh V Rao co-founded MAYOVA Architects with a vision to create meaningful and enduring spaces. His multidisciplinary approach spans architecture, interiors, landscaping, and product design, bringing a thoughtful perspective to every project.',
    imagePath: '/images/about/portraits.jpg',
    linkedin: 'https://www.linkedin.com/in/vignesh-rao-452115213/',
  },
  {
    id: 2,
    name: 'Ar. Akash N Shetty',
    role: 'Principal Architect & Founder',
    bio: 'Believing that great architecture emerges from a deep understanding of context and experience, Ar. Akash N Shetty co-founded MAYOVA Architects to craft spaces that are both purposeful and inspiring. His design philosophy is rooted in balancing creativity, functionality, and timeless aesthetics.',
    imagePath: '/images/about/portraits.jpg',
    linkedin: 'https://www.linkedin.com/in/ar-akash-n-shetty-76794b1a0/',
  },
];

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: 'news' | 'awards' | 'events';
  imagePath: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'MAYOVA Architects Studio Launch',
    excerpt: 'MAYOVA Architects officially opens its doors in Udupi, bringing contemporary architectural design to the coastal Karnataka region.',
    date: 'March 2025',
    category: 'news',
    imagePath: '/images/projects/project-1.png',
  },
  {
    id: 2,
    title: 'New Residential Project in Udupi',
    excerpt: 'We are excited to announce our latest residential project, a modern home that blends traditional and contemporary design elements.',
    date: 'February 2025',
    category: 'news',
    imagePath: '/images/projects/project-3.png',
  },
  {
    id: 3,
    title: 'Interior Design Exhibition',
    excerpt: 'Ar. Vignesh V Rao will be presenting MAYOVA\'s interior design philosophy at the upcoming architecture conference.',
    date: 'January 2025',
    category: 'events',
    imagePath: '/images/projects/project-5.png',
  },
  {
    id: 4,
    title: 'Landscape Design Project Featured',
    excerpt: 'Our latest landscaping project has been highlighted for its innovative use of native plants and sustainable design practices.',
    date: 'December 2024',
    category: 'news',
    imagePath: '/images/projects/project-4.png',
  },
  {
    id: 5,
    title: 'Product Design Collection Launch',
    excerpt: 'MAYOVA launches its first product design collection, featuring handcrafted furniture inspired by coastal Karnataka heritage.',
    date: 'November 2024',
    category: 'news',
    imagePath: '/images/projects/project-6.png',
  },
  {
    id: 6,
    title: 'Sustainable Architecture Workshop',
    excerpt: 'Join us for a hands-on workshop exploring sustainable building materials and techniques for the Indian climate.',
    date: 'October 2024',
    category: 'events',
    imagePath: '/images/projects/project-2.png',
  },
];

export interface CategoryProject {
  id: number;
  title: string;
  description: string;
  location: string;
  year: string;
  imagePath: string;
}

export const categoryProjects: Record<string, CategoryProject[]> = {
  interior: [
    {
      id: 1,
      title: 'Modern Living Space',
      description: 'A thoughtfully designed interior that balances functionality with aesthetic elegance, featuring natural materials and warm lighting.',
      location: 'Udupi',
      year: '2024',
      imagePath: '/images/projects/project-2.png',
    },
    {
      id: 2,
      title: 'Heritage Home Renovation',
      description: 'Transforming a traditional coastal Karnataka home into a modern living space while preserving its heritage character.',
      location: 'Manipal',
      year: '2023',
      imagePath: '/images/projects/project-4.png',
    },
  ],
  planning: [
    {
      id: 1,
      title: 'Urban Development Plan',
      description: 'A comprehensive master plan for a mixed-use development that integrates green spaces, pedestrian connectivity, and sustainable infrastructure.',
      location: 'Udupi',
      year: '2024',
      imagePath: '/images/projects/project-4.png',
    },
  ],
  landscape: [
    {
      id: 1,
      title: 'Coastal Garden Design',
      description: 'A xeric garden composed of native Western Ghats species, designed to thrive in the coastal Karnataka climate with minimal maintenance.',
      location: 'Udupi',
      year: '2024',
      imagePath: '/images/projects/project-3.png',
    },
  ],
  architecture: [
    {
      id: 1,
      title: 'Contemporary Residence',
      description: 'A modern residential design that responds to the tropical climate, featuring cross-ventilation, shaded courtyards, and locally sourced materials.',
      location: 'Udupi',
      year: '2024',
      imagePath: '/images/projects/project-1.png',
    },
    {
      id: 2,
      title: 'Community Center',
      description: 'A public community space designed to bring people together, featuring flexible open areas and sustainable construction methods.',
      location: 'Manipal',
      year: '2023',
      imagePath: '/images/projects/project-6.png',
    },
  ],
};

// Site-wide configuration
export const siteConfig = {
  name: 'MAYOVA',
  tagline: 'Created To Create',
  heroQuote: 'Created To Create',
  studio: {
    address: 'Gowri Arcade, 1st Floor',
    area: 'Shiribeedu, Udupi - 576101',
    state: 'Karnataka, India',
    phone: '+91 77958-90714',
    phone2: '+91 70269-10721',
  },
  contact: {
    email: 'vigneshvrao@mayovaarchitect.com',
    website: 'www.mayovaarchitect.com',
  },
  social: {
    instagram: 'https://www.instagram.com/mayova_architects',
  },
  categories: ['Interior', 'Landscape', 'Architecture', 'Product Designing'],
};
