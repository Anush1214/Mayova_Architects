'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import { newsItems, NewsItem } from '@/data/siteData';

type TabKey = 'all' | 'news' | 'awards' | 'events';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'news', label: 'News' },
  { key: 'awards', label: 'Awards' },
  { key: 'events', label: 'Events' },
];

export default function News() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered =
    activeTab === 'all'
      ? newsItems
      : newsItems.filter((item) => item.category === activeTab);

  return (
    <div className="min-h-screen bg-cream">

      <PageHeader
        title="News"
        subtitle="Updates, awards, and events from the world of Mayova Architects."
      />

      {/* Tabs */}
      <section className="pb-8">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={`news-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`font-sans text-[11px] tracking-ultra-wide uppercase pb-2 border-b-2 transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'text-charcoal border-warm-gold'
                    : 'text-stone border-transparent hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {filtered.map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="font-sans text-sm text-stone text-center py-20">
              No items in this category yet.
            </p>
          )}
        </div>
      </section>

      <div className="h-20" />
      <Footer />
    </div>
  );
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="overflow-hidden mb-5">
        <Image
          src={item.imagePath}
          alt={item.title}
          width={600}
          height={400}
          className="w-full h-[240px] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-sans text-[9px] tracking-ultra-wide uppercase text-warm-gold">
          {item.category}
        </span>
        <span className="text-stone/30">&middot;</span>
        <span className="font-sans text-[9px] tracking-ultra-wide uppercase text-stone">
          {item.date}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl text-charcoal mb-2 group-hover:text-stone-dark transition-colors duration-300 leading-snug">
        {item.title}
      </h3>

      {/* Excerpt */}
      <p className="font-sans text-xs text-stone-dark leading-relaxed">
        {item.excerpt}
      </p>
    </motion.article>
  );
}
