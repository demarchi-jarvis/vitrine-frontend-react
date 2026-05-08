'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Check, Package } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCarrinhoStore } from '@/store/carrinho.store';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from '@/contexts/LanguageContext';
import type { Produto } from '@/types';

interface AddToCartButtonProps {
  produto: Produto;
}

export function AddToCartButton({ produto }: AddToCartButtonProps) {
  const adicionar = useCarrinhoStore((s) => s.adicionar);
  const itens = useCarrinhoStore((s) => s.itens);
  const router = useRouter();
  const { t } = useTranslation();
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== undefined) clearTimeout(resetTimer.current);
    };
  }, []);

  const itemNoCarrinho = itens.find((i) => i.id === produto.id);
  const estoqueDisponivel = produto.quantidade - (itemNoCarrinho?.quantidade ?? 0);
  const semEstoque = produto.quantidade <= 0;
  const estoqueEsgotadoNoCarrinho = !semEstoque && estoqueDisponivel <= 0;
  const disabled = semEstoque || estoqueEsgotadoNoCarrinho;

  function handleClick() {
    if (disabled || added) return;
    adicionar(produto);
    setAdded(true);

    toast.success(`${produto.nome} adicionado!`, {
      action: {
        label: t.product.viewCart,
        onClick: () => router.push(ROUTES.carrinho),
      },
      duration: 4000,
    });

    resetTimer.current = setTimeout(() => setAdded(false), 2500);
  }

  const label = semEstoque
    ? t.product.noStock
    : estoqueEsgotadoNoCarrinho
    ? t.product.inCartMax
    : added
    ? t.product.added
    : t.product.addCart;

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-medium transition-all duration-300 cursor-pointer ${
        disabled
          ? 'bg-surface text-muted-foreground cursor-not-allowed'
          : added
          ? 'bg-green-600 text-white'
          : 'bg-primary text-primary-foreground hover:bg-primary-hover'
      }`}
    >
      <motion.span
        key={added ? 'check' : 'cart'}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 90 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        {semEstoque ? (
          <Package strokeWidth={1.25} className="w-5 h-5" />
        ) : added ? (
          <Check strokeWidth={2} className="w-5 h-5" />
        ) : (
          <ShoppingCart strokeWidth={1.25} className="w-5 h-5" />
        )}
      </motion.span>
      {label}
    </motion.button>
  );
}
