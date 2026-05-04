'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { ItemCarrinho } from '@/types';
import { formatBRL } from '@/lib/utils';
import { useCarrinhoStore } from '@/store/carrinho.store';

interface CarrinhoItemProps {
  item: ItemCarrinho;
}

export function CarrinhoItem({ item }: CarrinhoItemProps) {
  const { remover, atualizar } = useCarrinhoStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-4 border-b border-sand-200 last:border-0"
    >
      {/* Image */}
      <div className="relative w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-sand-100">
        <Image
          src={item.imagem || '/assets/placeholder-produto.svg'}
          alt={item.nome}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-wood-900 text-sm font-semibold line-clamp-2 leading-tight">
          {item.nome}
        </h4>
        {item.autorNome && (
          <p className="text-wood-400 text-xs mt-0.5">por {item.autorNome}</p>
        )}
        <p className="text-terracotta-600 font-semibold text-sm mt-1.5">
          {formatBRL(item.preco * item.quantidade)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => atualizar(item.id, item.quantidade - 1)}
            className="w-7 h-7 rounded-lg bg-sand-200 hover:bg-sand-300 flex items-center justify-center transition-colors"
            aria-label="Diminuir quantidade"
          >
            <Minus strokeWidth={1.5} className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-medium text-wood-900">
            {item.quantidade}
          </span>
          <button
            onClick={() => atualizar(item.id, item.quantidade + 1)}
            className="w-7 h-7 rounded-lg bg-sand-200 hover:bg-sand-300 flex items-center justify-center transition-colors"
            aria-label="Aumentar quantidade"
          >
            <Plus strokeWidth={1.5} className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => remover(item.id)}
            className="ml-auto p-1.5 text-wood-400 hover:text-red-500 transition-colors"
            aria-label={`Remover ${item.nome}`}
          >
            <Trash2 strokeWidth={1.25} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
