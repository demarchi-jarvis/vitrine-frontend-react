import { Suspense } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { BentoGrid } from '@/components/home/BentoGrid';
import { CategoriesStrip } from '@/components/home/CategoriesStrip';
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

// Revalidate every 5 minutes for fresh featured products
export const revalidate = 300;

async function FeaturedGrid() {
  const { content } = await getProdutos({ size: 7 }).catch(() => ({ content: [] }));
  return <BentoGrid produtos={content} />;
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Featured products section */}
      <section className="py-20 container mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-2">
              Em destaque
            </p>
            <h2 className="font-serif text-wood-900 text-3xl sm:text-4xl font-semibold leading-tight">
              Peças Selecionadas
            </h2>
          </div>
          <a
            href="/bazar"
            className="text-wood-600 text-sm hover:text-terracotta-600 transition-colors underline underline-offset-4"
          >
            Ver tudo
          </a>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-12 gap-4 auto-rows-[280px]">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`skeleton rounded-3xl ${
                    i === 0 ? 'col-span-7 row-span-2' : i < 3 ? 'col-span-5' : 'col-span-4'
                  }`}
                />
              ))}
            </div>
          }
        >
          <FeaturedGrid />
        </Suspense>
      </section>

      {/* About teaser */}
      <section className="py-20 bg-wood-900">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-4">
            Nossa história
          </p>
          <h2 className="font-serif text-sand-50 text-3xl sm:text-4xl font-semibold max-w-2xl mx-auto leading-tight">
            Tradição que se transmite, arte que conecta
          </h2>
          <p className="text-wood-300 text-base mt-6 max-w-xl mx-auto leading-relaxed">
            O Vale do Café guarda séculos de história e técnica. Aqui, cada peça tem nome, tem rosto,
            tem origem. Conheça os artesãos que mantêm essa herança viva.
          </p>
          <a
            href="/quem-somos"
            className="inline-block mt-8 px-8 py-3 rounded-full border border-sand-200/30 text-sand-100 text-sm hover:bg-sand-50/10 transition-colors"
          >
            Conhecer mais
          </a>
        </div>
      </section>
    </>
  );
}
