'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
  /** URL do produto ou perfil atual, inserida dinamicamente na mensagem */
  context?: string;
}

export function WhatsAppButton({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5524999999999',
  defaultMessage = 'Olá! Vim pela Vitrine do Artesanato e gostaria de saber mais.',
  context,
}: WhatsAppButtonProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const message = context
    ? `${defaultMessage}\n\n${context}`
    : defaultMessage;

  const url = buildWhatsAppUrl(phoneNumber, message);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {tooltipOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-2xl p-4 max-w-[200px] text-right"
          >
            <p className="text-wood-900 text-sm font-medium">Fale com o Artesão</p>
            <p className="text-wood-600 text-xs mt-1">Resposta rápida via WhatsApp</p>
            <button
              onClick={() => setTooltipOpen(false)}
              className="absolute top-2 right-2 text-wood-400 hover:text-wood-700"
              aria-label="Fechar"
            >
              <X strokeWidth={1.25} className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <div className="relative">
        {/* Pulse rings */}
        <motion.span
          className="absolute inset-0 rounded-full bg-green-400/25"
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-green-400/15"
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={[
            'relative flex items-center justify-center w-14 h-14 rounded-full',
            'backdrop-blur-md bg-white/70 border border-white/50',
            'shadow-2xl shadow-green-500/20',
            'transition-shadow duration-300 hover:shadow-green-500/40',
          ].join(' ')}
          aria-label="Fale com o Artesão via WhatsApp"
        >
          <MessageCircle strokeWidth={1.25} className="w-7 h-7 text-green-600" />
        </motion.a>
      </div>
    </div>
  );
}
