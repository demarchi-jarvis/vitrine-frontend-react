'use client';

import Link from 'next/link';
import { Search, ShoppingBag, Star, Shield } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export function HomeSections() {
  const { t } = useTranslation();

  const COMO_FUNCIONA = [
    {
      icon: Search,
      step: '01',
      title: t.home.step1.title,
      desc: t.home.step1.desc,
    },
    {
      icon: Star,
      step: '02',
      title: t.home.step2.title,
      desc: t.home.step2.desc,
    },
    {
      icon: ShoppingBag,
      step: '03',
      title: t.home.step3.title,
      desc: t.home.step3.desc,
    },
  ];

  const DIFERENCIAIS = [
    {
      icon: Shield,
      title: t.home.trust1.title,
      desc: t.home.trust1.desc,
    },
    {
      icon: Star,
      title: t.home.trust2.title,
      desc: t.home.trust2.desc,
    },
    {
      icon: ShoppingBag,
      title: t.home.trust3.title,
      desc: t.home.trust3.desc,
    },
  ];

  return (
    <>
      {/* ── Como Funciona ─────────────────────────────────────────── */}
      <section className="py-20 bg-sand-100 dark:bg-wood-800 border-y border-sand-200 dark:border-wood-700">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-terracotta-600 dark:text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-3">
              {t.home.howBadge}
            </p>
            <h2 className="font-serif text-wood-900 dark:text-sand-50 text-3xl sm:text-4xl font-semibold">
              {t.home.howTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {COMO_FUNCIONA.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-wood-900 dark:bg-wood-700 flex items-center justify-center">
                    <Icon strokeWidth={1.25} className="w-7 h-7 text-sand-50" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-terracotta-600 text-sand-50 text-xs font-bold flex items-center justify-center">
                    {step.slice(1)}
                  </span>
                </div>
                <h3 className="font-serif text-wood-900 dark:text-sand-50 text-lg font-semibold mb-2">{title}</h3>
                <p className="text-wood-500 dark:text-sand-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/bazar"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-terracotta-600 text-sand-50 font-medium hover:bg-terracotta-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.home.howCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sobre / Trust ─────────────────────────────────────────── */}
      <section className="py-20 bg-wood-900 dark:bg-wood-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-4">
                {t.home.storyBadge}
              </p>
              <h2 className="font-serif text-sand-50 text-3xl sm:text-4xl font-semibold max-w-2xl mx-auto leading-tight">
                {t.home.storyTitle}
              </h2>
              <p className="text-wood-300 text-base mt-6 max-w-xl mx-auto leading-relaxed">
                {t.home.storyDesc}
              </p>
              <Link
                href="/quem-somos"
                className="inline-block mt-8 px-8 py-3 rounded-full border border-sand-200/30 text-sand-100 text-sm hover:bg-sand-50/10 transition-colors"
              >
                {t.home.storyCta}
              </Link>
            </div>

            {/* Diferenciais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 pt-12 border-t border-wood-800">
              {DIFERENCIAIS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-600/20 flex items-center justify-center flex-shrink-0">
                    <Icon strokeWidth={1.25} className="w-5 h-5 text-terracotta-400" />
                  </div>
                  <div>
                    <p className="text-sand-100 font-medium text-sm mb-1">{title}</p>
                    <p className="text-wood-400 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────────── */}
      <section className="py-16 bg-sand-50 dark:bg-wood-800 border-t border-sand-200 dark:border-wood-700">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-wood-900 dark:text-sand-50 text-2xl sm:text-3xl font-semibold mb-3">
            {t.home.artisanTitle}
          </h2>
          <p className="text-wood-500 dark:text-sand-300 text-sm mb-7 max-w-md mx-auto">
            {t.home.artisanDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registrar"
              className="px-8 py-3.5 rounded-full bg-terracotta-600 text-sand-50 font-medium hover:bg-terracotta-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.home.artisanCtaPrimary}
            </Link>
            <Link
              href="/quem-somos"
              className="px-8 py-3.5 rounded-full border border-wood-900/20 dark:border-sand-200/20 text-wood-900 dark:text-sand-100 font-medium hover:bg-sand-100 dark:hover:bg-wood-700 transition-colors duration-300"
            >
              {t.home.artisanCtaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
