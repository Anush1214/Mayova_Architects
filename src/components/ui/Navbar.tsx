'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 3 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none"
    >
      {/* Left: Logo → Home */}
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-3 group"
      >
        <Image
          src="/images/logo/logo-full.png"
          alt="MAYOVA Architects"
          width={32}
          height={48}
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <span className="font-serif text-sm tracking-[0.2em] uppercase text-charcoal/70 group-hover:text-charcoal transition-colors duration-300">
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
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-colors duration-400"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
