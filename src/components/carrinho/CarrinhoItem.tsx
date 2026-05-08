'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { ItemCarrinho } from '@/types';
import { formatBRL, cn } from '@/lib/utils';
import { useCarrinhoStore } from '@/store/carrinho.store';
import { useTranslation } from '@/contexts/LanguageContext';

interface CarrinhoItemProps {
  item: ItemCarrinho;
}

export function CarrinhoItem({ item }: CarrinhoItemProps) {
  const { remover, atualizar } = useCarrinhoStore();
  const { t } = useTranslation();
  const atMax = item.quantidade >= item.estoque;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex gap-3 sm:gap-4 py-4 border-b border-border last:border-0"
    >
      {/* Image */}
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-surface">
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
        <h4 className="font-serif text-foreground text-sm font-semibold line-clamp-2 leading-tight">
          {item.nome}
        </h4>
        {item.autorNome && (
          <p className="text-muted-foreground text-xs mt-0.5">{t.cart.by} {item.autorNome}</p>
        )}
        <p className="text-primary font-semibold text-sm mt-2">
          {formatBRL(item.preco * item.quantidade)}
        </p>

        {/* Quantity + remove */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-border">
            <button
              onClick={() => atualizar(item.id, item.quantidade - 1)}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                'hover:bg-surface-elevated text-foreground',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
              aria-label={t.cart.decrease}
            >
              <Minus strokeWidth={1.5} className="w-3 h-3" />
            </button>
            <span className="w-7 text-center text-sm font-semibold text-foreground tabular-nums">
              {item.quantidade}
            </span>
            <button
              onClick={() => atualizar(item.id, item.quantidade + 1)}
              disabled={atMax}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                atMax
                  ? 'text-muted-foreground/40 cursor-not-allowed'
                  : 'hover:bg-surface-elevated text-foreground',
              )}
              aria-label={t.cart.increase}
              title={atMax ? `${t.cart.stockMax} ${item.estoque}` : undefined}
            >
              <Plus strokeWidth={1.5} className="w-3 h-3" />
            </button>
          </div>

          {atMax && (
            <span className="text-muted-foreground text-xs">
              {t.cart.stockMax} {item.estoque}
            </span>
          )}

          <button
            onClick={() => remover(item.id)}
            className="ml-auto p-2 rounded-lg text-muted-foreground hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            aria-label={`${t.cart.remove} ${item.nome}`}
          >
            <Trash2 strokeWidth={1.25} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
