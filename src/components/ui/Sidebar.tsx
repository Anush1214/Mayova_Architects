'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Project, getProjects } from '@/data/projects';

const navItems = [
  { num: '01', label: 'Projects', href: '/projects' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Contact', href: '#contact' },
];

const serviceLinks = [
  { label: 'Interior', href: '/projects/interior' },
  { label: 'Landscape', href: '/projects/landscape' },
  { label: 'Architecture', href: '/projects/architecture' },
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

  // Check scroll position for footer
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      if (docHeight - (scrollY + winHeight) < 400) {
        setIsDarkBg(true);
      } else {
        setIsDarkBg(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      {/* ==================== DESKTOP SIDEBAR BACKGROUND ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="fixed top-0 left-0 z-[40] h-screen hidden lg:block transition-all duration-700 ease-out pointer-events-none"
        style={{
          width: hovered ? '240px' : '72px',
          backgroundColor: hovered 
            ? (isDarkBg ? 'rgba(44, 44, 44, 0.95)' : 'rgba(250, 247, 242, 0.95)') 
            : 'transparent',
          backdropFilter: hovered ? 'blur(20px)' : 'none',
          borderRight: hovered 
            ? (isDarkBg ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)') 
            : '1px solid transparent',
        }}
      />

      {/* ==================== DESKTOP SIDEBAR CONTENT ==================== */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="fixed top-0 left-0 z-[60] h-screen hidden lg:flex flex-col justify-between py-8 transition-all duration-700 ease-out"
        style={{ width: hovered ? '240px' : '72px' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Spacer — logo is in the top navbar */}
        <div className="h-12" />

        {/* Middle: Navigation */}
        <nav className="flex flex-col gap-1 px-4 overflow-hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`nav-link px-2 group flex items-center gap-3 py-2 rounded-full transition-all duration-300 ${textMutedClass} ${textHoverClass}`}
            >
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase shrink-0 w-5 text-center opacity-70 group-hover:opacity-100 transition-opacity">
                {item.num}
              </span>
              <span
                className={`font-sans text-[13px] tracking-[0.15em] uppercase transition-all duration-500`}
                style={{
                  opacity: hovered ? 1 : 0,
                  width: hovered ? 'auto' : 0,
                  transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
                }}
              >
                <span className="inline-block transition-all duration-500 group-hover:scale-110 group-hover:tracking-[0.2em]">
                  {item.label}
                </span>
              </span>
            </Link>
          ))}

          {/* Service sub-links */}
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className={`mt-3 pt-3 border-t ${isDarkBg ? 'border-white/10' : 'border-charcoal/5'} flex flex-col gap-2`}
            >
              {serviceLinks.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`nav-link group px-2 py-1 rounded-full font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ml-8 ${isDarkBg ? 'text-cream/50' : 'text-charcoal/50'} ${textHoverClass}`}
                >
                  <span className="inline-block transition-all duration-500 group-hover:scale-110 group-hover:tracking-[0.25em]">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </motion.div>
          )}
        </nav>

        {/* Bottom: Location + Social */}
        <div className="flex flex-col items-center gap-4 px-4">
          {hovered ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <a
                href="https://www.instagram.com/mayova_architects/"
                target="_blank"
                rel="noopener noreferrer"
                className={`nav-link group px-3 py-1 rounded-full font-sans text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${textMutedClass} ${textHoverClass}`}
              >
                <span className="inline-block transition-all duration-500 group-hover:scale-110 group-hover:tracking-[0.25em]">
                  @mayova_architects
                </span>
              </a>
              <span className={`font-sans text-[10px] tracking-[0.15em] transition-colors duration-500 ${isDarkBg ? 'text-cream/40' : 'text-stone/40'}`}>
                Udupi, India
              </span>
            </motion.div>
          ) : (
            <span
              className={`font-sans text-[9px] tracking-[0.3em] uppercase transition-colors duration-500 ${isDarkBg ? 'text-cream/40' : 'text-stone/40'}`}
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Udupi
            </span>
          )}
        </div>
      </motion.aside>

      {/* ==================== MOBILE QUICK SEARCH ==================== */}
      <div className="fixed top-6 right-[4.5rem] z-[65] lg:hidden pointer-events-none flex flex-col items-end">
        <motion.button
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
        </motion.button>

        <AnimatePresence>
          {searchMobileOpen && (
            <motion.div
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================== MOBILE HAMBURGER BUTTON ==================== */}
      <motion.button
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
        <motion.span
          animate={{
            rotate: mobileOpen ? 45 : 0,
            y: mobileOpen ? 7 : 0,
          }}
          className={`block w-6 h-[1.5px] origin-center transition-colors duration-500 ${isDarkBg ? 'bg-cream' : 'bg-charcoal'}`}
        />
        <motion.span
          animate={{ opacity: mobileOpen ? 0 : 1 }}
          className={`block w-6 h-[1.5px] transition-colors duration-500 ${isDarkBg ? 'bg-cream' : 'bg-charcoal'}`}
        />
        <motion.span
          animate={{
            rotate: mobileOpen ? -45 : 0,
            y: mobileOpen ? -7 : 0,
          }}
          className={`block w-6 h-[1.5px] origin-center transition-colors duration-500 ${isDarkBg ? 'bg-cream' : 'bg-charcoal'}`}
        />
      </motion.button>

      {/* ==================== MOBILE FULL-SCREEN MENU ==================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
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
                unoptimized
              />
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col items-center gap-8 relative z-[60]">
              {navItems.map((item, i) => (
                <motion.div
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
                </motion.div>
              ))}
            </nav>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-12 flex items-center gap-4"
            >
              {serviceLinks.map((cat, i) => (
                <span key={cat.label} className="flex items-center gap-4">
                  <Link
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-sans text-[11px] tracking-[0.2em] uppercase text-cream/40 hover:text-cream transition-colors duration-300"
                  >
                    {cat.label}
                  </Link>
                  {i < serviceLinks.length - 1 && (
                    <span className="text-cream/15 text-xs">·</span>
                  )}
                </span>
              ))}
            </motion.div>

            {/* Bottom info */}
            <motion.div
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
