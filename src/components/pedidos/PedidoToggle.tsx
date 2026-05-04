'use client';

import { motion } from 'framer-motion';

interface PedidoToggleProps {
  estado: 'compras' | 'vendas';
  onChange: (e: 'compras' | 'vendas') => void;
}

export function PedidoToggle({ estado, onChange }: PedidoToggleProps) {
  return (
    <div className="relative flex bg-sand-100 rounded-2xl p-1 w-fit">
      {(['compras', 'vendas'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-6 py-2 text-sm font-medium rounded-xl transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 z-10 ${
            estado === tab ? 'text-sand-50' : 'text-wood-600 hover:text-wood-900'
          }`}
        >
          {estado === tab && (
            <motion.span
              layoutId="pedido-tab"
              className="absolute inset-0 bg-terracotta-600 rounded-xl"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative z-10 capitalize">{tab}</span>
        </button>
      ))}
    </div>
  );
}
