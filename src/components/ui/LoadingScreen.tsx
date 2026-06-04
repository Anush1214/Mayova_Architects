'use client';

import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <LazyMotion features={domAnimation}>
    <AnimatePresence>
      {isLoading && (
        <m.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-end pb-16 bg-transparent pointer-events-none"
        >
          {/* Subtle bottom tagline that fades away */}
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-[9px] tracking-mega-wide uppercase text-stone"
          >
            MAYOVA Architects
          </m.p>
        </m.div>
      )}
    </AnimatePresence>
    </LazyMotion>
  );
}

