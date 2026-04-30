'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { num: '01', label: 'Projects', href: '/projects' },
  { num: '02', label: 'News', href: '/news' },
  { num: '03', label: 'About', href: '/about' },
  { num: '04', label: 'Contact', href: '#contact' },
];

const serviceLinks = [
  { label: 'Interior', href: '/projects/interior' },
  { label: 'Landscape', href: '/projects/landscape' },
  { label: 'Architecture', href: '/projects/architecture' },
];

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="fixed top-0 left-0 z-50 h-screen hidden lg:flex flex-col justify-between py-8 transition-all duration-700 ease-out"
        style={{
          width: hovered ? '240px' : '72px',
          backgroundColor: hovered ? 'rgba(250, 247, 242, 0.95)' : 'transparent',
          backdropFilter: hovered ? 'blur(20px)' : 'none',
          borderRight: hovered ? '1px solid rgba(0,0,0,0.04)' : '1px solid transparent',
        }}
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
              className="group flex items-center gap-3 py-2 rounded-md transition-all duration-300 text-charcoal/70 hover:text-charcoal"
            >
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase shrink-0 w-5 text-center opacity-70 group-hover:opacity-100 transition-opacity">
                {item.num}
              </span>
              <span
                className="font-sans text-[13px] tracking-[0.15em] uppercase transition-all duration-500"
                style={{
                  opacity: hovered ? 1 : 0,
                  width: hovered ? 'auto' : 0,
                  transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
                }}
              >
                {item.label}
              </span>
            </Link>
          ))}

          {/* Service sub-links */}
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mt-3 pt-3 border-t border-charcoal/5 flex flex-col gap-2"
            >
              {serviceLinks.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/50 hover:text-charcoal transition-colors duration-300 pl-8"
                >
                  {cat.label}
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
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-colors duration-300"
              >
                @mayova_architects
              </a>
              <span className="font-sans text-[10px] tracking-[0.15em] text-stone/40">
                Udupi, India
              </span>
            </motion.div>
          ) : (
            <span
              className="font-sans text-[9px] tracking-[0.3em] text-stone/40 uppercase"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Udupi
            </span>
          )}
        </div>
      </motion.aside>

      {/* ==================== MOBILE HAMBURGER BUTTON ==================== */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-6 right-6 z-[60] lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] cursor-pointer"
        aria-label="Toggle menu"
      >
        <motion.span
          animate={{
            rotate: mobileOpen ? 45 : 0,
            y: mobileOpen ? 7 : 0,
          }}
          className="block w-6 h-[1.5px] bg-charcoal origin-center transition-colors"
          style={{ backgroundColor: mobileOpen ? '#FAF7F2' : '#2C2C2C' }}
        />
        <motion.span
          animate={{ opacity: mobileOpen ? 0 : 1 }}
          className="block w-6 h-[1.5px] bg-charcoal"
        />
        <motion.span
          animate={{
            rotate: mobileOpen ? -45 : 0,
            y: mobileOpen ? -7 : 0,
          }}
          className="block w-6 h-[1.5px] bg-charcoal origin-center transition-colors"
          style={{ backgroundColor: mobileOpen ? '#FAF7F2' : '#2C2C2C' }}
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
            className="fixed inset-0 z-[55] lg:hidden flex flex-col justify-center items-center"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {/* Logo */}
            <div className="absolute top-6 right-5">
              <Image
                src="/images/logo/logo-full.png"
                alt="MAYOVA"
                width={36}
                height={54}
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col items-center gap-8">
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
