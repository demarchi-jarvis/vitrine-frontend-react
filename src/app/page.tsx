import { Suspense } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { BentoGrid } from '@/components/home/BentoGrid';
import { HomeSections } from '@/components/home/HomeSections';
import { getProdutos } from '@/lib/api/produto';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vitrine do Artesanato — Arte do Vale do Café',
  description:
    'Marketplace de artesãos do Vale do Café. Descubra peças únicas feitas à mão por artesãos de Vassouras e região.',
  openGraph: {
    title: 'Vitrine do Artesanato',
    description: 'Peças únicas feitas à mão por artesãos do Vale do Café, RJ.',
    images: ['/assets/og-home.jpg'],
  },
};

export const revalidate = 300;

async function FeaturedGrid() {
  const { content } = await getProdutos({ size: 7 }).catch(() => ({ content: [] }));
  return <BentoGrid produtos={content} />;
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* ── Peças em Destaque (BentoGrid tem seu próprio header) ─── */}
      <Suspense
        fallback={
          <div className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-4 auto-rows-[280px]">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`skeleton rounded-3xl ${
                    i === 0 ? 'col-span-12 md:col-span-7 row-span-2' : i < 3 ? 'col-span-12 md:col-span-5' : 'col-span-12 md:col-span-4'
                  }`}
                />
              ))}
            </div>
          </div>
        }
      >
        <FeaturedGrid />
      </Suspense>

      {/* ── Como Funciona + Story + CTA ───────────────────────────── */}
      <HomeSections />
    </>
  );
}
