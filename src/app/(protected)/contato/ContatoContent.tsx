'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Store, User, MessageCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { getPerfis } from '@/lib/api/usuario';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { ROUTES } from '@/lib/routes';
import type { Usuario } from '@/types';

const PAGE_SIZE = 8;

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5524999999999';

export function ContatoContent() {
  const { token, usuario: eu } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [perfis, setPerfis] = useState<Usuario[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState(searchParams.get('nome') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 0));

  const debouncedBusca = useDebounce(busca, 400);

  const syncUrl = useCallback(
    (p: number, nome: string) => {
      const sp = new URLSearchParams();
      if (nome) sp.set('nome', nome);
      if (p) sp.set('page', String(p));
      router.replace(`/contato${sp.toString() ? `?${sp}` : ''}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getPerfis(token, page, PAGE_SIZE, debouncedBusca || undefined)
      .then((res) => {
        setPerfis(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => setPerfis([]))
      .finally(() => setLoading(false));
    syncUrl(page, debouncedBusca);
  }, [token, page, debouncedBusca, syncUrl]);

  function handleBusca(value: string) {
    setBusca(value);
    setPage(0);
  }

  function handleWhatsApp() {
    const msg = `*Contato via Vitrine do Artesanato*\nUsuário: ${eu?.nome ?? ''} (${eu?.email ?? ''})`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener noreferrer');
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-2">
            Comunidade
          </p>
          <h1 className="font-serif text-wood-900 text-4xl sm:text-5xl font-semibold leading-tight mb-3">
            Contatos
          </h1>
          <p className="text-wood-500 text-lg max-w-xl">
            Explore os artesãos da comunidade, visite suas lojas e veja seus perfis.
          </p>
        </motion.div>

        {/* Search + WhatsApp CTA */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search
              strokeWidth={1.25}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wood-400"
            />
            <input
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              placeholder="Buscar artesão por nome…"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-sand-100 border border-sand-200 focus:outline-none focus:border-terracotta-600 focus:ring-2 focus:ring-terracotta-600/20 transition-all duration-300"
            />
          </div>
          <motion.button
            onClick={handleWhatsApp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
          >
            <MessageCircle strokeWidth={1.5} className="w-4 h-4" />
            Falar com suporte
          </motion.button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta-600" />
          </div>
        ) : perfis.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-wood-400 text-lg">Nenhum artesão encontrado.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {perfis.map((perfil, i) => (
                <motion.div
                  key={perfil.id ?? perfil.email}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center p-6 bg-sand-100 rounded-3xl border border-sand-200 hover:shadow-md transition-shadow duration-300"
                >
                  {/* Avatar */}
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-sand-200 mb-4 flex-shrink-0">
                    {perfil.foto ? (
                      <Image
                        src={perfil.foto}
                        alt={perfil.nome}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User strokeWidth={1.25} className="w-8 h-8 text-wood-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-serif text-wood-900 text-lg font-semibold leading-tight">
                    {perfil.nome}
                  </h3>
                  <p className="text-wood-400 text-xs mt-1 truncate max-w-full">{perfil.email}</p>
                  {perfil.pontos != null && (
                    <p className="text-ocre-600 text-xs font-medium mt-1">{perfil.pontos} pontos</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-5 w-full">
                    <Link
                      href={ROUTES.loja(perfil.email)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-terracotta-600 text-sand-50 text-xs font-medium hover:bg-terracotta-700 transition-colors cursor-pointer"
                    >
                      <Store strokeWidth={1.5} className="w-3.5 h-3.5" />
                      Loja
                    </Link>
                    <Link
                      href={ROUTES.perfilUsuario(perfil.email)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sand-200 text-wood-700 text-xs font-medium hover:bg-sand-300 transition-colors cursor-pointer"
                    >
                      <User strokeWidth={1.5} className="w-3.5 h-3.5" />
                      Perfil
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
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
