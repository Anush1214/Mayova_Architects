'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title: string;
  category?: string;
  year?: string;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
  category,
  year,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure we only use portals on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync index when initialIndex changes or lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Disable body scroll and signal to Navbar/Cursor to hide
      document.body.style.overflow = 'hidden';
      document.body.classList.add('lightbox-open');
    } else {
      document.body.classList.remove('lightbox-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    };
  }, [isOpen, initialIndex]);

  // Center the active thumbnail in the viewport
  useEffect(() => {
    if (!isOpen || !images || images.length === 0) return;
    const container = thumbnailContainerRef.current;
    if (!container) return;
    const activeChild = container.children[currentIndex] as HTMLElement;
    if (!activeChild) return;

    const containerWidth = container.clientWidth;
    const childOffset = activeChild.offsetLeft;
    const childWidth = activeChild.clientWidth;

    container.scrollTo({
      left: childOffset - containerWidth / 2 + childWidth / 2,
      behavior: 'smooth',
    });
  }, [currentIndex, isOpen, images]);

  const handleNext = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !images || images.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images, isOpen, onClose]);

  if (!isOpen || !images || images.length === 0) return null;
  if (!mounted) return null;

  const activeImage = images[currentIndex];

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-md flex flex-col justify-between select-none"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between px-6 sm:px-10 py-6 text-cream z-10">
            <div>
              <span className="font-sans text-[9px] tracking-mega-wide uppercase text-warm-gold block mb-1">
                {category} {year ? `· ${year}` : ''}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl tracking-wide">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/5 border border-cream/15 text-cream hover:bg-cream hover:text-charcoal hover:border-cream transition-all duration-300 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <span className="text-sm">✕</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="relative flex-grow flex items-center justify-center px-4 sm:px-12 md:px-20 min-h-0">
            {/* Prev Arrow */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-cream/5 border border-cream/10 text-cream hover:bg-cream hover:text-charcoal hover:border-cream transition-all duration-300 cursor-pointer animate-fade-in-up"
                aria-label="Previous image"
              >
                <span className="text-lg">←</span>
              </button>
            )}

            {/* Image Slider Wrapper */}
            <div className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 80) {
                      handlePrev();
                    } else if (info.offset.x < -80) {
                      handleNext();
                    }
                  }}
                  className="relative w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                >
                  <div className="relative w-full h-full max-w-[85vw] max-h-full">
                    <Image
                      src={activeImage}
                      alt={`${title} - image ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="90vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Arrow */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-cream/5 border border-cream/10 text-cream hover:bg-cream hover:text-charcoal hover:border-cream transition-all duration-300 cursor-pointer animate-fade-in-up"
                aria-label="Next image"
              >
                <span className="text-lg">→</span>
              </button>
            )}
          </div>

          {/* Footer with thumbnails and index */}
          <div className="w-full py-6 flex flex-col items-center gap-4 text-cream bg-gradient-to-t from-charcoal to-transparent">
            {/* Slide Index */}
            <div className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone">
              <span className="text-cream font-medium">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="mx-2 text-stone/40">/</span>
              <span>{String(images.length).padStart(2, '0')}</span>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div
                ref={thumbnailContainerRef}
                className="flex items-center gap-2 max-w-[85vw] overflow-x-auto py-2 px-4 scrollbar-hide"
              >
                {images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex-shrink-0 w-14 h-10 overflow-hidden transition-all duration-300 border cursor-pointer ${
                      index === currentIndex
                        ? 'border-warm-gold scale-105 opacity-100 shadow-lg'
                        : 'border-transparent opacity-40 hover:opacity-75 hover:scale-102'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(lightboxContent, document.body);
}
