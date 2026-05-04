'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Produto } from '@/types';
import { ProdutoCard } from './ProdutoCard';
import { ProdutoCardSkeleton } from '@/components/ui/Skeleton';
import { useCarrinhoStore } from '@/store/carrinho.store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { toast } from 'sonner';

interface ProdutoGridProps {
  produtos: Produto[];
  loading?: boolean;
  showOwnerActions?: boolean;
  emptyMessage?: string;
}

export function ProdutoGrid({
  produtos,
  loading = false,
  showOwnerActions = false,
  emptyMessage = 'Nenhum produto encontrado.',
}: ProdutoGridProps) {
  const adicionar = useCarrinhoStore((s) => s.adicionar);
  const router = useRouter();

  function handleAdicionarCarrinho(produto: Produto) {
    adicionar(produto);
    toast.success(`${produto.nome} adicionado ao carrinho!`);
    // BUG-10 fix: usar router.push, não window.location
    router.push(ROUTES.carrinho);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProdutoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!produtos.length) {
    return (
      <div className="text-center py-24">
        <p className="text-wood-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <AnimatePresence mode="popLayout">
        {produtos.map((produto, i) => (
          <motion.div
            key={produto.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ProdutoCard
              produto={produto}
              showOwnerActions={showOwnerActions}
              onAdicionarCarrinho={showOwnerActions ? undefined : handleAdicionarCarrinho}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
