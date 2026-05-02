'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import Sidebar from '@/components/ui/Sidebar';
import { teamMembers } from '@/data/siteData';



export default function About() {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <PageHeader
        title="About"
        subtitle="At Mayova, we believe that great architecture emerges from the dialogue between light, material, and human experience."
      />

      {/* About Company */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mb-6">
                Our Story
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-charcoal leading-tight mb-8">
                Founded in 2018 by two architects who share a belief that{' '}
                <span className="italic text-stone-dark">
                  every space tells a story.
                </span>
              </h2>
              <p className="font-sans text-sm text-stone-dark leading-relaxed">
                From our studios in London, Tokyo, and Dubai, we work across
                scales and typologies — from private residences to cultural
                institutions, from interior renovations to urban master plans.
                What unites our work is an unwavering commitment to craft,
                context, and the poetics of space.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-end"
            >
              <div className="grid grid-cols-2 gap-8 w-full">
                <div>
                  <p className="font-serif text-5xl text-charcoal">48</p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Projects Completed
                  </p>
                </div>
                <div>
                  <p className="font-serif text-5xl text-charcoal">12</p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Awards Won
                  </p>
                </div>
                <div>
                  <p className="font-serif text-5xl text-charcoal">3</p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Global Studios
                  </p>
                </div>
                <div>
                  <p className="font-serif text-5xl text-charcoal">35</p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Team Members
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team / Founders */}
      <section id="team" className="py-16 lg:py-24 bg-cream-dark">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6 mb-16"
          >
            <div className="w-16 h-px bg-warm-gold" />
            <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone">
              Founding Partners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image Side - Single Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-warm-beige/30"
            >
              <Image 
                src="/images/about/portraits.jpg" 
                alt="Founders: Ar. Vignesh V Rao and Ar. Akash Shetty"
                fill
                className="object-cover"
                quality={75}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Bios Side */}
            <div className="flex flex-col gap-12 lg:gap-16 lg:pt-12">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <h3 className="font-serif text-3xl text-charcoal mb-2">
                    {member.name}
                  </h3>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-warm-gold mb-6">
                    {member.role}
                  </p>
                  <p className="font-sans text-sm text-stone-dark leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-sans text-sm text-stone-dark hover:text-warm-gold underline decoration-warm-gold/30 hover:decoration-warm-gold transition-colors duration-300"
                    >
                      Connect on LinkedIn
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6 mb-16"
          >
            <div className="w-16 h-px bg-warm-gold" />
            <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone">
              Philosophy
            </p>
          </motion.div>

          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="font-serif text-3xl lg:text-5xl text-charcoal leading-tight mb-10"
            >
              We design for{' '}
              <span className="italic text-stone-dark">the long now</span> —
              architecture that grows more meaningful with time.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-sans text-sm text-stone-dark leading-relaxed"
            >
              Our approach begins with listening — to the land, to the client, and
              to the story waiting to be told. We believe that the best architecture
              is born from restraint, not excess. Each project is an exercise in
              precision: finding the essential gesture that transforms a site,
              elevates a program, and creates lasting emotional resonance.
            </motion.p>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
