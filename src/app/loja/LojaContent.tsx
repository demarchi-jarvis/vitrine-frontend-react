'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Store } from 'lucide-react';
import { ProdutoGrid } from '@/components/produto/ProdutoGrid';
import { getDonoLoja } from '@/lib/api/usuario';
import { getProdutosLoja } from '@/lib/api/produto';
import { useAuthStore } from '@/store/auth.store';
import type { Produto, Usuario } from '@/types';

export function LojaContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('loja') ?? '';
  const { token } = useAuthStore();

  const [dono, setDono] = useState<Usuario | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || !token) return;
    Promise.all([
      getDonoLoja(email, token),
      getProdutosLoja(email, token),
    ])
      .then(([donoData, produtosData]) => {
        setDono(donoData);
        setProdutos(produtosData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [email, token]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-sand-100 flex-shrink-0">
            {dono?.foto ? (
              <Image src={dono.foto} alt={dono.nome} fill className="object-cover" sizes="64px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store strokeWidth={1.25} className="w-7 h-7 text-wood-400" />
              </div>
            )}
          </div>
          <div>
            <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-0.5">Loja</p>
            <h1 className="font-serif text-wood-900 text-3xl font-semibold">
              {dono?.nome ?? (loading ? '…' : 'Artesão')}
            </h1>
            {dono?.email && <p className="text-wood-400 text-sm mt-0.5">{dono.email}</p>}
          </div>
        </div>

        <ProdutoGrid
          produtos={produtos}
          loading={loading}
          emptyMessage="Esta loja ainda não tem produtos cadastrados."
        />
      </div>
    </div>
  );
}
