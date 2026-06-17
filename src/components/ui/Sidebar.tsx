'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Project, getProjects } from '@/data/projects';

const navItems = [
  { num: '01', label: 'Projects', href: '/projects' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Contact', href: '#contact' },
];



export default function Sidebar({ projects: initialProjects }: { projects?: Project[] }) {
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects || []);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchMobileOpen, setSearchMobileOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initialProjects) {
      getProjects().then(setAllProjects);
    }
  }, [initialProjects]);

  const filteredProjects = allProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (projectTitle: string) => {
    setSearchQuery('');
    setMobileOpen(false);
    setSearchMobileOpen(false);
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

  // ── Background luminance detection for mobile controls ──
  // Samples pixels behind the top-right area (where hamburger + search sit)
  const rafId = useRef<number>(0);
  const isDarkRef = useRef(false);

  const detectBackground = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      const y = 32; // vertical center of mobile buttons
      const x = window.innerWidth - 48; // approximate position of hamburger

      // Check what's behind the mobile buttons
      // Hide the buttons temporarily by checking elements at their position
      const els = document.elementsFromPoint(x, y);
      let isDark = false;

      for (const el of els) {
        // Skip the sidebar's own elements
        if (el.closest('[aria-label="Toggle menu"]') || el.closest('[aria-label="Toggle mobile search"]')) continue;

        // Check images
        if (el.tagName === 'IMG') {
          try {
            const img = el as HTMLImageElement;
            if (img.complete && img.naturalWidth > 0) {
              const canvas = document.createElement('canvas');
              canvas.width = 1;
              canvas.height = 1;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                const rect = img.getBoundingClientRect();
                const imgX = ((x - rect.left) / rect.width) * img.naturalWidth;
                const imgY = ((y - rect.top) / rect.height) * img.naturalHeight;
                ctx.drawImage(img, imgX, imgY, 1, 1, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                isDark = (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
                break;
              }
            }
          } catch {
            isDark = true;
            break;
          }
          isDark = true;
          break;
        }

        if (el.tagName === 'CANVAS' || el.tagName === 'VIDEO') {
          isDark = true;
          break;
        }

        // Check CSS background
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            isDark = (0.299 * +match[1] + 0.587 * +match[2] + 0.114 * +match[3]) / 255 < 0.45;
          }
          break;
        }
      }

      // Also check footer proximity (last 400px)
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (docHeight - (scrollY + winHeight) < 400) {
        isDark = true;
      }

      if (isDark !== isDarkRef.current) {
        isDarkRef.current = isDark;
        setIsDarkBg(isDark);
      }
      rafId.current = 0;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', detectBackground, { passive: true });
    window.addEventListener('resize', detectBackground, { passive: true });
    const timer = setTimeout(detectBackground, 200);
    return () => {
      window.removeEventListener('scroll', detectBackground);
      window.removeEventListener('resize', detectBackground);
      clearTimeout(timer);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [detectBackground]);

  // Close mobile search on click outside or Escape key
  const searchMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchMobileOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (searchMobileRef.current && !searchMobileRef.current.contains(e.target as Node)) {
        setSearchMobileOpen(false);
        setSearchQuery('');
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchMobileOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside as unknown as EventListener);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as unknown as EventListener);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [searchMobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (pathname.startsWith('/studio')) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const textColorClass = isDarkBg ? 'text-cream' : 'text-charcoal';
  const textHoverClass = isDarkBg ? 'hover:text-white' : 'hover:text-charcoal-dark';
  const textMutedClass = isDarkBg ? 'text-cream/60' : 'text-charcoal/60';

  return (
    <LazyMotion features={domAnimation}>
    <>
      {/* ==================== DESKTOP SIDEBAR BACKGROUND (DISABLED) ==================== */}

      {/* ==================== DESKTOP SIDEBAR CONTENT (DISABLED) ==================== */}

      {/* ==================== MOBILE QUICK SEARCH ==================== */}
      <div ref={searchMobileRef} className="fixed top-6 right-[4.5rem] z-[65] lg:hidden pointer-events-none flex flex-col items-end">
        <m.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          onClick={() => {
            setSearchMobileOpen(!searchMobileOpen);
            if (mobileOpen) setMobileOpen(false);
          }}
          className={`nav-link pointer-events-auto flex items-center justify-center w-12 h-12 cursor-pointer rounded-full transition-colors duration-500`}
          aria-label="Toggle mobile search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDarkBg ? 'text-cream' : 'text-charcoal'}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </m.button>

        <AnimatePresence>
          {searchMobileOpen && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`pointer-events-auto mt-2 w-[280px] ${isDarkBg ? 'bg-[#222] border-cream/10' : 'bg-cream border-stone/20'} border shadow-2xl rounded-lg overflow-hidden`}
            >
              <div className={`p-3 border-b ${isDarkBg ? 'border-cream/10' : 'border-stone/10'}`}>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent border-none outline-none font-sans text-sm ${isDarkBg ? 'text-cream placeholder:text-cream/40' : 'text-charcoal placeholder:text-stone/50'}`}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSearchSelect(p.title)}
                      className={`w-full text-left px-4 py-3 transition-colors border-b last:border-0 ${isDarkBg ? 'hover:bg-cream/10 border-cream/5 text-cream' : 'hover:bg-warm-gold/10 border-stone/5 text-charcoal'}`}
                    >
                      <p className="font-serif text-sm">{p.title}</p>
                      <p className={`font-sans text-[9px] uppercase tracking-wider mt-1 ${isDarkBg ? 'text-warm-gold' : 'text-stone/70'}`}>{p.category}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className={`font-sans text-xs ${isDarkBg ? 'text-cream/50' : 'text-stone'}`}>No projects found.</p>
                  </div>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================== MOBILE HAMBURGER BUTTON ==================== */}
      <m.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        onClick={() => {
          setMobileOpen(!mobileOpen);
          if (searchMobileOpen) setSearchMobileOpen(false);
        }}
        className="nav-link fixed top-6 right-6 z-[65] lg:hidden flex flex-col items-center justify-center w-12 h-12 gap-[5px] cursor-pointer rounded-full pointer-events-auto"
        aria-label="Toggle menu"
      >
        <m.span
          animate={{
            rotate: mobileOpen ? 45 : 0,
            y: mobileOpen ? 7 : 0,
          }}
          className={`block w-6 h-[1.5px] origin-center transition-colors duration-500 ${isDarkBg ? 'bg-cream' : 'bg-charcoal'}`}
        />
        <m.span
          animate={{ opacity: mobileOpen ? 0 : 1 }}
          className={`block w-6 h-[1.5px] transition-colors duration-500 ${isDarkBg ? 'bg-cream' : 'bg-charcoal'}`}
        />
        <m.span
          animate={{
            rotate: mobileOpen ? -45 : 0,
            y: mobileOpen ? -7 : 0,
          }}
          className={`block w-6 h-[1.5px] origin-center transition-colors duration-500 ${isDarkBg ? 'bg-cream' : 'bg-charcoal'}`}
        />
      </m.button>

      {/* ==================== MOBILE FULL-SCREEN MENU ==================== */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] lg:hidden flex flex-col justify-center items-center"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {/* Logo */}
            <div className="absolute top-4 left-6">
              <Image
                src="/images/logo/logo-full.png"
                alt="MAYOVA"
                width={36}
                height={54}
                className="object-contain drop-shadow-[0_0_12px_rgba(250,247,242,0.15)]"
                quality={75}
                sizes="36px"
              />
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col items-center gap-8 relative z-[60]">
              {navItems.map((item, i) => (
                <m.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex flex-col items-center gap-1 text-cream hover:text-warm-gold transition-colors duration-500"
                  >
                    <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/30">
                      {item.num}
                    </span>
                    <span className="font-serif text-2xl tracking-[0.2em] uppercase">
                      {item.label}
                    </span>
                  </Link>
                </m.div>
              ))}
            </nav>



            {/* Bottom info */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-8 flex flex-col items-center gap-2"
            >
              <a
                href="https://www.instagram.com/mayova_architects/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream/30 hover:text-cream transition-colors"
              >
                @mayova_architects
              </a>
              <span className="font-sans text-[10px] text-cream/20 tracking-wider">
                Udupi, Karnataka · India
              </span>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
    </LazyMotion>
  );
}
