'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { projects } from '@/data/projects';

const navLinks = [
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const filteredProjects = projects.filter(p => 
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

  const [isDarkBg, setIsDarkBg] = useState(false);

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

  const textColorClass = isDarkBg ? 'text-cream' : 'text-charcoal';
  const textHoverClass = isDarkBg ? 'group-hover:text-white hover:text-white' : 'group-hover:text-charcoal-dark hover:text-charcoal-dark';

  return (
    <motion.header
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
          className={`object-contain transition-all duration-500 group-hover:scale-105 ${isDarkBg ? 'drop-shadow-[0_0_8px_rgba(250,247,242,0.5)]' : ''}`}
          unoptimized
        />
        <span className={`inline-block font-serif text-sm tracking-[0.2em] uppercase transition-all duration-500 opacity-90 ${textColorClass} ${textHoverClass} group-hover:scale-110 group-hover:tracking-[0.25em]`}>
          MAYOVA
        </span>
      </Link>

      {/* Right: Navigation Links (Desktop Only) */}
      <nav className="pointer-events-auto hidden lg:flex items-center gap-8 relative">
        {/* Quick Search */}
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`nav-link group px-4 py-2 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 opacity-80 ${textColorClass} hover:opacity-100`}
          >
            <span className="inline-block transition-all duration-500 group-hover:scale-110 group-hover:tracking-[0.25em]">
              {isSearchOpen ? 'Close Search' : 'Quick Search'}
            </span>
          </button>
          
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`nav-link group px-4 py-2 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 opacity-80 ${textColorClass} hover:opacity-100`}
          >
            <span className="inline-block transition-all duration-500 group-hover:scale-110 group-hover:tracking-[0.25em]">
              {link.label}
            </span>
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
