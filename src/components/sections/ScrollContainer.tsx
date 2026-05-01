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
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinned = pinnedRef.current;
    const scrollWrapper = scrollWrapperRef.current;
    const heroOverlay = heroOverlayRef.current;
    if (!pinned || !scrollWrapper || !heroOverlay) return;

    const ctx = gsap.context(() => {
      // Create horizontal scroll animation
      const getScrollAmount = () => {
        const scrollWidth = scrollWrapper.scrollWidth;
        const windowWidth = window.innerWidth;
        // We only translate by the difference so the last image touches the right edge
        return -(scrollWidth - windowWidth + (windowWidth * 0.1));
      };

      const tween = gsap.to(scrollWrapper, {
        x: getScrollAmount,
        ease: "none"
      });

      ScrollTrigger.create({
        trigger: pinned,
        start: "top top",
        end: () => `+=${scrollWrapper.scrollWidth}`, // Scroll amount
        pin: true,
        pinSpacing: true, // Explicitly enforce padding
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
      });

      // Fade out hero overlay in the first part of scroll
      gsap.to(heroOverlay, {
        opacity: 0,
        scrollTrigger: {
          trigger: pinned,
          start: "top top",
          end: "+=300", // Shorter fade out to feel snappier
          scrub: true,
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
        className="relative w-full h-screen overflow-hidden bg-cream"
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

        {/* ===== Horizontal Project Gallery ===== */}
        <div 
          ref={scrollWrapperRef} 
          className="absolute top-0 left-0 h-full flex items-center pt-24 pb-12 px-6 md:px-12 lg:px-24 gap-6 md:gap-12 lg:gap-24 will-change-transform z-[5]"
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="relative w-[85vw] md:w-[70vw] lg:w-[60vw] h-[70vh] lg:h-[75vh] flex-shrink-0 group cursor-pointer overflow-hidden interactive bg-stone/5"
            >
              <Image
                src={project.imagePath}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority={i < 2}
                sizes="(max-width: 768px) 85vw, (max-width: 1200px) 70vw, 60vw"
              />
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content that appears on hover */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[0.25,0.46,0.45,0.94]">
                  <p className="font-sans text-[10px] uppercase tracking-ultra-wide text-cream/70 mb-3">
                    {String(i + 1).padStart(2, '0')} — {project.category} · {project.year}
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-tight max-w-2xl">
                    {project.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
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
