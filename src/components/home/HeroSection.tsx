'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Search, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.5 },
  },
};

const wordVariants: Variants = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(6px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 1.0, ease: 'easeOut' },
  },
};

const searchVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: 1.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const searchModes = t.hero.searchModes as readonly string[];
  const [searchMode, setSearchMode] = useState(searchModes[0]);
  const [query, setQuery] = useState('');

  // Keep searchMode in sync when language changes
  const currentModeIndex = searchModes.indexOf(searchMode);
  const resolvedMode = currentModeIndex >= 0 ? searchMode : searchModes[0];

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.55, 0.8]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // GSAP for reveal text effect on scroll-enter (letter-by-letter secondary effect)
  useGSAP(() => {
    gsap.from('.hero-badge', {
      opacity: 0,
      y: -20,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`${ROUTES.bazar}?nome=${encodeURIComponent(query)}&modo=${resolvedMode}`);
  }

  const heroWords = t.hero.words as readonly string[];

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* ── Video / image background ── */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/assets/hero-fallback.jpg"
          aria-hidden="true"
        >
          <source src="/assets/hero.webm" type="video/webm" />
        </video>
      </motion.div>

      {/* ── Gradient overlay ── */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-r from-wood-900 via-wood-900/70 to-wood-800/30"
      />
      {/* Bottom fade into site */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-sand-50 to-transparent" />

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 h-full flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          {/* Badge */}
          <motion.div
            className="hero-badge mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse-slow" />
            <span className="text-sand-200 text-xs font-medium tracking-widest uppercase">
              {t.hero.badge}
            </span>
          </motion.div>

          {/* H1 — Text Reveal */}
          <motion.div
            key={t.hero.words.join('-')}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-x-4 gap-y-0 mb-6"
          >
            {heroWords.map((word, i) => (
              <div key={`${word}-${i}`} className="text-reveal-wrapper">
                <motion.span
                  variants={wordVariants}
                  className={cn(
                    'inline-block font-serif leading-tight',
                    'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
                    i === 4 || i === 5 ? 'text-terracotta-400' : 'text-sand-50',
                  )}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            className="text-sand-300 text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* ── Semantic Search ── */}
          <motion.div
            variants={searchVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            {/* Mode selector tabs */}
            <div className="flex gap-1 mb-3">
              {searchModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSearchMode(mode)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300',
                    resolvedMode === mode
                      ? 'bg-terracotta-600 text-sand-50'
                      : 'bg-white/20 text-sand-200 hover:bg-white/30',
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Search input */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl glass">
                <Search strokeWidth={1.25} className="w-4 h-4 text-wood-500 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder.replace('{mode}', resolvedMode.toLowerCase())}
                  className="flex-1 bg-transparent text-wood-900 placeholder:text-wood-400 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className={cn(
                  'px-6 py-3.5 rounded-2xl bg-terracotta-600 text-sand-50 font-medium text-sm',
                  'hover:bg-terracotta-700 transition-all duration-300 ease-organic',
                  'hover:scale-[1.02] active:scale-[0.98]',
                )}
              >
                {t.hero.searchBtn}
              </button>
            </form>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-sand-400 text-xs tracking-widest uppercase">{t.hero.scroll}</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown strokeWidth={1.0} className="w-5 h-5 text-sand-400" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
