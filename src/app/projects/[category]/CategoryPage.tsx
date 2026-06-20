'use client';

import { useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import Sidebar from '@/components/ui/Sidebar';
import { Project } from '@/data/projects';
import Lightbox from '@/components/ui/Lightbox';

const allCategories = [
  { key: 'interior', label: 'Interior' },
  { key: 'planning', label: 'Planning' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'landscape', label: 'Landscape' },
];

export default function CategoryPage({ 
  category, 
  initialProjects = [] 
}: { 
  category: string; 
  initialProjects?: Project[];
}) {
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

  const projects = useMemo(() => {
    return initialProjects.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }, [initialProjects, category]);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <PageHeader
        title={categoryTitle}
        subtitle={`Explore our ${categoryTitle.toLowerCase()} projects — spaces crafted with intention and precision.`}
      />

      {/* Category Tabs */}
      <section className="pb-8">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="flex items-center gap-8 flex-wrap">
            <Link
              href="/projects"
              className="font-sans text-[11px] tracking-ultra-wide uppercase pb-2 border-b-2 border-transparent text-stone hover:text-charcoal transition-all duration-300"
            >
              All
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.key}
                href={`/projects/${cat.key}`}
                className={`font-sans text-[11px] tracking-ultra-wide uppercase pb-2 border-b-2 transition-all duration-300 ${
                  cat.key === category
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

      {/* Scrolling Project Section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          {projects.length === 0 ? (
            <p className="font-sans text-sm text-stone text-center py-20">
              No projects in this category yet.
            </p>
          ) : (
            <div className="space-y-20 lg:space-y-28">
              {projects.map((project, i) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="group cursor-pointer"
                  onClick={() => handleOpenLightbox(project, 0)}
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center`}
                  >
                    {/* Image — takes up most of the width */}
                    <div
                      className={`${
                        i % 2 === 0
                          ? 'lg:col-span-8'
                          : 'lg:col-span-8 lg:order-2'
                      }`}
                    >
                      <div className="overflow-hidden cursor-pointer relative h-[300px] sm:h-[400px] lg:h-[500px]">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 90vw, 66vw"
                          quality={80}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div
                      className={`${
                        i % 2 === 0
                          ? 'lg:col-span-4'
                          : 'lg:col-span-4 lg:order-1'
                      } flex flex-col justify-center`}
                    >
                      <p className="font-sans text-[9px] tracking-ultra-wide uppercase text-warm-gold mb-4">
                        {project.category} &mdash; {project.year}
                      </p>
                      <h3 className="font-serif text-3xl text-charcoal mb-3 leading-tight">
                        {project.title}
                      </h3>
                      <p className="font-sans text-sm text-stone-dark leading-relaxed mb-6">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-px bg-warm-gold" />
                        <span className="font-sans text-[9px] tracking-ultra-wide uppercase text-stone">
                          {project.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
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
  );
}
