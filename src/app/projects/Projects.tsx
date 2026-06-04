'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import Sidebar from '@/components/ui/Sidebar';
import { Project } from '@/data/projects';

const categories = ['All Projects', 'Interior', 'Commercial'];

export default function Projects({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('All Projects');

  const filteredProjects = activeCategory === 'All Projects'
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <PageHeader
        title="Projects"
        subtitle="A curated selection of completed work across typologies and scales."
      />

      {/* Category Filter */}
      <section className="pb-8">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="flex items-center gap-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-[11px] tracking-ultra-wide uppercase pb-2 border-b-2 transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'text-charcoal border-warm-gold'
                    : 'text-stone border-transparent hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="group cursor-pointer"
                >
                  <div className="overflow-hidden mb-5 relative aspect-[4/3] md:h-[440px] md:aspect-auto">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 100vw, 50vw"
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

                  {/* Title + subtitle */}
                  <h3 className="font-serif text-2xl text-charcoal mb-1 group-hover:text-stone-dark transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone/60 mb-3">
                    {project.subtitle}
                  </p>

                  {/* Description preview */}
                  <p className="font-sans text-xs text-stone leading-relaxed max-w-md line-clamp-2">
                    {project.description}
                  </p>

                  {/* Location */}
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-4">
                    {project.location}
                  </p>

                  {/* Image count badge */}
                  <p className="font-sans text-[9px] tracking-ultra-wide uppercase text-stone/40 mt-1">
                    {project.images.length} images
                  </p>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <div className="h-20" />
      <Footer />
    </div>
  );
}
