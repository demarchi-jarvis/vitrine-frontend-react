'use client';

import { useCarrinhoStore } from '@/store/carrinho.store';

export function useCarrinho() {
  const store = useCarrinhoStore();
  return { ...store, frete: 0, total: store.subtotal() };
}
