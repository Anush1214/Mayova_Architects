'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import Sidebar from '@/components/ui/Sidebar';
import { projects } from '@/data/projects';

const categoryLinks = [
  { label: 'All Projects', href: '/projects', active: true },
  { label: 'Interior', href: '/projects/interior' },
  { label: 'Architecture', href: '/projects/architecture' },
  { label: 'Planning', href: '/projects/planning' },
  { label: 'Landscape', href: '/projects/landscape' },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <PageHeader
        title="Projects"
        subtitle="A curated selection of work across scales, typologies, and geographies."
      />

      {/* Category Filter */}
      <section className="pb-8">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="flex items-center gap-8 flex-wrap">
            {categoryLinks.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`font-sans text-[11px] tracking-ultra-wide uppercase pb-2 border-b-2 transition-all duration-300 ${
                  cat.active
                    ? 'text-charcoal border-warm-gold'
                    : 'text-stone border-transparent hover:text-charcoal'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="overflow-hidden mb-5">
                  <Image
                    src={project.imagePath}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-[350px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-sans text-[9px] tracking-ultra-wide uppercase text-warm-gold">
                    {project.category}
                  </span>
                  <span className="text-stone/30">&middot;</span>
                  <span className="font-sans text-[9px] tracking-ultra-wide uppercase text-stone">
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-charcoal mb-1 group-hover:text-stone-dark transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Location */}
                <p className="font-sans text-xs text-stone">{project.location}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <div className="h-20" />
      <Footer />
    </div>
  );
}
