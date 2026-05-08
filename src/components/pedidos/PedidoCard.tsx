'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatBRL } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ItemPedido } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  EM_PREPARO: 'Em Preparo',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

const STATUS_CLASSES: Record<string, string> = {
  PENDENTE:   'bg-ocre-200   text-ocre-900  dark:bg-ocre-900/30   dark:text-ocre-300',
  CONFIRMADO: 'bg-terracotta-100 text-terracotta-800 dark:bg-terracotta-900/30 dark:text-terracotta-300',
  EM_PREPARO: 'bg-terracotta-200 text-terracotta-900 dark:bg-terracotta-800/40 dark:text-terracotta-200',
  ENVIADO:    'bg-terracotta-500 text-sand-50  dark:bg-terracotta-700 dark:text-sand-50',
  ENTREGUE:   'bg-green-100   text-green-800  dark:bg-green-900/30  dark:text-green-400',
  CANCELADO:  'bg-surface     text-muted-foreground',
};

interface PedidoCardProps {
  item: ItemPedido;
}

export function PedidoCard({ item }: PedidoCardProps) {
  const { t } = useTranslation();
  const pedido = item.pedido;
  const status = (pedido as { status?: string }).status ?? 'PENDENTE';
  const total = item.produto.preco * item.quantidade;
  const rawDate = pedido.dataCriacao ?? pedido.dataEntrega;
  const date = rawDate
    ? new Date(rawDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-3xl p-5 hover:shadow-md dark:hover:shadow-black/20 transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{t.orders.order}</p>
          <p className="text-foreground font-serif font-semibold text-base">
            #{pedido.id?.slice(-6).toUpperCase()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_CLASSES[status] ?? STATUS_CLASSES.PENDENTE}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
          {date && <span className="text-muted-foreground text-xs">{date}</span>}
        </div>
      </div>

      {/* Item */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-elevated flex-shrink-0">
          {item.produto.imagem ? (
            <Image
              src={item.produto.imagem}
              alt={item.produto.nome}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full bg-surface-elevated" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground text-sm font-medium line-clamp-1">{item.produto.nome}</p>
          <p className="text-muted-foreground text-xs">
            {item.quantidade}× {formatBRL(item.produto.preco)}
          </p>
        </div>
        <span className="text-foreground text-sm font-semibold flex-shrink-0">
          {formatBRL(total)}
        </span>
      </div>

      {/* Delivery address */}
      {pedido.enderecoEntrega && (
        <p className="text-muted-foreground text-xs border-t border-border pt-3">
          {t.orders.delivery} {pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero} —{' '}
          {pedido.enderecoEntrega.cidade}/{pedido.enderecoEntrega.estado}
        </p>
      )}
    </motion.div>
  );
}
