'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Palette, Hammer, Leaf, Scissors, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { buildWhatsAppUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5524999999999';

export default function DemandasPage() {
  const { t } = useTranslation();
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [orcamento, setOrcamento] = useState('');

  const CATEGORIAS_DEMANDA = [
    { icon: Palette, label: t.demands.catPainting },
    { icon: Hammer, label: t.demands.catWood },
    { icon: Leaf, label: t.demands.catBio },
    { icon: Scissors, label: t.demands.catTapestry },
  ];

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim()) return;
    // WhatsApp message stays in PT (sent to artisan)
    const msg = [
      `*Solicitação de Encomenda — Vitrine do Artesanato*`,
      categoria ? `Categoria: ${categoria}` : '',
      orcamento ? `Orçamento estimado: ${orcamento}` : '',
      ``,
      `Descrição da peça:`,
      descricao,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const url = buildWhatsAppUrl(WHATSAPP, msg);
      window.open(url, '_blank', 'noopener noreferrer');
    } catch {
      window.open(
        `https://wa.me/${WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`,
        '_blank',
        'noopener noreferrer',
      );
    }
  }

  function toggleCategoria(label: string) {
    setCategoria((prev) => (prev === label ? '' : label));
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary dark:text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-3">
            {t.demands.label}
          </p>
          <h1 className="font-serif text-foreground text-4xl sm:text-5xl font-semibold leading-tight mb-4">
            {t.demands.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            {t.demands.subtitle}
          </p>

          {/* Category selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <Label>{t.demands.categoryLabel}</Label>
              <AnimatePresence>
                {categoria && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => setCategoria('')}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X strokeWidth={1.5} className="w-3 h-3" />
                    {t.demands.clear}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIAS_DEMANDA.map(({ icon: Icon, label }) => {
                const isSelected = categoria === label;
                return (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={() => toggleCategoria(label)}
                    whileTap={{ scale: 0.97 }}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer',
                      isSelected
                        ? 'border-primary bg-primary/8 dark:bg-primary/15 text-primary'
                        : 'border-border bg-surface text-foreground hover:border-primary/40 hover:bg-surface-elevated',
                    )}
                  >
                    <div
                      className={cn(
                        'p-2 rounded-xl transition-colors flex-shrink-0',
                        isSelected ? 'bg-primary/15' : 'bg-surface-elevated',
                      )}
                    >
                      <Icon strokeWidth={1.5} className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </motion.button>
                );
              })}
            </div>

            {categoria && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-muted-foreground text-xs mt-2"
              >
                {t.demands.deselect}
              </motion.p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleEnviar} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descricao" required>
                {t.demands.descLabel}
              </Label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={5}
                required
                placeholder={t.demands.descPlaceholder}
                className="field-base resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="orcamento">{t.demands.budgetLabel}</Label>
              <input
                id="orcamento"
                type="text"
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
                placeholder={t.demands.budgetPlaceholder}
                className="field-base"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <MessageCircle strokeWidth={1.5} className="w-5 h-5" />
              {t.demands.send}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-6">
            {t.demands.redirect}{' '}
            <Link href="/bazar" className="text-primary hover:underline underline-offset-4">
              {t.demands.orExplore}
            </Link>{' '}
            para peças disponíveis.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
