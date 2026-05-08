'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { PedidoCard } from '@/components/pedidos/PedidoCard';
import { PedidoToggle } from '@/components/pedidos/PedidoToggle';
import { Pagination } from '@/components/ui/Pagination';
import { getCompras, getVendas } from '@/lib/api/pedido';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ItemPedido } from '@/types';

const PAGE_SIZE = 10;

export function PedidosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { t } = useTranslation();

  const [estado, setEstado] = useState<'compras' | 'vendas'>(
    (searchParams.get('estado') as 'compras' | 'vendas') ?? 'compras',
  );
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 0));
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const fetcher = estado === 'compras' ? getCompras : getVendas;
    fetcher(page, PAGE_SIZE, token)
      .then((res) => {
        setItens(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => setItens([]))
      .finally(() => setLoading(false));

    const sp = new URLSearchParams({ estado, page: String(page) });
    router.replace(`/pedidos?${sp}`, { scroll: false });
  }, [estado, page, token, router]);

  function handleEstadoChange(e: 'compras' | 'vendas') {
    setEstado(e);
    setPage(0);
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <h1 className="font-serif text-foreground text-3xl font-semibold mb-2">{t.orders.title}</h1>
        <p className="text-muted-foreground text-sm mb-6">
          {t.orders.subtitle}
        </p>

        <PedidoToggle estado={estado} onChange={handleEstadoChange} />

        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
                <ShoppingBag strokeWidth={1.0} className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">{t.orders.emptyTitle}</p>
              <p className="text-muted-foreground text-sm">
                {estado === 'compras' ? t.orders.emptyDescBuys : t.orders.emptyDescSales}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {itens.map((item) => (
                <PedidoCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-10">
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
    </div>
  );
}
