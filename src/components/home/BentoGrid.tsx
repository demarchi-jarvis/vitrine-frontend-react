'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Produto } from '@/types';
import { formatBRL } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

interface BentoGridProps {
  produtos: Produto[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function BentoGrid({ produtos }: BentoGridProps) {
  const { t } = useTranslation();

  if (!produtos.length) return null;

  const [featured, ...rest] = produtos;

  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="mb-12"
      >
        <motion.p variants={itemVariants} className="text-terracotta-600 dark:text-terracotta-400 text-sm font-medium uppercase tracking-widest mb-3">
          {t.bento.label}
        </motion.p>
        <motion.h2 variants={itemVariants} className="font-serif text-4xl md:text-5xl text-wood-900 dark:text-sand-50">
          {t.bento.title}
        </motion.h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-12 gap-4 auto-rows-[280px]"
      >
        {/* Featured — large */}
        {featured && (
          <motion.div variants={itemVariants} className="bento-featured">
            <BentoCard produto={featured} size="large" seeItem={t.bento.seeItem} featured={t.bento.featured} />
          </motion.div>
        )}

        {/* Right column — 2 stacked */}
        {rest.slice(0, 2).map((produto) => (
          <motion.div key={produto.id} variants={itemVariants} className="bento-half">
            <BentoCard produto={produto} size="medium" seeItem={t.bento.seeItem} featured={t.bento.featured} />
          </motion.div>
        ))}

        {/* Bottom row — 3 equal */}
        {rest.slice(2, 5).map((produto) => (
          <motion.div key={produto.id} variants={itemVariants} className="bento-third">
            <BentoCard produto={produto} size="small" seeItem={t.bento.seeItem} featured={t.bento.featured} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12"
      >
        <Link
          href={ROUTES.bazar}
          className={cn(
            'inline-flex items-center gap-2 px-8 py-4 rounded-full',
            'border-2 border-wood-900 dark:border-sand-200 text-wood-900 dark:text-sand-50 font-medium',
            'hover:bg-wood-900 dark:hover:bg-sand-50 hover:text-sand-50 dark:hover:text-wood-900',
            'transition-all duration-500 ease-organic hover:scale-[1.02]',
          )}
        >
          {t.bento.cta}
          <ArrowUpRight strokeWidth={1.25} className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}

function BentoCard({
  produto,
  size,
  seeItem,
  featured,
}: {
  produto: Produto;
  size: 'large' | 'medium' | 'small';
  seeItem: string;
  featured: string;
}) {
  return (
    <Link
      href={ROUTES.detalhes(produto.id)}
      className="group relative h-full rounded-3xl overflow-hidden block focus-ring"
    >
      {/* Image */}
      <Image
        src={produto.imagem || '/assets/placeholder-produto.svg'}
        alt={produto.nome}
        fill
        className="object-cover img-zoom"
        sizes={
          size === 'large'
            ? '(max-width: 768px) 100vw, 58vw'
            : size === 'medium'
              ? '(max-width: 768px) 100vw, 42vw'
              : '(max-width: 768px) 100vw, 33vw'
        }
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      />

      {/* Default overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-wood-900/80 via-wood-900/20 to-transparent" />

      {/* Hover overlay — reveals extra info */}
      <div className="absolute inset-0 bg-terracotta-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
        <div className="text-center">
          {produto.categoria && (
            <p className="text-terracotta-300 text-xs uppercase tracking-widest mb-2">
              {produto.categoria.nome}
            </p>
          )}
          <p className="text-sand-50 text-sm leading-relaxed">
            {produto.descricao?.slice(0, 80)}
            {produto.descricao && produto.descricao.length > 80 ? '…' : ''}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sand-50">
            <ArrowUpRight strokeWidth={1.25} className="w-4 h-4" />
            <span className="text-sm font-medium">{seeItem}</span>
          </div>
        </div>
      </div>

      {/* Default info */}
      <div className="absolute bottom-0 inset-x-0 p-4 translate-y-0 group-hover:translate-y-4 transition-transform duration-500">
        {produto.categoria && (
          <span className="text-terracotta-300 text-xs uppercase tracking-wider">
            {produto.categoria.nome}
          </span>
        )}
        <h3
          className={cn(
            'font-serif text-sand-50 leading-tight mt-1',
            size === 'large' ? 'text-2xl md:text-3xl' : 'text-lg',
          )}
        >
          {produto.nome}
        </h3>
        <p className="text-sand-200 text-sm mt-1">{formatBRL(produto.preco)}</p>
      </div>

      {/* Premium badge for first item */}
      {size === 'large' && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ocre-500 text-sand-50 text-xs font-medium">
          {featured}
        </div>
      )}
    </Link>
  );
}
