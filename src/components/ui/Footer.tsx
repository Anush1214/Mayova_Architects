'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
}

function ExpandableSection({ title, children }: ExpandableProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-cream/10 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group cursor-pointer"
      >
        <span className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone group-hover:text-cream transition-colors duration-300">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-stone text-lg leading-none"
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="pt-4 space-y-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

const MAPS_URL = "https://maps.google.com/maps?q=1st%20floor,%20Mayova%20Architects%20Gowri%20Arcade,%20Bananje,%20Brahmagiri,%20Udupi,%20Karnataka%20576101,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed";

function LazyMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading 200px before visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-1 w-full h-[300px] lg:h-auto min-h-[300px] rounded-lg overflow-hidden border border-cream/10 relative group mt-8 lg:mt-0"
    >
      <div className="absolute inset-0 bg-off-black/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none z-10" />
      {isVisible ? (
        <iframe
          src={MAPS_URL}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="MAYOVA Architects office location on Google Maps"
          className="absolute inset-0 w-full h-full grayscale invert opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-[filter,opacity] duration-700 ease-in-out"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-off-black/40 flex items-center justify-center">
          <span className="font-sans text-[10px] tracking-ultra-wide uppercase text-cream/40">
            Loading map…
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function Footer() {
  const [isFading, setIsFading] = useState(false);

  const scrollToTop = useCallback(() => {
    // Fade out
    setIsFading(true);
    setTimeout(() => {
      // Instant jump — bypasses every GSAP-pinned project section
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Fade back in
      setTimeout(() => setIsFading(false), 80);
    }, 400);
  }, []);

  return (
    <>
      {/* Page-level fade overlay */}
      <AnimatePresence>
        {isFading && (
          <motion.div
            key="back-to-top-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] bg-off-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      <footer
        id="contact"
        className="relative bg-off-black text-cream"
      >
      {/* Main Content */}
      <div className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
            <div className="flex-1 lg:max-w-xl">
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-serif text-4xl lg:text-5xl tracking-wide text-cream leading-tight mb-16"
              >
                Created
                <br />
                To Create.
              </motion.h2>

              {/* Expandable Sections — per workflow: Email +, Socials +, Office + */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="space-y-4"
              >
                <ExpandableSection title="Email">
                  <a
                    href="mailto:vigneshvrao@mayovaarchitect.com"
                    className="block font-sans text-sm text-cream/80 hover:text-warm-gold transition-colors duration-500"
                  >
                    vigneshvrao@mayovaarchitect.com
                  </a>
                  <a
                    href="https://www.mayovaarchitect.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-sans text-sm text-cream/80 hover:text-warm-gold transition-colors duration-500"
                  >
                    www.mayovaarchitect.com
                  </a>
                </ExpandableSection>

                <ExpandableSection title="Socials">
                  <div className="flex items-center gap-5 pt-2">
                    <a
                      href="https://www.instagram.com/mayova_architects"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream/80 hover:text-warm-gold hover:scale-110 transition-all duration-300"
                      aria-label="Instagram Profile"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/mayova-architects/?originalSubdomain=in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream/80 hover:text-warm-gold hover:scale-110 transition-all duration-300"
                      aria-label="LinkedIn Profile"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Office">
                  <p className="font-sans text-sm text-cream/80">
                    Gowri Arcade, 1st Floor
                  </p>
                  <p className="font-sans text-sm text-cream/80">
                    Shiribeedu, Udupi - 576101
                  </p>
                  <p className="font-sans text-sm text-cream/80">
                    Karnataka, India
                  </p>
                  <p className="font-sans text-sm text-cream/80 mt-2">
                    +91 77958-90714
                  </p>
                </ExpandableSection>
              </motion.div>
            </div>

            {/* Map Preview — lazy loaded via IntersectionObserver */}
            <LazyMap />
          </div>

          {/* Services bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 pt-8 border-t border-cream/10"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
              {['Architecture', 'Interior', 'Landscaping', 'Product Designing'].map((service, i) => (
                <span key={service} className="flex items-center gap-4 lg:gap-8">
                  <span className="font-sans text-sm lg:text-base text-cream/50 tracking-wider">
                    {service}
                  </span>
                  {i < 3 && (
                    <span className="text-cream/20">|</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* BACK TO TOP button — per workflow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex justify-center relative z-[60]"
          >
            <button
              onClick={scrollToTop}
              className="nav-link relative z-[60] px-6 py-3 rounded-full group flex items-center gap-3 font-sans text-[11px] tracking-ultra-wide uppercase text-cream/60 hover:text-warm-gold transition-colors duration-500 cursor-pointer"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
              Back To Top
            </button>
          </motion.div>
        </div>
      </div>

      {/* Giant MAYOVA Text at Bottom */}
      <div className="relative overflow-hidden pb-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="max-w-[1400px] mx-auto px-8 lg:px-12"
        >
          <h2 className="font-serif text-[12vw] lg:text-[14vw] text-cream/[0.06] leading-none tracking-wider select-none uppercase">
            MAYOVA
          </h2>
        </motion.div>
      </div>
    </footer>
    </>
  );
}
