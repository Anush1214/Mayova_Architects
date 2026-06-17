'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Project, getProjects } from '@/data/projects';

const navLinks = [
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Compute perceived luminance (0 = black, 1 = white) from RGB values.
 * Uses the standard BT.601 formula for human-perceived brightness.
 */
function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Try to read the actual pixel color from an <img> element at a given viewport position.
 * Falls back to null if the image is cross-origin or not yet loaded.
 */
function sampleImagePixel(img: HTMLImageElement, viewX: number, viewY: number): number | null {
  try {
    if (!img.complete || img.naturalWidth === 0) return null;
    const rect = img.getBoundingClientRect();
    // Map viewport coordinates to the natural image coordinates
    const imgX = ((viewX - rect.left) / rect.width) * img.naturalWidth;
    const imgY = ((viewY - rect.top) / rect.height) * img.naturalHeight;
    if (imgX < 0 || imgY < 0 || imgX >= img.naturalWidth || imgY >= img.naturalHeight) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, imgX, imgY, 1, 1, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return luminance(r, g, b);
  } catch {
    // Cross-origin images will throw — assume dark for portfolio images
    return 0.2;
  }
}

/**
 * Walk up the DOM from an element to find the first ancestor with a non-transparent
 * background-color and return its luminance, or null if none found.
 */
function getElementBgLuminance(el: Element): number | null {
  let node: Element | null = el;
  while (node && node !== document.documentElement) {
    const bg = window.getComputedStyle(node).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) return luminance(+match[1], +match[2], +match[3]);
      break;
    }
    node = node.parentElement;
  }
  return null;
}

