import type { Metadata } from 'next';
import { ProdutoForm } from '@/components/produto/ProdutoForm';

export const metadata: Metadata = {
  title: 'Editar Produto — Vitrine do Artesanato',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-2">
          Editar peça
        </p>
        <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-8">
          Editar produto
        </h1>
        <ProdutoForm produtoId={id} />
      </div>
    </div>
  );
}
