'use client';

import { useCarrinhoStore } from '@/store/carrinho.store';

const FRETE = 9.99;

export function useCarrinho() {
  const store = useCarrinhoStore();
  const total = store.subtotal() + FRETE;
  return { ...store, frete: FRETE, total };
}
