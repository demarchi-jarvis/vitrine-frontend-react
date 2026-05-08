import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProdutoById } from '@/lib/api/produto';
import { formatBRL } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { AddToCartButton } from '@/components/produto/AddToCartButton';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

async function getToken(): Promise<string> {
  const store = await cookies();
  return store.get('authToken')?.value ?? '';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const token = await getToken();
  const produto = await getProdutoById(id, token).catch(() => null);
  if (!produto) return { title: 'Produto não encontrado' };
  return {
    title: `${produto.nome} — Vitrine do Artesanato`,
    description: produto.descricao || `Peça artesanal: ${produto.nome}`,
    openGraph: {
      title: produto.nome,
      description: produto.descricao,
      images: [produto.imagem],
    },
  };
}

export default async function DetalhesProdutoPage({ params }: Props) {
  const { id } = await params;
  const token = await getToken();
  const produto = await getProdutoById(id, token).catch(() => null);

  if (!produto) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produto.nome,
    description: produto.descricao,
    image: produto.imagem,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: produto.preco,
      availability: produto.quantidade > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    ...(produto.autor ? {
      brand: { '@type': 'Brand', name: produto.autor.nome },
    } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Back */}
          <Link
            href={ROUTES.bazar}
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft strokeWidth={1.25} className="w-4 h-4" />
            Voltar ao bazar
          </Link>

          {/* md breakpoint for tablet — not just lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface">
              <Image
                src={produto.imagem || '/assets/placeholder-produto.svg'}
                alt={produto.nome}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
              />
              {produto.categoria && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium uppercase tracking-wide">
                  {produto.categoria.nome}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {produto.autor && (
                <Link
                  href={ROUTES.loja(produto.autor.email)}
                  className="flex items-center gap-2.5 mb-4 group w-fit"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-surface">
                    {produto.autor.foto && (
                      <Image src={produto.autor.foto} alt={produto.autor.nome} fill className="object-cover" sizes="36px" />
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                    por {produto.autor.nome}
                  </span>
                </Link>
              )}

              <h1 className="font-serif text-foreground text-3xl sm:text-4xl font-semibold leading-tight mb-3">
                {produto.nome}
              </h1>

              {produto.descricao && (
                <p className="text-muted-foreground text-base leading-relaxed mb-6">{produto.descricao}</p>
              )}

              <div className="flex items-end gap-3 mb-6">
                <span className="text-primary font-semibold text-3xl">
                  {formatBRL(produto.preco)}
                </span>
                <span className="text-muted-foreground text-sm pb-1">
                  {produto.quantidade > 0 ? `${produto.quantidade} disponíveis` : 'Sem estoque'}
                </span>
              </div>

              <div className="border-t border-border pt-6 mt-auto">
                <AddToCartButton produto={produto} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
