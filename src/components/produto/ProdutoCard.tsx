'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Edit, ArrowUpRight } from 'lucide-react';
import type { Produto } from '@/types';
import { formatBRL } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface ProdutoCardProps {
  produto: Produto;
  onAdicionarCarrinho?: (produto: Produto) => void;
  showOwnerActions?: boolean;
}

export function ProdutoCard({ produto, onAdicionarCarrinho, showOwnerActions }: ProdutoCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-3xl overflow-hidden bg-sand-100 card-hover"
    >
      {/* Image */}
      <Link href={ROUTES.detalhes(produto.id)} className="block aspect-[4/5] relative overflow-hidden">
        <Image
          src={produto.imagem || '/assets/placeholder-produto.svg'}
          alt={produto.nome}
          fill
          className="object-cover img-zoom"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-wood-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1 text-sand-50 text-sm">
            <ArrowUpRight strokeWidth={1.0} className="w-4 h-4" />
            Ver peça
          </span>
        </div>
        {/* Category badge */}
        {produto.categoria && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-sand-50/90 text-wood-700 text-[10px] font-medium uppercase tracking-wide">
            {produto.categoria.nome}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-wood-900 text-base font-semibold leading-tight line-clamp-2">
          {produto.nome}
        </h3>
        {produto.autor && (
          <p className="text-wood-500 text-xs mt-1">por {produto.autor.nome}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-terracotta-600 font-semibold text-base">
            {formatBRL(produto.preco)}
          </span>

          {showOwnerActions ? (
            <Link
              href={ROUTES.editarProduto(produto.id)}
              className={cn(
                'p-2 rounded-xl bg-sand-200 hover:bg-terracotta-600 hover:text-sand-50',
                'transition-all duration-300 ease-organic',
              )}
              aria-label="Editar produto"
            >
              <Edit strokeWidth={1.25} className="w-4 h-4" />
            </Link>
          ) : onAdicionarCarrinho ? (
            <button
              onClick={() => onAdicionarCarrinho(produto)}
              className={cn(
                'p-2 rounded-xl bg-sand-200 hover:bg-terracotta-600 hover:text-sand-50',
                'transition-all duration-300 ease-organic',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600',
              )}
              aria-label={`Adicionar ${produto.nome} ao carrinho`}
            >
              <ShoppingCart strokeWidth={1.25} className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