export default function Navbar() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const rafId = useRef<number>(0);
  const isDarkRef = useRef(false);

  // Close search on click outside or Escape key
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    // Use mousedown so it fires before any blur/focus changes
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen]);

  // Lazy-load projects only when search is opened (not on mount)
  useEffect(() => {
    if (isSearchOpen && allProjects.length === 0) {
      getProjects().then(setAllProjects);
    }
  }, [isSearchOpen, allProjects.length]);

  const filteredProjects = allProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (projectTitle: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    const id = `project-anchor-${projectTitle.replace(/\s+/g, '-').toLowerCase()}`;
    
    if (pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(href.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── Background luminance detection ───────────────────────────────────────
  // Samples actual pixels behind the navbar (images + CSS backgrounds)
  // to dynamically switch between light and dark text.
  const detectBackground = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      const header = headerRef.current;
      if (!header) { rafId.current = 0; return; }

      // Temporarily hide the header so elementFromPoint sees what's behind it
      header.style.visibility = 'hidden';

      const y = 28; // vertical center of the navbar
      const sampleXPositions = [
        window.innerWidth * 0.5,   // center
        window.innerWidth * 0.75,  // right side (where nav links are)
        window.innerWidth * 0.9,   // far right
      ];

      let darkCount = 0;
      let totalSampled = 0;

      for (const x of sampleXPositions) {
        const el = document.elementFromPoint(x, y);
        if (!el) continue;
        totalSampled++;

        // If we hit an <img>, sample its actual pixel color
        const img = el.tagName === 'IMG' ? el as HTMLImageElement : el.querySelector('img');
        if (img) {
          const lum = sampleImagePixel(img, x, y);
          if (lum !== null) {
            if (lum < 0.45) darkCount++;
            continue;
          }
          // If pixel sampling failed, assume dark for portfolio images
          darkCount++;
          continue;
        }

        // For <canvas> or <video> elements, assume dark
        if (el.tagName === 'CANVAS' || el.tagName === 'VIDEO') {
          darkCount++;
          continue;
        }

        // Otherwise check CSS background-color up the DOM chain
        const bgLum = getElementBgLuminance(el);
        if (bgLum !== null) {
          if (bgLum < 0.45) darkCount++;
        }
        // If no background found, the body cream (#FAF7F2) is light → not dark
      }

      header.style.visibility = '';

      const nowDark = totalSampled > 0 && darkCount > totalSampled / 2;
      if (nowDark !== isDarkRef.current) {
        isDarkRef.current = nowDark;
        setIsDarkBg(nowDark);
      }

      rafId.current = 0;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', detectBackground, { passive: true });
    window.addEventListener('resize', detectBackground, { passive: true });
    // Initial check after page has rendered (after loading animations)
    const timer = setTimeout(detectBackground, 200);
    return () => {
      window.removeEventListener('scroll', detectBackground);
      window.removeEventListener('resize', detectBackground);
      clearTimeout(timer);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [detectBackground]);

  if (pathname.startsWith('/studio')) return null;

  // Dynamic text color based on background luminance
  const textColorClass = isDarkBg ? 'text-cream' : 'text-charcoal';
  const textHoverClass = isDarkBg
    ? 'group-hover:text-white hover:text-white'
    : 'group-hover:text-charcoal-dark hover:text-charcoal-dark';
  // Subtle text shadow only on dark backgrounds for extra crispness
  const navTextShadow = isDarkBg ? '0 1px 3px rgba(0,0,0,0.5)' : 'none';

  return (
    <LazyMotion features={domAnimation}>
    <m.header
      ref={headerRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 3 }}
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 pointer-events-none transition-colors duration-500"
    >
      {/* Left: Logo → Home */}
      <Link
        href="/"
        className="nav-link px-4 py-2 rounded-full pointer-events-auto flex items-center gap-3 group"
      >
        <Image
          src="/images/logo/logo-full.png"
          alt="MAYOVA Architects"
          width={32}
          height={48}
          className={`object-contain transition-transform duration-500 group-hover:scale-105 ${isDarkBg ? 'drop-shadow-[0_0_8px_rgba(250,247,242,0.5)]' : ''}`}
          quality={75}
          sizes="32px"
        />
        <span
          className={`inline-block font-serif text-sm tracking-[0.2em] uppercase transition-colors duration-500 opacity-90 ${textColorClass} ${textHoverClass}`}
          style={{ textShadow: navTextShadow }}
        >
          MAYOVA
        </span>
      </Link>

      {/* Right: Navigation Links (Desktop Only) */}
      <nav className="pointer-events-auto hidden lg:flex items-center gap-8 relative">
        {/* Quick Search */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`nav-link group px-4 py-2 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 opacity-80 ${textColorClass} hover:opacity-100`}
            style={{ textShadow: navTextShadow }}
          >
            <span className="inline-block transition-transform duration-500 group-hover:scale-110">
              {isSearchOpen ? 'Close Search' : 'Quick Search'}
            </span>
          </button>
          
          <AnimatePresence>
            {isSearchOpen && (
              <m.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-4 w-[280px] bg-cream border border-stone/20 shadow-2xl rounded-lg overflow-hidden"
              >
                <div className="p-3 border-b border-stone/10 bg-cream">
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Search projects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-sans text-sm text-charcoal placeholder:text-stone/50"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-cream">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSearchSelect(p.title)}
                        className="w-full text-left px-4 py-3 hover:bg-warm-gold/10 transition-colors border-b border-stone/5 last:border-0"
                      >
                        <p className="font-serif text-charcoal text-sm">{p.title}</p>
                        <p className="font-sans text-[9px] uppercase tracking-wider text-stone/70 mt-1">{p.category}</p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="font-sans text-xs text-stone">No projects found.</p>
                    </div>
                  )}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`nav-link group px-4 py-2 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 opacity-80 ${textColorClass} hover:opacity-100`}
            style={{ textShadow: navTextShadow }}
          >
            <span className="inline-block transition-transform duration-500 group-hover:scale-110">
              {link.label}
            </span>
          </Link>
        ))}
      </nav>
    </m.header>
    </LazyMotion>
  );
}
