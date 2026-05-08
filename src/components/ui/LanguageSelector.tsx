'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/contexts/LanguageContext';
import { LANGS, type Lang } from '@/i18n';
import { cn } from '@/lib/utils';

export function LanguageSelector() {
  const { lang, setLang, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-12 right-0 bg-background border border-border rounded-2xl shadow-2xl py-2 min-w-[140px] overflow-hidden"
          >
            <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {t.lang.label}
            </p>
            {LANGS.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => {
                  setLang(code as Lang);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-surface cursor-pointer',
                  lang === code ? 'text-primary font-medium bg-surface' : 'text-foreground',
                )}
              >
                <span className="text-base leading-none">{flag}</span>
                <span>{label}</span>
                {lang === code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t.lang.label}
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-background border border-border shadow-lg text-sm font-medium text-foreground hover:border-primary transition-all duration-200 cursor-pointer"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-medium text-muted-foreground uppercase">{current.code}</span>
      </motion.button>
    </div>
  );
}
