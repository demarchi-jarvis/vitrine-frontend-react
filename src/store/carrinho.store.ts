'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ItemCarrinho, Produto } from '@/types';

interface CarrinhoStore {
  itens: ItemCarrinho[];
  adicionar: (produto: Produto) => void;
  remover: (id: string) => void;
  atualizar: (id: string, quantidade: number) => void;
  limpar: () => void;
  totalItens: () => number;
  subtotal: () => number;
}

export const useCarrinhoStore = create<CarrinhoStore>()(
  persist(
    (set, get) => ({
      itens: [],

      adicionar: (produto) =>
        set((state) => {
          // BUG-09 fix: dedup by ID, not name
          const existing = state.itens.find((i) => i.id === produto.id);
          if (existing) {
            return {
              itens: state.itens.map((i) =>
                i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i,
              ),
            };
          }
          const item: ItemCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1,
            // BUG-03 fix: store real autor ID
            autorId: produto.autor?.id ?? '',
            autorNome: produto.autor?.nome ?? '',
          };
          return { itens: [...state.itens, item] };
        }),

      remover: (id) =>
        set((state) => ({ itens: state.itens.filter((i) => i.id !== id) })),

      atualizar: (id, quantidade) =>
        set((state) => {
          if (quantidade <= 0) return { itens: state.itens.filter((i) => i.id !== id) };
          return { itens: state.itens.map((i) => (i.id === id ? { ...i, quantidade } : i)) };
        }),

      // BUG-07 fix: single unified limpar via Zustand (sessionStorage via persist)
      limpar: () => set({ itens: [] }),

      totalItens: () => get().itens.reduce((acc, i) => acc + i.quantidade, 0),
      subtotal: () => get().itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0),
    }),
    {
      name: 'carrinho',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
