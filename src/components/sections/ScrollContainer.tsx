'use client';

import { forwardRef, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

const ScrollContainer = forwardRef<HTMLDivElement>((_, ref) => {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const pinned = pinnedRef.current;
    const heroOverlay = heroOverlayRef.current;
    if (!pinned || !heroOverlay) return;

    const totalProjects = projects.length;
    // Total scroll distance: 6 projects * 100vh each
    const scrollDistance = totalProjects * window.innerHeight;

    const ctx = gsap.context(() => {
      // Single master timeline pinned to the stage
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinned,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
      });

      // Phase 1: Fade out hero overlay (first 8% of timeline)
      masterTl.to(heroOverlay, {
        opacity: 0,
        duration: 0.08,
        ease: 'power2.inOut',
      }, 0);

      // Phase 2: Cycle through project cards
      const projectStart = 0.06;
      const projectSlice = (1 - projectStart) / totalProjects;

      projectRefs.current.forEach((card, i) => {
        if (!card) return;

        const tStart = projectStart + i * projectSlice;

        // Fade in this card
        masterTl.fromTo(
          card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: projectSlice * 0.35, ease: 'power2.out' },
          tStart
        );

        // Hold visible, then fade out (except the last card)
        if (i < totalProjects - 1) {
          masterTl.to(
            card,
            { opacity: 0, y: -20, duration: projectSlice * 0.15, ease: 'power2.in' },
            tStart + projectSlice * 0.85
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative z-20">
      {/* ===== Pinned Stage: Hero + Projects ===== */}
      <div
        ref={pinnedRef}
        id="scroll-section"
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Hero Content Overlay — fades out on scroll */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20 pointer-events-none"
        >


          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 1.5 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-sans text-[9px] tracking-mega-wide uppercase text-stone">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-stone/60 to-transparent"
            />
          </motion.div>
        </div>

        {/* ===== Project Cards (stacked, absolute) ===== */}
        {projects.map((project, i) => (
          <div
            key={project.id}
            id={`project-${i}`}
            ref={(el) => { projectRefs.current[i] = el; }}
            className="absolute inset-0 z-[5] opacity-0 bg-cream"
          >
            <div className="max-w-[1500px] mx-auto h-full px-5 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center overflow-y-auto">
              {/* Text Side */}
              <div className="lg:col-span-4 pt-16 md:pt-0">
                <div className="font-sans text-[10px] uppercase tracking-[0.45em] text-stone mb-4 md:mb-6">
                  {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} — {project.category}
                </div>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-charcoal mb-4 md:mb-6 leading-tight">
                  {project.title}
                </h2>
                <p className="font-sans text-sm font-light text-stone-dark leading-relaxed max-w-md hidden md:block">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-4 md:mt-6">
                  <div className="w-8 h-px bg-warm-gold" />
                  <span className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone">
                    {project.location} &middot; {project.year}
                  </span>
                </div>
              </div>

              {/* Image Side */}
              <div className="lg:col-span-7 lg:col-start-6 h-full flex items-center pb-4 md:pb-0">
                <div className="project-image-wrapper w-full overflow-hidden rounded-sm">
                  <Image
                    src={project.imagePath}
                    alt={project.title}
                    width={1600}
                    height={1000}
                    className="w-full h-[35vh] md:h-[45vh] lg:h-[70vh] object-cover"
                    priority={i < 2}
                    quality={85}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Vision / About Section ===== */}
      <section id="about" className="py-32 lg:py-40 relative bg-cream">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="font-serif text-4xl lg:text-6xl text-charcoal leading-tight">
                A house is a
                <br />
                <span className="italic text-stone-dark">slow ritual</span>
                <br />
                of inhabiting time.
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col justify-center"
            >
              <p className="font-sans text-sm text-stone-dark leading-relaxed max-w-lg mb-10">
                We design for the long arc — for the way a stone wall darkens
                after rain, for the way a child finds their corner of a room.
                Our practice spans interior, planning, landscape and
                architecture, but the work is always the same: to make space for
                the quiet things.
              </p>
              <div>
                <Link
                  href="#scroll-section"
                  className="font-sans text-[11px] tracking-ultra-wide uppercase text-charcoal hover:text-warm-gold transition-colors duration-500 inline-flex items-center gap-3 group"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Explore Projects
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spacer before footer */}
      <div className="h-16" />
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
