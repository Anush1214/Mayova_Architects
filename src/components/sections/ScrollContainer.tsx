'use client';

import { forwardRef, useState, useCallback, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Project } from '@/data/projects';
import Lightbox from '@/components/ui/Lightbox';

/* ═══════════════════════════════════════════════════════════════════════════════
   Shared easing curve — architectural, refined
   ═══════════════════════════════════════════════════════════════════════════════ */
const EASE = [0.22, 1, 0.36, 1] as const; // expo-out — ultra smooth

// Auto-slideshow constants (module-level to avoid re-creation & lint deps)
const AUTO_SCROLL_SPEED = 180; // px/s — slightly slower, smooth movement
const RESUME_DELAY = 5000; // ms — resume after 5s of no interaction

/* ═══════════════════════════════════════════════════════════════════════════════
   Description Card (left panel in the expanded strip)
   ═══════════════════════════════════════════════════════════════════════════════ */
function DescCard({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative flex-shrink-0 w-[82vw] sm:w-[75vw] md:w-[340px] h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] flex flex-col justify-between px-5 sm:px-6 md:px-10 py-8 sm:py-10 md:py-12 bg-cream/90 backdrop-blur-sm border-r border-stone/15">
      <div>
        <p className="font-sans text-[8px] sm:text-[9px] tracking-mega-wide uppercase text-stone mb-5 sm:mb-8">
          {String(index + 1).padStart(2, '0')} — {project.category} · {project.year}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal leading-[1.05] mb-4 sm:mb-5">
          {project.title}
        </h2>
        <p className="font-sans text-[10px] sm:text-[11px] tracking-ultra-wide uppercase text-warm-gold mb-4 sm:mb-5">
          {project.subtitle}
        </p>
        <p className="font-sans text-xs sm:text-sm text-stone-dark leading-relaxed max-w-[260px]">
          {project.description}
        </p>
      </div>
      <div>
        <div className="w-8 h-px bg-warm-gold mb-4 sm:mb-5" />
        <p className="font-sans text-[9px] sm:text-[10px] tracking-ultra-wide uppercase text-stone">
          {project.location}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Image Panel (each image in the expanded strip)
   ═══════════════════════════════════════════════════════════════════════════════ */
function ImgPanel({ src, alt, wide, onClick }: { src: string; alt: string; wide?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`relative flex-shrink-0 ${
        wide
          ? 'w-[82vw] sm:w-[75vw] md:w-[58vw] lg:w-[52vw]'
          : 'w-[78vw] sm:w-[70vw] md:w-[48vw] lg:w-[40vw]'
      } h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden group interactive cursor-pointer`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-[1200ms] ease-[0.25,0.46,0.45,0.94] group-hover:scale-[1.04]"
        quality={80}
        loading="lazy"
        sizes={wide
          ? '(max-width: 640px) 82vw, (max-width: 768px) 75vw, (max-width: 1024px) 58vw, 52vw'
          : '(max-width: 640px) 78vw, (max-width: 768px) 70vw, (max-width: 1024px) 48vw, 40vw'
        }
      />
      <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Project Card — single component that morphs between collapsed / expanded
   Uses a unified container instead of swapping components for smooth animation
   ═══════════════════════════════════════════════════════════════════════════════ */
function ProjectCard({ project, index, isExpanded, onToggle }: {
  project: Project; index: number; isExpanded: boolean; onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const expandedContainerRef = useRef<HTMLDivElement>(null);

  // ── Auto-slideshow state ──
  const [autoPlay, setAutoPlay] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const autoPlayPausedByUser = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const isUserInteracting = useRef(false);
  const scrollPosRef = useRef(0);
  const isAutoScrollingRef = useRef(false);

  useEffect(() => {
    if (!isExpanded) {
      const handle = requestAnimationFrame(() => {
        setShowLeftArrow(false);
        setShowRightArrow(false);
        setScrollProgress(0);
      });
      return () => cancelAnimationFrame(handle);
    }
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowLeftArrow(el.scrollLeft > 30);
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 30);
      // Update scroll progress (0 to 1)
      const maxScroll = el.scrollWidth - el.clientWidth;
      setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);

      // Always sync high-precision scrollPosRef with actual scrollLeft if the scroll didn't originate from auto-scrolling
      if (!isAutoScrollingRef.current) {
        scrollPosRef.current = el.scrollLeft;
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    // Re-check after images start loading
    const t = setTimeout(handleScroll, 200);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      clearTimeout(t);
    };
  }, [isExpanded, autoPlay]);

  // ── Auto-slideshow engine (continuous smooth pixel scroll via rAF) ──
  useEffect(() => {
    if (!isExpanded || !autoPlay) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Re-enable snap when auto-scroll stops
      const el = scrollRef.current;
      if (el) el.style.scrollSnapType = 'x mandatory';
      return;
    }

    let lastTime: number | null = null;
    // Set the initial float position to the current scroll position
    if (scrollRef.current) {
      scrollPosRef.current = scrollRef.current.scrollLeft;
    }

    const tick = (now: number) => {
      const el = scrollRef.current;
      if (!el) return;

      if (lastTime !== null && !isUserInteracting.current) {
        const delta = (now - lastTime) / 1000;
        const px = AUTO_SCROLL_SPEED * delta;
        const maxScroll = el.scrollWidth - el.clientWidth;

        if (el.scrollLeft >= maxScroll - 1) {
          // Reached the end — stop sliding at the last image
          el.scrollLeft = maxScroll;
          setAutoPlay(false);
          return;
        }

        // Increment the high-precision float ref
        scrollPosRef.current += px;
        // Assign the rounded value to the scrollLeft property safely
        isAutoScrollingRef.current = true;
        el.scrollLeft = Math.round(scrollPosRef.current);
        isAutoScrollingRef.current = false;
      }

      lastTime = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    // Brief delay so expand animation finishes, then start scrolling
    const startDelay = setTimeout(() => {
      const el = scrollRef.current;
      // Disable snap so it doesn't fight the continuous scroll
      if (el) {
        el.style.scrollSnapType = 'none';
        scrollPosRef.current = el.scrollLeft;
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 800);

    return () => {
      clearTimeout(startDelay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isExpanded, autoPlay]);

  // ── Pause/resume on user interaction ──
  const pauseAutoScroll = useCallback(() => {
    isUserInteracting.current = true;
    // Clear any pending resume timer
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    // Schedule resume after inactivity (only if user hasn't manually toggled off)
    if (!autoPlayPausedByUser.current) {
      resumeTimerRef.current = setTimeout(() => {
        isUserInteracting.current = false;
      }, RESUME_DELAY);
    }
  }, []);

  // ── Detect user interaction on the scroll strip ──
  useEffect(() => {
    if (!isExpanded) return;
    const el = scrollRef.current;
    if (!el) return;

    const onInteractionStart = () => pauseAutoScroll();
    const onInteractionEnd = () => {
      // After interaction ends, wait RESUME_DELAY then resume
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (!autoPlayPausedByUser.current) {
        resumeTimerRef.current = setTimeout(() => {
          isUserInteracting.current = false;
        }, RESUME_DELAY);
      }
    };

    // Mouse hover
    el.addEventListener('mouseenter', onInteractionStart, { passive: true });
    el.addEventListener('mouseleave', onInteractionEnd, { passive: true });
    // Touch
    el.addEventListener('touchstart', onInteractionStart, { passive: true });
    el.addEventListener('touchend', onInteractionEnd, { passive: true });
    // Wheel (manual scroll)
    el.addEventListener('wheel', onInteractionStart, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', onInteractionStart);
      el.removeEventListener('mouseleave', onInteractionEnd);
      el.removeEventListener('touchstart', onInteractionStart);
      el.removeEventListener('touchend', onInteractionEnd);
      el.removeEventListener('wheel', onInteractionStart);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [isExpanded, pauseAutoScroll]);

  useEffect(() => {
    if (!isExpanded) {
      const handle = requestAnimationFrame(() => {
        setAutoPlay(true);
      });
      autoPlayPausedByUser.current = false;
      isUserInteracting.current = false;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return () => cancelAnimationFrame(handle);
    }
  }, [isExpanded]);

  // ── Toggle auto-play (manual control) ──
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => {
      const next = !prev;
      autoPlayPausedByUser.current = !next;
      if (next) {
        isUserInteracting.current = false;
        // If we are at the end when user clicks play, start from beginning
        const el = scrollRef.current;
        if (el) {
          const maxScroll = el.scrollWidth - el.clientWidth;
          if (el.scrollLeft >= maxScroll - 5) {
            el.scrollLeft = 0;
            scrollPosRef.current = 0;
          }
        }
      }
      return next;
    });
  }, []);

  const scrollByFn = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(window.innerWidth * 0.45, 600);
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  }, []);

  // ── Keyboard arrow keys for horizontal scroll ──
  useEffect(() => {
    if (!isExpanded) return;

    // Auto-focus the expanded container so key events work immediately
    expandedContainerRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        pauseAutoScroll();
        scrollByFn('right');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        pauseAutoScroll();
        scrollByFn('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, pauseAutoScroll, scrollByFn]);

  return (
    <div
      id={`project-${project.sanityId}`}
      className="relative bg-cream"
    >
      {/* Anchor for sidebar navigation */}
      <div
        id={`project-anchor-${project.slug}`}
        className="absolute"
        style={{ transform: 'translateY(-100px)' }}
      />

      {/* Divider */}
      {index > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-stone/15 to-transparent" />
        </div>
      )}

      {/* Project Section */}
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
        className="py-6 sm:py-8 lg:py-12"
      >
        {/* Project number + image count */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <p className="font-sans text-[8px] sm:text-[9px] tracking-mega-wide uppercase text-stone/50">
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="font-sans text-[8px] sm:text-[9px] tracking-ultra-wide uppercase text-stone/40">
              {project.images.length} images
            </p>
          </div>
        </div>

        {/* ══════════ IMAGE AREA — morphs in-place ══════════ */}
        <m.div
          layout
          transition={{ layout: { duration: 0.8, ease: EASE } }}
          className={isExpanded ? 'relative' : 'max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12'}
        >
          {/* ── COLLAPSED: single cover image ── */}
          {!isExpanded && (
            <m.div
              layout
              layoutId={`cover-${project.id}`}
              onClick={onToggle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative overflow-hidden cursor-pointer will-change-transform"
              style={{
                borderRadius: isHovered ? '2px' : '0px',
              }}
              animate={{
                scale: isHovered ? 1.012 : 1,
                y: isHovered ? -5 : 0,
              }}
              transition={{
                scale: { duration: 0.65, ease: EASE },
                y: { duration: 0.65, ease: EASE },
                layout: { duration: 0.8, ease: EASE },
              }}
            >
              {/* Shadow layer (separate for GPU performance) */}
              <div
                className="absolute inset-0 rounded-[2px] pointer-events-none"
                style={{
                  boxShadow: isHovered
                    ? '0 20px 50px -10px rgba(0,0,0,0.14), 0 6px 16px -6px rgba(0,0,0,0.08)'
                    : '0 0 0 0 transparent',
                  transition: 'box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              <div className="relative h-[42vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  loading="lazy"
                  quality={80}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 90vw, (max-width: 1400px) 85vw, 1200px"
                />
                {/* Dark overlay on hover */}
                <div
                  className="absolute inset-0 transition-[background-color] duration-700"
                  style={{
                    backgroundColor: isHovered ? 'rgba(44,44,44,0.16)' : 'rgba(44,44,44,0)',
                  }}
                />
                {/* "View Project" pill — desktop hover */}
                <m.div
                  className="absolute inset-0 hidden md:flex items-center justify-center"
                  initial={false}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className="px-6 py-3 bg-cream/90 backdrop-blur-sm rounded-full flex items-center gap-3 shadow-sm">
                    <span className="font-sans text-[10px] tracking-ultra-wide uppercase text-charcoal">
                      View Project
                    </span>
                    <span className="text-charcoal text-xs">→</span>
                  </div>
                </m.div>

                {/* "View Project" badge — mobile only, always visible */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between md:hidden pointer-events-none">
                  <div className="px-3.5 py-2 bg-cream/85 backdrop-blur-sm rounded-full flex items-center gap-2 shadow-md">
                    <span className="font-sans text-[8px] tracking-ultra-wide uppercase text-charcoal">
                      View Project
                    </span>
                    <span className="text-charcoal text-[9px]">→</span>
                  </div>
                  <div className="px-3 py-2 bg-charcoal/60 backdrop-blur-sm rounded-full">
                    <span className="font-sans text-[8px] tracking-ultra-wide uppercase text-cream/90">
                      {project.images.length} images
                    </span>
                  </div>
                </div>
              </div>
            </m.div>
          )}

          {/* ── EXPANDED: horizontal scroll strip ── */}
          {isExpanded && (
            <m.div
              layout
              layoutId={`cover-${project.id}`}
              className="relative w-full"
              transition={{ layout: { duration: 0.8, ease: EASE } }}
            >
              {/* Left arrow */}
              <AnimatePresence>
                {showLeftArrow && (
                  <m.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => { pauseAutoScroll(); scrollByFn('left'); }}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-cream/85 backdrop-blur-sm border border-stone/10 hover:border-warm-gold/40 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg"
                    aria-label="Scroll left"
                  >
                    <span className="text-charcoal text-sm sm:text-base">←</span>
                  </m.button>
                )}
              </AnimatePresence>

              {/* Right arrow */}
              <AnimatePresence>
                {showRightArrow && (
                  <m.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => { pauseAutoScroll(); scrollByFn('right'); }}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-cream/85 backdrop-blur-sm border border-stone/10 hover:border-warm-gold/40 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg"
                    aria-label="Scroll right"
                  >
                    <span className="text-charcoal text-sm sm:text-base">→</span>
                  </m.button>
                )}
              </AnimatePresence>

              {/* Play / Pause toggle */}
              <m.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.35, ease: EASE }}
                onClick={toggleAutoPlay}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-cream/85 backdrop-blur-sm border border-stone/10 hover:border-warm-gold/40 active:scale-90 transition-all duration-200 cursor-pointer shadow-lg group"
                aria-label={autoPlay ? 'Pause slideshow' : 'Play slideshow'}
              >
                {autoPlay ? (
                  /* Pause icon — two vertical bars */
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className="text-charcoal group-hover:text-warm-gold transition-colors">
                    <rect x="1" y="1" width="3.5" height="12" rx="0.8" fill="currentColor" />
                    <rect x="7.5" y="1" width="3.5" height="12" rx="0.8" fill="currentColor" />
                  </svg>
                ) : (
                  /* Play icon — triangle */
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className="text-charcoal group-hover:text-warm-gold transition-colors">
                    <path d="M2 1.5L10.5 7L2 12.5V1.5Z" fill="currentColor" />
                  </svg>
                )}
              </m.button>

              {/* Close button */}
              <m.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                onClick={onToggle}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-cream/85 backdrop-blur-sm border border-stone/10 hover:border-warm-gold/40 active:scale-90 transition-all duration-200 cursor-pointer shadow-lg group"
                aria-label="Collapse gallery"
              >
                <span className="text-charcoal group-hover:text-warm-gold transition-colors text-xs sm:text-sm">✕</span>
              </m.button>

              {/* Scroll progress bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-[min(60%,320px)]">
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
                  className="h-[3px] rounded-full bg-charcoal/10 overflow-hidden backdrop-blur-sm"
                >
                  <div
                    className="h-full rounded-full bg-warm-gold/70 transition-[width] duration-150 ease-linear"
                    style={{ width: `${Math.max(2, scrollProgress * 100)}%` }}
                  />
                </m.div>
              </div>

              {/* Horizontal scrollable strip */}
              <div
                ref={scrollRef}
                className="flex items-stretch gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide overscroll-x-contain"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {/* Desc card */}
                <m.div
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
                >
                  <DescCard project={project} index={index} />
                </m.div>

                {/* Cover image as first panel */}
                <div
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                >
                  <div className="relative w-[82vw] sm:w-[75vw] md:w-[58vw] lg:w-[52vw] h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden group interactive cursor-pointer">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-[0.25,0.46,0.45,0.94] group-hover:scale-[1.04]"
                      quality={80}
                      sizes="(max-width: 640px) 82vw, (max-width: 768px) 75vw, (max-width: 1024px) 58vw, 52vw"
                    />
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>

                {/* Gallery images — skip any that match the cover to avoid duplication */}
                {project.images
                  .filter((src) => src.split('?')[0] !== project.coverImage.split('?')[0])
                  .map((src, ii) => (
                  <m.div
                    key={src}
                    className="flex-shrink-0"
                    style={{ scrollSnapAlign: 'start' }}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.15 + ii * 0.06,
                      duration: 0.5,
                      ease: EASE,
                    }}
                  >
                    <ImgPanel 
                      src={src} 
                      alt={`${project.title} ${ii + 1}`} 
                      wide={ii === 0} 
                      onClick={() => {
                        setLightboxIndex(ii + 1);
                        setLightboxOpen(true);
                      }}
                    />
                  </m.div>
                ))}
              </div>
            </m.div>
          )}
        </m.div>

        {/* Title + Meta — always below the image area */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <span className="font-sans text-[8px] sm:text-[9px] tracking-ultra-wide uppercase text-warm-gold">
                  {project.category}
                </span>
                <span className="text-stone/30 text-[8px]">&middot;</span>
                <span className="font-sans text-[8px] sm:text-[9px] tracking-ultra-wide uppercase text-stone">
                  {project.year}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal leading-tight">
                {project.title}
              </h2>
              <p className="font-sans text-[9px] sm:text-[10px] tracking-ultra-wide uppercase text-stone/60 mt-1">
                {project.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-5 sm:w-6 h-px bg-warm-gold" />
              <span className="font-sans text-[9px] sm:text-[10px] tracking-ultra-wide uppercase text-stone">
                {project.location}
              </span>
            </div>
          </div>
        </div>
      </m.div>

      {/* Lightbox Gallery */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={getProjectImages(project)}
        initialIndex={lightboxIndex}
        title={project.title}
        category={project.category}
        year={project.year}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Main ScrollContainer
   ═══════════════════════════════════════════════════════════════════════════════ */
const ScrollContainer = forwardRef<HTMLDivElement, { projects: Project[] }>(({ projects }, ref) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <LayoutGroup>
        <div ref={ref} className="relative z-20">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.sanityId}
              project={project}
              index={i}
              isExpanded={expandedId === project.sanityId}
              onToggle={() => handleToggle(project.sanityId)}
            />
          ))}

          {/* ── Vision / About ─────────────────────────────────────────────── */}
          <section id="about" className="py-20 sm:py-32 lg:py-40 bg-cream">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
                <m.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1, ease: EASE }}
                >
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-charcoal leading-tight">
                    Every space tells<br />
                    <span className="italic text-stone-dark">a unique story</span><br />
                    worth inhabiting.
                  </h2>
                </m.div>
                <m.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1, delay: 0.2, ease: EASE }}
                  className="flex flex-col justify-center"
                >
                  <p className="font-sans text-xs sm:text-sm text-stone-dark leading-relaxed max-w-lg mb-8 sm:mb-10">
                    We create spaces that balance function with emotion, tradition with innovation, and simplicity with character. 
                    Our practice spans architecture, interiors, and design-build projects, united by a belief that thoughtful spaces 
                    can elevate the way we live, work, and connect.
                  </p>
                  <button
                    className="nav-link font-sans text-[10px] sm:text-[11px] tracking-ultra-wide uppercase text-charcoal hover:text-warm-gold transition-colors duration-500 inline-flex items-center gap-3 group cursor-pointer w-fit"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Explore Projects
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </m.div>
              </div>
            </div>
          </section>

          <div className="h-12 sm:h-16" />
        </div>
      </LayoutGroup>
    </LazyMotion>
  );
});

ScrollContainer.displayName = 'ScrollContainer';
export default ScrollContainer;
