'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatBRL } from '@/lib/utils';
import type { ItemPedido } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  EM_PREPARO: 'Em Preparo',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: 'bg-ocre-300 text-wood-900',
  CONFIRMADO: 'bg-terracotta-300 text-wood-900',
  EM_PREPARO: 'bg-terracotta-400 text-sand-50',
  ENVIADO: 'bg-terracotta-600 text-sand-50',
  ENTREGUE: 'bg-wood-700 text-sand-50',
  CANCELADO: 'bg-sand-200 text-wood-500',
};

interface PedidoCardProps {
  item: ItemPedido;
}

export function PedidoCard({ item }: PedidoCardProps) {
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
      className="bg-sand-50 border border-sand-200 rounded-3xl p-5 hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-wood-400 font-medium uppercase tracking-widest">Pedido</p>
          <p className="text-wood-900 font-serif font-semibold text-base">
            #{pedido.id?.slice(-6).toUpperCase()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? STATUS_COLORS.PENDENTE}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
          {date && <span className="text-wood-400 text-xs">{date}</span>}
        </div>
      </div>

      {/* Item */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-sand-100 flex-shrink-0">
          {item.produto.imagem ? (
            <Image src={item.produto.imagem} alt={item.produto.nome} fill className="object-cover" sizes="48px" />
          ) : (
            <div className="w-full h-full bg-sand-200" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-wood-900 text-sm font-medium line-clamp-1">{item.produto.nome}</p>
          <p className="text-wood-400 text-xs">
            {item.quantidade}× {formatBRL(item.produto.preco)}
          </p>
        </div>
        <span className="text-wood-700 text-sm font-semibold flex-shrink-0">
          {formatBRL(total)}
        </span>
      </div>

      {/* Delivery address */}
      {pedido.enderecoEntrega && (
        <p className="text-wood-400 text-xs border-t border-sand-200 pt-3">
          Entrega: {pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero} —{' '}
          {pedido.enderecoEntrega.cidade}/{pedido.enderecoEntrega.estado}
        </p>
      )}
    </motion.div>
  );
}
