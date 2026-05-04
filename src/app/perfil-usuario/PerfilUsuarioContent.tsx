'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { getDonoLoja } from '@/lib/api/usuario';
import { getProdutosLoja } from '@/lib/api/produto';
import { ProdutoGrid } from '@/components/produto/ProdutoGrid';
import { ROUTES } from '@/lib/routes';
import { useAuthStore } from '@/store/auth.store';
import type { Usuario, Produto } from '@/types';

export function PerfilUsuarioContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const { token } = useAuthStore();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || !token) return;
    Promise.all([
      getDonoLoja(email, token),
      getProdutosLoja(email, token),
    ])
      .then(([u, p]) => {
        setUsuario(u);
        setProdutos(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [email, token]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-12 p-6 bg-sand-100 rounded-3xl border border-sand-200">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-sand-200 flex-shrink-0">
            {usuario?.foto ? (
              <Image src={usuario.foto} alt={usuario.nome} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store strokeWidth={1.25} className="w-8 h-8 text-wood-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-wood-900 text-2xl font-semibold">
              {usuario?.nome ?? (loading ? '…' : 'Artesão')}
            </h1>
            {usuario?.email && <p className="text-wood-400 text-sm mt-1">{usuario.email}</p>}
            {usuario?.pontos != null && (
              <p className="text-ocre-600 text-sm mt-1 font-medium">{usuario.pontos} pontos</p>
            )}
          </div>
          {usuario?.loja && (
            <Link
              href={ROUTES.loja(email)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-600 text-sand-50 text-sm font-medium hover:bg-terracotta-700 transition-colors"
            >
              <Store strokeWidth={1.25} className="w-4 h-4" />
              Ver loja
            </Link>
          )}
        </div>

        <h2 className="font-serif text-wood-900 text-xl font-semibold mb-6">Peças disponíveis</h2>
        <ProdutoGrid
          produtos={produtos}
          loading={loading}
          emptyMessage="Este artesão ainda não publicou produtos."
        />
      </div>
    </div>
  );
}
