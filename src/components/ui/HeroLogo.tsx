'use client';

import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Logo layout from the visiting card — 3 rows × 2 columns:
 *  Row 0:  M   A
 *  Row 1:  Y   O
 *  Row 2:  V   A
 *
 * Individual transparent PNGs scatter in → assemble into grid → scatter out on scroll.
 */
const logoLetters = [
  { id: 'logo-m', src: '/images/logo/M.png', alt: 'M' },
  { id: 'logo-a1', src: '/images/logo/A.png', alt: 'A' },
  { id: 'logo-y', src: '/images/logo/Y.png', alt: 'Y' },
  { id: 'logo-o', src: '/images/logo/O.png', alt: 'O' },
  { id: 'logo-v', src: '/images/logo/V.png', alt: 'V' },
  { id: 'logo-a2', src: '/images/logo/A.png', alt: 'A' },
];

const GRID = [
  { row: 0, col: 0 }, { row: 0, col: 1 },
  { row: 1, col: 0 }, { row: 1, col: 1 },
  { row: 2, col: 0 }, { row: 2, col: 1 },
];

/* Scatter distances scale with screen size */
function getScattered(mobile: boolean) {
  const s = mobile ? 0.5 : 1;
  return [
    { x: -420 * s, y: -340 * s, rot: -35, scale: 0.35 },
    { x: 400 * s, y: -380 * s, rot: 28, scale: 0.4 },
    { x: -360 * s, y: 50 * s, rot: 40, scale: 0.3 },
    { x: 450 * s, y: 80 * s, rot: -30, scale: 0.45 },
    { x: -400 * s, y: 340 * s, rot: 22, scale: 0.35 },
    { x: 420 * s, y: 360 * s, rot: -38, scale: 0.4 },
  ];
}

function getScatterOut(mobile: boolean) {
  const s = mobile ? 0.5 : 1;
  return [
    { x: -900 * s, y: -700 * s, rot: -60, scale: 0.15 },
    { x: 850 * s, y: -750 * s, rot: 50, scale: 0.2 },
    { x: -800 * s, y: 140 * s, rot: 65, scale: 0.1 },
    { x: 900 * s, y: 170 * s, rot: -55, scale: 0.15 },
    { x: -850 * s, y: 700 * s, rot: 40, scale: 0.15 },
    { x: 880 * s, y: 720 * s, rot: -65, scale: 0.1 },
  ];
}

/* All service categories from the visiting card */
const services = [
  { label: 'Architecture', href: '/projects/architecture' },
  { label: 'Interior', href: '/projects/interior' },
  { label: 'Landscaping', href: '/projects/landscape' },
  { label: 'Product Designing', href: '/projects/architecture' },
];

interface HeroLogoProps {
  onReady: () => void;
}

