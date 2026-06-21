'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import { Project } from '@/data/projects';
import Lightbox from '@/components/ui/Lightbox';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Projects({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const handleOpenLightbox = useCallback((project: Project, index: number) => {
    setSelectedProject(project);
    setInitialImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Helper to ensure coverImage is first in the list without duplicates
  const getProjectImages = useCallback((project: Project) => {
    const list: string[] = [];
    if (project.coverImage) {
      list.push(project.coverImage);
    }
    if (project.images) {
      project.images.forEach((img) => {
        const baseImg = img.split('?')[0];
        const baseCover = project.coverImage ? project.coverImage.split('?')[0] : '';
        if (baseImg !== baseCover) {
          list.push(img);
        }
      });
    }
    return list;
  }, []);

  // Derive unique categories from actual project data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map(p => p.category)));
    return cats.sort();
  }, [projects]);

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());
  }, [projects, activeFilter]);

  // Group filtered projects by category (for the grouped view)
  const groupedProjects = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    for (const p of filteredProjects) {
      const cat = p.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    }
    return groups;
  }, [filteredProjects]);

  const handleFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-cream">

        <PageHeader
          title="Projects"
          subtitle="A curated selection of completed work across typologies and scales."
        />

        {/* Category Filter Tabs */}
        <section className="pb-8">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
              {/* All Projects tab */}
              <button
                onClick={() => handleFilter('all')}
                className={`font-sans text-[11px] tracking-ultra-wide uppercase pb-2 border-b-2 transition-colors duration-300 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'text-charcoal border-warm-gold'
                    : 'text-stone border-transparent hover:text-charcoal'
                }`}
              >
                All Projects
                <span className="ml-2 text-stone/40 text-[9px]">
                  ({projects.length})
                </span>
              </button>

              {/* Dynamic category tabs */}
              {categories.map((cat) => {
                const count = projects.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleFilter(cat)}
                    className={`font-sans text-[11px] tracking-ultra-wide uppercase pb-2 border-b-2 transition-colors duration-300 cursor-pointer ${
                      activeFilter === cat
                        ? 'text-charcoal border-warm-gold'
                        : 'text-stone border-transparent hover:text-charcoal'
                    }`}
                  >
                    {cat}
                    <span className="ml-2 text-stone/40 text-[9px]">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Categorized Project Grid */}
        <section className="py-8 lg:py-12">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
            <AnimatePresence mode="wait">
              <m.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {Object.entries(groupedProjects).map(([category, categoryProjects], groupIndex) => (
                  <div key={category} className={groupIndex > 0 ? 'mt-16 lg:mt-20' : ''}>
                    {/* Category section header — only show when viewing "All" */}
                    {activeFilter === 'all' && (
                      <m.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="mb-8 lg:mb-10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-px bg-warm-gold" />
                          <h2 className="font-sans text-[11px] tracking-mega-wide uppercase text-warm-gold">
                            {category}
                          </h2>
                          <span className="font-sans text-[9px] tracking-ultra-wide text-stone/40">
                            {categoryProjects.length} {categoryProjects.length === 1 ? 'project' : 'projects'}
                          </span>
                        </div>
                        <div className="mt-4 h-px bg-gradient-to-r from-warm-beige/60 via-warm-beige/20 to-transparent" />
                      </m.div>
                    )}

                    {/* Project cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      {categoryProjects.map((project, i) => (
                        <ProjectCard
                          key={project.sanityId}
                          project={project}
                          index={i}
                          delayOffset={groupIndex * 0.1}
                          onCardClick={() => handleOpenLightbox(project, 0)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {filteredProjects.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="font-serif text-2xl text-stone/50">
                      No projects in this category yet.
                    </p>
                  </div>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </section>

        <div className="h-20" />
        <Footer />

        {/* Lightbox Gallery */}
        {selectedProject && (
          <Lightbox
            isOpen={lightboxOpen}
            onClose={handleCloseLightbox}
            images={getProjectImages(selectedProject)}
            initialIndex={initialImageIndex}
            title={selectedProject.title}
            category={selectedProject.category}
            year={selectedProject.year}
          />
        )}
      </div>
    </LazyMotion>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Individual Project Card
   ═══════════════════════════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
  delayOffset = 0,
  onCardClick,
}: {
  project: Project;
  index: number;
  delayOffset?: number;
  onCardClick: () => void;
}) {
  return (
    <m.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.8,
        delay: delayOffset + index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group cursor-pointer"
      onClick={onCardClick}
    >
      {/* Image */}
      <div className="overflow-hidden mb-5 relative aspect-[4/3] md:h-[440px] md:aspect-auto">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading={index === 0 ? 'eager' : 'lazy'}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={80}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-[background-color] duration-500" />
      </div>

      {/* Meta: Category + Year */}
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
      <div className="flex items-center justify-between mt-4">
        <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone">
          {project.location}
        </p>
        <p className="font-sans text-[9px] tracking-ultra-wide uppercase text-stone/40">
          {project.images.length} images
        </p>
      </div>
    </m.article>
  );
}
