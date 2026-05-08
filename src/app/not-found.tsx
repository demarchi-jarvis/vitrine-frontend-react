'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <p className="font-serif text-primary text-8xl sm:text-9xl font-bold mb-4 leading-none">
          404
        </p>
        <h1 className="font-serif text-foreground text-2xl sm:text-3xl font-semibold mb-3">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-10 max-w-xs mx-auto">
          {t.notFound.desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href={ROUTES.bazar}>
              <Search strokeWidth={1.5} className="w-4 h-4" />
              {t.notFound.explore}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.home}>
              <Home strokeWidth={1.5} className="w-4 h-4" />
              {t.notFound.home}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
