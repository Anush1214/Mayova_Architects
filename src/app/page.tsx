'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import LenisProvider from '@/components/providers/LenisProvider';
import Sidebar from '@/components/ui/Sidebar';
import LoadingScreen from '@/components/ui/LoadingScreen';
import HeroLogo from '@/components/ui/HeroLogo';
import ScrollContainer from '@/components/sections/ScrollContainer';
import Footer from '@/components/ui/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSceneReady = useCallback(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <LenisProvider>
      <LoadingScreen isLoading={isLoading} />
      <Sidebar />

      {/* Subtle architectural background behind the logo */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
          unoptimized
        />
        {/* Gradient overlay to soften edges */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, var(--color-cream) 75%)',
          }}
        />
      </div>

      {/* 2D Logo Animation (fixed, above background) */}
      <HeroLogo onReady={handleSceneReady} />

      {/* Scrollable Content */}
      <main className="relative z-40">
        <ScrollContainer ref={scrollContainerRef} />
        <Footer />
      </main>
    </LenisProvider>
  );
}
