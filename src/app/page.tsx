import { Suspense } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Star, Shield } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { BentoGrid } from '@/components/home/BentoGrid';
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

const COMO_FUNCIONA = [
  {
    icon: Search,
    step: '01',
    title: 'Explore o Bazar',
    desc: 'Navegue por centenas de peças únicas organizadas por categoria, técnica ou artesão.',
  },
  {
    icon: Star,
    step: '02',
    title: 'Escolha sua peça',
    desc: 'Cada produto tem nome de artesão, descrição e origem. Compra direta, sem intermediários.',
  },
  {
    icon: ShoppingBag,
    step: '03',
    title: 'Finalize com segurança',
    desc: 'Checkout simples, entrega rastreável e suporte via WhatsApp para qualquer dúvida.',
  },
];

const DIFERENCIAIS = [
  {
    icon: Shield,
    title: 'Compra protegida',
    desc: 'Pagamento seguro e garantia de autenticidade em todas as peças.',
  },
  {
    icon: Star,
    title: 'Artesãos verificados',
    desc: 'Todos os vendedores são cadastrados e validados pelo programa Vassouras Tec.',
  },
  {
    icon: ShoppingBag,
    title: 'Entrega para todo o Brasil',
    desc: 'Frete calculado por artesão. Acompanhe sua encomenda até a porta.',
  },
];

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

      {/* ── Como Funciona ─────────────────────────────────────────── */}
      <section className="py-20 bg-sand-100 border-y border-sand-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-3">
              Simples assim
            </p>
            <h2 className="font-serif text-wood-900 text-3xl sm:text-4xl font-semibold">
              Como funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {COMO_FUNCIONA.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-wood-900 flex items-center justify-center">
                    <Icon strokeWidth={1.25} className="w-7 h-7 text-sand-50" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-terracotta-600 text-sand-50 text-xs font-bold flex items-center justify-center">
                    {step.slice(1)}
                  </span>
                </div>
                <h3 className="font-serif text-wood-900 text-lg font-semibold mb-2">{title}</h3>
                <p className="text-wood-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/bazar"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-terracotta-600 text-sand-50 font-medium hover:bg-terracotta-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Explorar o bazar
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sobre / Trust ─────────────────────────────────────────── */}
      <section className="py-20 bg-wood-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-4">
                Nossa história
              </p>
              <h2 className="font-serif text-sand-50 text-3xl sm:text-4xl font-semibold max-w-2xl mx-auto leading-tight">
                Tradição que se transmite, arte que conecta
              </h2>
              <p className="text-wood-300 text-base mt-6 max-w-xl mx-auto leading-relaxed">
                O Vale do Café guarda séculos de história e técnica. Aqui, cada peça tem nome, tem
                rosto, tem origem. Conheça os artesãos que mantêm essa herança viva.
              </p>
              <Link
                href="/quem-somos"
                className="inline-block mt-8 px-8 py-3 rounded-full border border-sand-200/30 text-sand-100 text-sm hover:bg-sand-50/10 transition-colors"
              >
                Conhecer mais
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
      <section className="py-16 bg-sand-50 border-t border-sand-200">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-wood-900 text-2xl sm:text-3xl font-semibold mb-3">
            Você é artesão?
          </h2>
          <p className="text-wood-500 text-sm mb-7 max-w-md mx-auto">
            Cadastre seus produtos e alcance compradores em todo o Brasil sem taxas abusivas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registrar"
              className="px-8 py-3.5 rounded-full bg-terracotta-600 text-sand-50 font-medium hover:bg-terracotta-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/quem-somos"
              className="px-8 py-3.5 rounded-full border border-wood-900/20 text-wood-900 font-medium hover:bg-sand-100 transition-colors duration-300"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
