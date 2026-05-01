'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none transition-colors duration-500"
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
        <span className={`font-serif text-sm tracking-[0.2em] uppercase transition-colors duration-500 opacity-90 ${textColorClass} ${textHoverClass}`}>
          MAYOVA
        </span>
      </Link>

      {/* Right: Navigation Links (Desktop Only) */}
      <nav className="pointer-events-auto hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`nav-link px-4 py-2 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 opacity-80 ${textColorClass} hover:opacity-100`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
