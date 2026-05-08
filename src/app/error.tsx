'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from '@/contexts/LanguageContext';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 mx-auto flex items-center justify-center mb-6">
          <AlertTriangle strokeWidth={1.25} className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>

        <h1 className="font-serif text-foreground text-3xl font-semibold mb-3">
          {t.error.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2 max-w-sm mx-auto">
          {error.message || 'Ocorreu um erro inesperado. Tente novamente.'}
        </p>
        {error.digest && (
          <p className="text-muted-foreground text-xs mb-8 font-mono">
            ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button onClick={reset} variant="primary">
            <RefreshCw strokeWidth={1.5} className="w-4 h-4" />
            {t.error.retry}
          </Button>
          <Button variant="ghost" asChild>
            <Link href={ROUTES.home}>
              <Home strokeWidth={1.5} className="w-4 h-4" />
              {t.error.home}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
