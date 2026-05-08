'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/LanguageContext';

interface PedidoToggleProps {
  estado: 'compras' | 'vendas';
  onChange: (e: 'compras' | 'vendas') => void;
}

export function PedidoToggle({ estado, onChange }: PedidoToggleProps) {
  const { t } = useTranslation();

  const tabs: { key: 'compras' | 'vendas'; label: string }[] = [
    { key: 'compras', label: t.orders.buys },
    { key: 'vendas', label: t.orders.sales },
  ];

  return (
    <div className="relative flex bg-surface rounded-2xl p-1 w-fit border border-border">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`relative px-6 py-2 text-sm font-medium rounded-xl transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring z-10 ${
            estado === key ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {estado === key && (
            <motion.span
              layoutId="pedido-tab"
              className="absolute inset-0 bg-primary rounded-xl"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative z-10 capitalize">{label}</span>
        </button>
      ))}
    </div>
  );
}
