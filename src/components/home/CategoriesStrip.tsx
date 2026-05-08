'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Categoria } from '@/types';

interface CategoriesStripProps {
  categorias: Categoria[];
  selected: string;
  onChange: (id: string) => void;
}

export function CategoriesStrip({ categorias, selected, onChange }: CategoriesStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selected]);

  const all = [{ id: '', nome: 'Todos' }, ...categorias];

  return (
    <div className="relative">
      {/* Fade edges — bg-background adapts to dark mode via CSS vars */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-none py-1.5 px-4"
        role="group"
        aria-label="Filtrar por categoria"
      >
        {all.map((cat) => {
          const isActive = cat.id === selected;
          return (
            <motion.button
              key={cat.id}
              ref={isActive ? activeRef : undefined}
              layout
              onClick={() => onChange(cat.id)}
              whileTap={{ scale: 0.95 }}
              aria-pressed={isActive}
              className={`relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground bg-surface hover:bg-surface-elevated'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat.nome}</span>
            </motion.button>
          );
        })}
        {/* Trailing spacer prevents last item from hiding behind right fade */}
        <div className="w-6 flex-shrink-0" aria-hidden />
      </div>
    </div>
  );
}
