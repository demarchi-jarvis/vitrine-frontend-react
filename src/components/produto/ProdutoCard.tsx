'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Edit, ArrowUpRight, Package } from 'lucide-react';
import { toast } from 'sonner';
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

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (onAdicionarCarrinho) {
      onAdicionarCarrinho(produto);
    } else {
      adicionar(produto);
      toast.success(`${produto.nome} adicionado!`);
    }
  }

  const semEstoque = produto.quantidade <= 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -4 }}
      className="group relative rounded-3xl overflow-hidden bg-sand-100 border border-sand-200/60 shadow-sm hover:shadow-lg transition-shadow duration-500 ease-organic cursor-pointer"
    >
      {/* Image */}
      <Link href={ROUTES.detalhes(produto.id)} className="block aspect-[4/5] relative overflow-hidden">
        <Image
          src={produto.imagem || '/assets/placeholder-produto.svg'}
          alt={produto.nome}
          fill
          className="object-cover transition-transform duration-700 ease-organic group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-wood-900/70 via-wood-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-4">
          <span className="flex items-center gap-1.5 text-sand-50 text-sm font-medium">
            <ArrowUpRight strokeWidth={1.5} className="w-4 h-4" />
            Ver peça
          </span>
        </div>

        {/* Category badge */}
        {produto.categoria && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-sand-50/90 backdrop-blur-sm text-wood-700 text-[10px] font-medium uppercase tracking-wide">
            {produto.categoria.nome}
          </span>
        )}

        {/* Out of stock badge */}
        {semEstoque && (
          <div className="absolute inset-0 bg-wood-900/40 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-wood-900/80 text-sand-200 text-xs font-medium">
              Sem estoque
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-wood-900 text-base font-semibold leading-tight line-clamp-2">
          {produto.nome}
        </h3>
        {produto.autor && (
          <p className="text-wood-400 text-xs mt-1">por {produto.autor.nome}</p>
        )}
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-terracotta-600 font-semibold text-base">
            {formatBRL(produto.preco)}
          </span>

          {showOwnerActions ? (
            <Link
              href={ROUTES.editarProduto(produto.id)}
              className={cn(
                'p-2 rounded-xl bg-sand-200 hover:bg-terracotta-600 hover:text-sand-50',
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
              whileHover={semEstoque ? {} : { scale: 1.1 }}
              whileTap={semEstoque ? {} : { scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={cn(
                'p-2 rounded-xl transition-colors duration-300 ease-organic',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 cursor-pointer',
                semEstoque
                  ? 'bg-sand-200 text-wood-300 cursor-not-allowed'
                  : 'bg-sand-200 hover:bg-terracotta-600 hover:text-sand-50 text-wood-700',
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
