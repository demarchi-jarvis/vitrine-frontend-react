'use client';

import { useState, useEffect } from 'react';
import { buscarCep } from '@/lib/api/endereco';
import { useDebounce } from './useDebounce';
import type { ViaCepResponse } from '@/types';

export function useCep(rawCep: string) {
  const cep = rawCep.replace(/\D/g, '');
  const debouncedCep = useDebounce(cep, 500);
  const [data, setData] = useState<ViaCepResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!/^\d{8}$/.test(debouncedCep)) return;
    setLoading(true);
    setError(null);
    buscarCep(debouncedCep)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [debouncedCep]);

  return { data, loading, error };
}
