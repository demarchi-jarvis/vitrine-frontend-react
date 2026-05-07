'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ProdutoGrid } from '@/components/produto/ProdutoGrid';
import { CategoriesStrip } from '@/components/home/CategoriesStrip';
import { Pagination } from '@/components/ui/Pagination';
import { getProdutos } from '@/lib/api/produto';
import { getCategorias } from '@/lib/api/categoria';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/auth.store';
import type { Produto, Categoria } from '@/types';

const PAGE_SIZE = 12;

export function BazarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState(searchParams.get('nome') ?? '');
  const [categoriaId, setCategoriaId] = useState(searchParams.get('categoriaId') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 0));

  const debouncedBusca = useDebounce(busca, 400);

  const syncUrl = useCallback((params: { nome?: string; categoriaId?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params.nome) sp.set('nome', params.nome);
    if (params.categoriaId) sp.set('categoriaId', params.categoriaId);
    if (params.page) sp.set('page', String(params.page));
    router.replace(`/bazar${sp.toString() ? `?${sp}` : ''}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    getCategorias(token ?? undefined).then(setCategorias).catch(() => {});
  }, [token]);

  useEffect(() => {
    setLoading(true);
    getProdutos({
      page,
      size: PAGE_SIZE,
      categoriaId: categoriaId || undefined,
      nome: debouncedBusca || undefined,
    })
      .then((res) => {
        setProdutos(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
    syncUrl({ nome: debouncedBusca, categoriaId, page });
  }, [debouncedBusca, categoriaId, page, syncUrl]);

  function handleCategoryChange(id: string) {
    setCategoriaId(id);
    setPage(0);
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-2">Bazar</p>
          <h1 className="font-serif text-wood-900 text-4xl sm:text-5xl font-semibold leading-tight">
            Todas as peças
          </h1>
        </motion.div>

        <div className="relative mt-6 max-w-md">
          <Search strokeWidth={1.25} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wood-400" />
          <input
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(0); }}
            placeholder="Buscar por nome…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-sand-100 border border-sand-200 focus:outline-none focus:border-terracotta-600 focus:ring-2 focus:ring-terracotta-600/20 transition-all duration-300"
          />
        </div>

        <div className="mt-5">
          <CategoriesStrip categorias={categorias} selected={categoriaId} onChange={handleCategoryChange} />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <ProdutoGrid
          produtos={produtos}
          loading={loading}
          emptyMessage="Nenhum produto encontrado para essa busca."
        />

        {!loading && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
