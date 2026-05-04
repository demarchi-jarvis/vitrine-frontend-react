'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-terracotta-600 font-serif text-6xl font-semibold mb-4">Ops</p>
      <h1 className="font-serif text-wood-900 text-2xl font-semibold mb-2">Algo deu errado</h1>
      <p className="text-wood-400 text-sm mb-8 max-w-sm">
        {error.message || 'Ocorreu um erro inesperado. Tente novamente.'}
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
