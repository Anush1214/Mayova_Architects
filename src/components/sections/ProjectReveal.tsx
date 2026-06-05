'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

interface ProjectRevealProps {
  project: Project;
  index: number;
}

export default function ProjectReveal({ project, index }: ProjectRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isEven = index % 2 === 0;

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!section || !image || !content) return;

    // Image parallax and reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.8,
      },
    });

    // Image scale and parallax
    tl.fromTo(
      image,
      { y: 60, scale: 1.05 },
      { y: -60, scale: 1, ease: 'none', duration: 1 }
    );

    // Content fade and slide
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'top 30%',
        scrub: 0.5,
      },
    });

    contentTl.fromTo(
      content.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out', duration: 0.5 }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={`project-${project.id}`}
      className="project-section py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 w-full">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
            isEven ? '' : 'direction-rtl'
          }`}
        >
          {/* Image Side */}
          <div
            className={`${
              isEven ? 'lg:col-span-7' : 'lg:col-span-7 lg:order-2'
            }`}
          >
            <div className="project-image-wrapper overflow-hidden relative">
              <div ref={imageRef} className="relative">
                <m.div
                  initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
                  whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    width={1200}
                    height={800}
                    className="w-full h-[50vh] lg:h-[65vh] object-cover"
                    loading="lazy"
                    quality={85}
                  />
                </m.div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div
            ref={contentRef}
            className={`${
              isEven ? 'lg:col-span-5' : 'lg:col-span-5 lg:order-1'
            } flex flex-col justify-center`}
          >
            {/* Number */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-sans text-[10px] tracking-ultra-wide text-stone uppercase">
                0{index + 1}
              </span>
            </div>

            {/* Category + Year */}
            <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mb-4">
              {project.category} &mdash; {project.year}
            </p>

            {/* Title */}
            <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mb-2 leading-tight">
              {project.title}
            </h2>

            {/* Subtitle */}
            <p className="font-serif text-lg text-stone-dark italic mb-6">
              {project.subtitle}
            </p>

            {/* Description */}
            <p className="font-sans text-sm text-stone-dark leading-relaxed mb-8 max-w-md">
              {project.description}
            </p>

            {/* Location */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-warm-gold" />
              <span className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone">
                {project.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
