'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-32 pb-10 lg:pt-40 lg:pb-14">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center gap-2 mb-8"
        >
          <Link
            href="/"
            className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone hover:text-charcoal transition-colors duration-300"
          >
            Home
          </Link>
          <span className="text-stone/40 text-xs">/</span>
          <span className="font-sans text-[10px] tracking-ultra-wide uppercase text-charcoal">
            {title}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-5xl lg:text-7xl text-charcoal tracking-wide"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-sans text-base text-stone-dark mt-6 max-w-xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-px bg-warm-beige mt-12 origin-left"
        />
      </div>
    </header>
  );
}
