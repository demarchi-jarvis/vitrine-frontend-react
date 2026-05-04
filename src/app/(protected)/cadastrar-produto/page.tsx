import type { Metadata } from 'next';
import { ProdutoForm } from '@/components/produto/ProdutoForm';

export const metadata: Metadata = {
  title: 'Cadastrar Produto — Vitrine do Artesanato',
};

export default function CadastrarProdutoPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-2">
          Nova peça
        </p>
        <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-8">
          Cadastrar produto
        </h1>
        <ProdutoForm />
      </div>
    </div>
  );
}
