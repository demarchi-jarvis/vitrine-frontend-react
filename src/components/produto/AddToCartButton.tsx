'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Check, Package } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
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
  const [added, setAdded] = useState(false);
  const navTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (navTimer.current !== undefined) clearTimeout(navTimer.current);
      if (resetTimer.current !== undefined) clearTimeout(resetTimer.current);
    };
  }, []);

  function handleClick() {
    if (produto.quantidade <= 0 || added) return;
    adicionar(produto);
    setAdded(true);
    toast.success(`${produto.nome} adicionado ao carrinho!`);
    navTimer.current = setTimeout(() => {
      router.push(ROUTES.carrinho);
    }, 600);
    resetTimer.current = setTimeout(() => setAdded(false), 2000);
  }

  const disabled = produto.quantidade <= 0;

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-medium transition-all duration-300 cursor-pointer ${
        disabled
          ? 'bg-sand-200 text-wood-400 cursor-not-allowed'
          : added
          ? 'bg-green-600 text-white'
          : 'bg-terracotta-600 text-sand-50 hover:bg-terracotta-700'
      }`}
    >
      <motion.span
        key={added ? 'check' : 'cart'}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 90 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        {disabled ? (
          <Package strokeWidth={1.25} className="w-5 h-5" />
        ) : added ? (
          <Check strokeWidth={2} className="w-5 h-5" />
        ) : (
          <ShoppingCart strokeWidth={1.25} className="w-5 h-5" />
        )}
      </motion.span>
      {disabled ? 'Sem estoque' : added ? 'Adicionado!' : 'Adicionar ao carrinho'}
    </motion.button>
  );
}
