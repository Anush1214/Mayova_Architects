'use client';

import Image from 'next/image';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Footer from '@/components/ui/Footer';
import Sidebar from '@/components/ui/Sidebar';
import { teamMembers } from '@/data/siteData';



export default function About() {
  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-cream">
      <Sidebar />

      <PageHeader
        title="About"
        subtitle="At MAYOVA, we believe meaningful architecture emerges from a deep understanding of people, place, and purpose. Every project begins with a conversation and evolves into a space that balances beauty, functionality, and lasting value."
      />

      {/* About Company */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mb-6">
                Our Story
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-charcoal leading-tight mb-8">
                Founded on the belief that every space carries a story{' '}
                <span className="italic text-stone-dark">
                  waiting to be told.
                </span>
              </h2>
              <p className="font-sans text-base text-stone-dark leading-relaxed">
                MAYOVA was born from a shared vision of reimagining the way people experience space. 
                Rooted in thoughtful design and careful craftsmanship, our work spans architecture, 
                interiors, and design-build projects, each shaped by the unique aspirations of its users.
                
                
                Whether designing a home, a workplace, or a commercial environment, we approach every project with 
                curiosity, creativity, and attention to detail. We believe great design is not only seen—it is felt 
                through the experiences it creates and the stories it allows people to live.
              </p>
            </m.div>
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-end"
            >
              <div className="grid grid-cols-2 gap-8 w-full">
                <div>
                  {/* <p className="font-serif text-5xl text-charcoal"></p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Projects Completed
                  </p> */}
                </div>
                <div>
                  {/* <p className="font-serif text-5xl text-charcoal">12</p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Awards Won
                  </p> */}
                </div>
                {/* <div>
                  <p className="font-serif text-5xl text-charcoal">3</p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Global Studios
                  </p>
                </div> */}
                {/* <div>
                  <p className="font-serif text-5xl text-charcoal">35</p>
                  <p className="font-sans text-[10px] tracking-ultra-wide uppercase text-stone mt-2">
                    Team Members
                  </p>
                </div> */}
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Team / Founders */}
      <section id="team" className="py-10 lg:py-16 bg-cream-dark">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <m.div
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
          </m.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image Side - Single Portrait */}
            <m.div
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
            </m.div>

            {/* Bios Side */}
            <div className="flex flex-col gap-12 lg:gap-16 lg:pt-12">
              {teamMembers.map((member, i) => (
                <m.div
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
                  <p className="font-sans text-base text-stone-dark leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-stone-dark hover:text-warm-gold transition-all duration-300 hover:scale-110"
                      aria-label={`${member.name} LinkedIn Profile`}
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
                  )}
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <m.div
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
          </m.div>

          <div className="max-w-3xl">
            <m.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="font-serif text-3xl lg:text-5xl text-charcoal leading-tight mb-10"
            >
              Every space{' '}
              <span className="italic text-stone-dark">tells a story</span> —
              our role is to shape its setting.
            </m.h2>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-sans text-base text-stone-dark leading-relaxed"
            >
              We approach each project with curiosity, care, and a commitment to meaningful
              design. By understanding the unique aspirations of our clients and the character 
              of each site, we create architecture that feels timeless, purposeful, and deeply 
              connected to its users.
            </m.p>
          </div>
        </div>
      </section>



      <Footer />
    </div>
    </LazyMotion>
  );
}