// Use useLayoutEffect on client, useEffect on server to avoid Next.js warnings
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function HeroLogo({ onReady }: HeroLogoProps) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const assemblyDone = useRef(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useIsomorphicLayoutEffect(() => {
    setReady(true);
  }, []);

  // Assembly animation — letters scatter in from random positions to form the grid
  useIsomorphicLayoutEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      const shapes = shapeRefs.current.filter(Boolean) as HTMLDivElement[];
      const textEl = textRef.current;
      const servicesEl = servicesRef.current;
      if (shapes.length === 0) return;

      const mobile = window.innerWidth < 768;
      const SCATTERED = getScattered(mobile);

      // Set scattered starting positions IMMEDIATELY before paint
      shapes.forEach((el, i) => {
        gsap.set(el, {
          x: SCATTERED[i].x,
          y: SCATTERED[i].y,
          rotation: SCATTERED[i].rot,
          scale: SCATTERED[i].scale,
          opacity: 0,
        });
      });

      if (textEl) gsap.set(textEl, { opacity: 0, y: 25 });
      if (servicesEl) gsap.set(servicesEl, { opacity: 0, y: 15 });

      // Assembly timeline
      const tl = gsap.timeline({
        delay: 0.1, // Minimal delay for LCP optimization
        onComplete: () => {
          assemblyDone.current = true;
          onReadyRef.current();
        },
      });

      tl.to(shapes, {
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0);

      shapes.forEach((el, i) => {
        tl.to(el, {
          x: 0, y: 0, rotation: 0, scale: 1,
          duration: 1.8,
          ease: 'power3.inOut',
        }, 0.1 + i * 0.12);
      });

      if (textEl) {
        tl.to(textEl, {
          opacity: 1, y: 0,
          duration: 1.0,
          ease: 'power2.out',
        }, '-=0.6');
      }

      if (servicesEl) {
        tl.to(servicesEl, {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4');
      }
    });

    return () => ctx.revert();
  }, [ready]);

  // Scroll scatter — letters fly away as user scrolls down
  useIsomorphicLayoutEffect(() => {
    if (!ready) return;

    let ctx: gsap.Context | null = null;
    const check = setInterval(() => {
      if (!assemblyDone.current) return;
      clearInterval(check);

      requestAnimationFrame(() => {
        const trigger = document.getElementById('hero-logo-trigger') || document.body;

        ctx = gsap.context(() => {
          const shapes = shapeRefs.current.filter(Boolean) as HTMLDivElement[];
          const textEl = textRef.current;
          const servicesEl = servicesRef.current;
          const mobile = window.innerWidth < 768;
          const SCATTER_OUT = getScatterOut(mobile);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 2.5,
            },
          });

          // Scatter all letters out simultaneously
          shapes.forEach((el, i) => {
            tl.to(el, {
              x: SCATTER_OUT[i].x,
              y: SCATTER_OUT[i].y,
              rotation: SCATTER_OUT[i].rot,
              scale: SCATTER_OUT[i].scale,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.inOut',
            }, 0);
          });

          // Fade out text + services
          if (textEl) {
            tl.to(textEl, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 0);
          }
          if (servicesEl) {
            tl.to(servicesEl, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in' }, 0);
          }
        });
      });
    }, 200);

    return () => { clearInterval(check); if (ctx) ctx.revert(); };
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pointer-events-none"
      style={{ paddingBottom: '2vh' }}
    >
      {/* Logo Grid — 6 individual characters */}
      <div
        className="relative logo-grid"
        style={{
          width: 'calc(2 * var(--cell) + var(--gap))',
          height: 'calc(3 * var(--cell) + 2 * var(--gap))',
        } as React.CSSProperties}
      >
        {logoLetters.map((letter, i) => (
          <div
            key={letter.id}
            ref={(el) => { shapeRefs.current[i] = el; }}
            className="absolute will-change-transform opacity-0"
            style={{
              left: `calc(${GRID[i].col} * (var(--cell) + var(--gap)))`,
              top: `calc(${GRID[i].row} * (var(--cell) + var(--gap)))`,
              width: 'var(--cell)',
              height: 'var(--cell)',
            }}
          >
            <Image
              src={letter.src}
              alt={letter.alt}
              fill
              className="w-full h-full object-contain"
              priority
              quality={90}
              sizes="(max-width: 768px) 75px, 130px"
            />
          </div>
        ))}
      </div>

      {/* Company Name + Tagline */}
      <div
        ref={textRef}
        className="mt-4 flex flex-col items-center"
        style={{ opacity: 0 }}
      >
        <h1
          className="font-serif text-xl md:text-2xl lg:text-3xl tracking-[0.3em] uppercase text-center"
          style={{ color: '#E60012' }}
        >
          MAYOVA ARCHITECTS
        </h1>
        <p className="font-sans text-[11px] md:text-xs tracking-[0.25em] text-charcoal/60 mt-1">
          Created To Create
        </p>
      </div>

      {/* Service Categories — what we offer */}
      <div
        ref={servicesRef}
        className="mt-8 flex flex-col items-center pointer-events-auto"
        style={{ opacity: 0 }}
      >
        <div className="w-12 h-px bg-charcoal/20 mb-4" />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:gap-x-8">
          {services.map((service, i) => (
            <span key={service.label} className="flex items-center gap-5 md:gap-8">
              <Link
                href={service.href}
                className="font-sans text-[11px] md:text-[13px] tracking-[0.2em] uppercase text-charcoal/70 hover:text-charcoal transition-colors duration-500 font-medium"
              >
                {service.label}
              </Link>
              {i < services.length - 1 && (
                <span className="text-charcoal/20 text-sm hidden md:inline">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
