'use client';

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCarrinhoStore } from '@/store/carrinho.store';
import { ROUTES } from '@/lib/routes';
import type { Produto } from '@/types';

interface AddToCartButtonProps {
  produto: Produto;
}

export function AddToCartButton({ produto }: AddToCartButtonProps) {
  const adicionar = useCarrinhoStore((s) => s.adicionar);
  const router = useRouter();

  function handleClick() {
    if (produto.quantidade <= 0) return;
    adicionar(produto);
    toast.success(`${produto.nome} adicionado ao carrinho!`);
    router.push(ROUTES.carrinho);
  }

  const disabled = produto.quantidade <= 0;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
        disabled
          ? 'bg-sand-200 text-wood-400 cursor-not-allowed'
          : 'bg-terracotta-600 text-sand-50 hover:bg-terracotta-700 active:scale-[0.98]'
      }`}
    >
      <ShoppingCart strokeWidth={1.25} className="w-5 h-5" />
      {disabled ? 'Sem estoque' : 'Adicionar ao carrinho'}
    </button>
  );
}
