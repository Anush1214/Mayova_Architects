'use client';

import { forwardRef, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, Project } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

// ── Description Card ──────────────────────────────────────────────────────────
function DescCard({ project, index, align }: { project: Project; index: number; align: 'left' | 'right' }) {
  return (
    <div className={`relative flex-shrink-0 w-[85vw] md:w-[360px] h-[70vh] lg:h-[75vh] flex flex-col justify-between px-6 md:px-10 py-10 md:py-12 bg-cream/90 backdrop-blur-sm ${align === 'left' ? 'border-r' : 'border-l'} border-stone/15`}>
      <div>
        <p className="font-sans text-[9px] tracking-mega-wide uppercase text-stone mb-8">
          {String(index + 1).padStart(2, '0')} — {project.category} · {project.year}
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-charcoal leading-[1.05] mb-5">
          {project.title}
        </h2>
        <p className="font-sans text-[11px] tracking-ultra-wide uppercase text-warm-gold mb-5">
          {project.subtitle}
        </p>
        <p className="font-sans text-sm text-stone-dark leading-relaxed max-w-[260px]">
          {project.description}
        </p>
      </div>
      <div>
        <div className="w-8 h-px bg-warm-gold mb-5" />
        <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone">
          {project.location}
        </p>
      </div>
    </div>
  );
}

// ── Image Panel ───────────────────────────────────────────────────────────────
function ImgPanel({ src, alt, priority, wide }: { src: string; alt: string; priority?: boolean; wide?: boolean }) {
  return (
    <div className={`relative flex-shrink-0 ${wide ? 'w-[85vw] md:w-[58vw] lg:w-[52vw]' : 'w-[80vw] md:w-[48vw] lg:w-[40vw]'} h-[70vh] lg:h-[75vh] overflow-hidden group interactive`}>
      <Image src={src} alt={alt} fill className="object-cover transition-transform duration-[1200ms] ease-[0.25,0.46,0.45,0.94] group-hover:scale-[1.04]" priority={priority} quality={75} sizes="(max-width: 768px) 90vw, 60vw" />
      <div className="absolute inset-0 bg-charcoal/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}

// ── Single Project Section (pinned horizontal scroll) ─────────────────────────
function ProjectSection({ project, projectIndex, isRTL, showScrollHint }: {
  project: Project; projectIndex: number; isRTL: boolean; showScrollHint: boolean;
}) {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinned = pinnedRef.current;
    const wrapper = wrapperRef.current;
    if (!pinned || !wrapper) return;

    const ctx = gsap.context(() => {
      const getMax = () => wrapper.scrollWidth - window.innerWidth * 0.95;

      const tween = isRTL
        ? gsap.fromTo(wrapper, { x: () => -getMax() }, { x: 0, ease: 'none' })
        : gsap.to(wrapper, { x: () => -getMax(), ease: 'none' });

      ScrollTrigger.create({
        trigger: pinned,
        start: 'top top',
        end: () => `+=${wrapper.scrollWidth}`,
        pin: true,
        pinSpacing: true,
        animation: tween,
        scrub: 1.2,
        invalidateOnRefresh: true,
      });
    });

    return () => ctx.revert();
  }, [isRTL]);

  // RTL: images reversed, desc card on the right end
  const images = isRTL ? [...project.images].reverse() : project.images;

  return (
    <div ref={pinnedRef} className="relative w-full h-screen overflow-hidden bg-cream">
      {/* Scroll hint — only on first section */}
      {showScrollHint && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 1.5 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-sans text-[9px] tracking-mega-wide uppercase text-stone">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-stone/60 to-transparent"
            />
          </motion.div>
        </div>
      )}

      {/* Horizontal strip */}
      <div
        ref={wrapperRef}
        className="absolute top-0 left-0 h-full flex items-center pt-24 pb-12 px-6 md:px-12 lg:px-20 gap-5 md:gap-8 will-change-transform z-[5]"
      >
        {isRTL ? (
          <>
            {images.map((src, ii) => (
              <ImgPanel key={src} src={src} alt={`${project.title} ${ii + 1}`} wide={ii === 0} />
            ))}
            <DescCard project={project} index={projectIndex} align="right" />
          </>
        ) : (
          <>
            <DescCard project={project} index={projectIndex} align="left" />
            {images.map((src, ii) => (
              <ImgPanel key={src} src={src} alt={`${project.title} ${ii + 1}`} priority={projectIndex === 0 && ii === 0} wide={ii === 0} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ScrollContainer ──────────────────────────────────────────────────────
const ScrollContainer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="relative z-20">
      {/* One pinned section per project, alternating LTR / RTL */}
      {projects.map((project, i) => (
        <ProjectSection
          key={project.id}
          project={project}
          projectIndex={i}
          isRTL={i % 2 === 1}
          showScrollHint={i === 0}
        />
      ))}

      {/* ── Vision / About ─────────────────────────────────────────────────── */}
      <section id="about" className="py-32 lg:py-40 bg-cream">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="font-serif text-4xl lg:text-6xl text-charcoal leading-tight">
                A house is a<br />
                <span className="italic text-stone-dark">slow ritual</span><br />
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
                We design for the long arc — for the way a stone wall darkens after rain, for the way
                a child finds their corner of a room. Our practice spans interior, planning, landscape
                and architecture, but the work is always the same: to make space for the quiet things.
              </p>
              <button
                className="nav-link font-sans text-[11px] tracking-ultra-wide uppercase text-charcoal hover:text-warm-gold transition-colors duration-500 inline-flex items-center gap-3 group cursor-pointer w-fit"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Explore Projects
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';
export default ScrollContainer;
