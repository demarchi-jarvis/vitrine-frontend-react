'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Edit, ArrowUpRight, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { Produto } from '@/types';
import { formatBRL, cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { useCarrinhoStore } from '@/store/carrinho.store';

interface ProdutoCardProps {
  produto: Produto;
  onAdicionarCarrinho?: (produto: Produto) => void;
  showOwnerActions?: boolean;
  index?: number;
}

export function ProdutoCard({ produto, onAdicionarCarrinho, showOwnerActions, index = 0 }: ProdutoCardProps) {
  const adicionar = useCarrinhoStore((s) => s.adicionar);
  const cardRef = useRef<HTMLElement>(null);

  /* ── 3D Tilt via motion values ── */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const glare   = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (onAdicionarCarrinho) {
      onAdicionarCarrinho(produto);
    } else {
      adicionar(produto);
      toast.success(`${produto.nome} adicionado ao carrinho!`);
    }
  }

  const semEstoque = produto.quantidade <= 0;

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative rounded-3xl overflow-hidden cursor-pointer',
        'bg-surface border border-border',
        'shadow-sm hover:shadow-2xl',
        'transition-shadow duration-500 ease-organic',
      )}
    >
      {/* Glare overlay */}
      <motion.div
        style={{ x: glare }}
        className="absolute inset-0 z-10 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </motion.div>

      {/* Image */}
      <Link href={ROUTES.detalhes(produto.id)} className="block aspect-[4/5] relative overflow-hidden">
        <Image
          src={produto.imagem || '/assets/placeholder-produto.svg'}
          alt={produto.nome}
          fill
          className="object-cover transition-transform duration-700 ease-organic group-hover:scale-108"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-wood-900/75 via-wood-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-4">
          <span className="flex items-center gap-1.5 text-sand-50 text-sm font-medium">
            <ArrowUpRight strokeWidth={1.5} className="w-4 h-4" />
            Ver peça
          </span>
        </div>

        {/* Category badge */}
        {produto.categoria && (
          <span className="absolute top-3 left-3">
            <Badge variant="default" className="bg-background/90 backdrop-blur-sm text-foreground">
              {produto.categoria.nome}
            </Badge>
          </span>
        )}

        {/* Out of stock overlay */}
        {semEstoque && (
          <div className="absolute inset-0 bg-wood-900/50 flex items-center justify-center">
            <Badge variant="secondary" size="lg">Sem estoque</Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-foreground text-base font-semibold leading-tight line-clamp-2">
          {produto.nome}
        </h3>
        {produto.autor && (
          <p className="text-muted-foreground text-xs mt-1">por {produto.autor.nome}</p>
        )}

        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-primary font-semibold text-base">
            {formatBRL(produto.preco)}
          </span>

          {showOwnerActions ? (
            <Link
              href={ROUTES.editarProduto(produto.id)}
              className={cn(
                'p-2 rounded-xl bg-surface hover:bg-primary hover:text-primary-foreground',
                'transition-all duration-300 ease-organic cursor-pointer',
              )}
              aria-label="Editar produto"
            >
              <Edit strokeWidth={1.25} className="w-4 h-4" />
            </Link>
          ) : (
            <motion.button
              onClick={handleAddToCart}
              disabled={semEstoque}
              whileHover={semEstoque ? {} : { scale: 1.12 }}
              whileTap={semEstoque ? {} : { scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={cn(
                'p-2 rounded-xl transition-colors duration-300 ease-organic cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                semEstoque
                  ? 'bg-surface text-muted-foreground cursor-not-allowed'
                  : 'bg-surface hover:bg-primary hover:text-primary-foreground text-foreground',
              )}
              aria-label={semEstoque ? 'Sem estoque' : `Adicionar ${produto.nome} ao carrinho`}
            >
              {semEstoque ? (
                <Package strokeWidth={1.25} className="w-4 h-4" />
              ) : (
                <ShoppingCart strokeWidth={1.25} className="w-4 h-4" />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
