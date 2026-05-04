'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Settings, BarChart3, Plus, Store } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { getUsuarioLogado } from '@/lib/api/usuario';
import { ROUTES } from '@/lib/routes';

const ACTIONS = [
  {
    title: 'Meu Perfil',
    subtitle: 'Edite seus dados e endereço',
    icon: Settings,
    href: ROUTES.perfil,
    color: 'bg-sand-100 hover:bg-sand-200',
  },
  {
    title: 'Meus Pedidos',
    subtitle: 'Compras e vendas realizadas',
    icon: ShoppingBag,
    href: ROUTES.pedidos(),
    color: 'bg-sand-100 hover:bg-sand-200',
  },
  {
    title: 'Cadastrar Produto',
    subtitle: 'Adicionar nova peça à vitrine',
    icon: Plus,
    href: ROUTES.cadastrarProduto,
    color: 'bg-terracotta-600 hover:bg-terracotta-700 text-sand-50',
    textColor: 'text-sand-50',
  },
  {
    title: 'Gerenciar Vendas',
    subtitle: 'Relatórios e gráficos',
    icon: BarChart3,
    href: ROUTES.gerenciarVendas,
    color: 'bg-sand-100 hover:bg-sand-200',
  },
];

export default function PainelPage() {
  const { usuario, token, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(!usuario);

  useEffect(() => {
    if (!token || usuario) return;
    getUsuarioLogado(token)
      .then((p) => setAuth(p, token))
      .finally(() => setLoading(false));
  }, [token, usuario, setAuth]);

  const nome = usuario?.nome ?? '';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-sand-200 flex-shrink-0">
            {usuario?.foto && (
              <Image src={usuario.foto} alt={nome} fill className="object-cover" sizes="56px" />
            )}
          </div>
          <div>
            <p className="text-wood-400 text-sm">Bem-vindo de volta,</p>
            <h1 className="font-serif text-wood-900 text-2xl font-semibold">
              {loading ? '…' : nome}
            </h1>
          </div>
        </motion.div>

        {/* Stats strip */}
        {usuario?.pontos != null && (
          <div className="flex gap-4 mb-8">
            <div className="flex-1 p-4 bg-sand-100 rounded-2xl border border-sand-200 text-center">
              <p className="text-2xl font-semibold text-terracotta-600">{usuario.pontos}</p>
              <p className="text-wood-500 text-xs mt-0.5">Pontos</p>
            </div>
            <div className="flex-1 p-4 bg-sand-100 rounded-2xl border border-sand-200 text-center">
              <p className="text-2xl font-semibold text-wood-900">
                {usuario.loja ? <Store strokeWidth={1.25} className="inline w-5 h-5 text-terracotta-600" /> : '—'}
              </p>
              <p className="text-wood-500 text-xs mt-0.5">
                {usuario.loja ? 'Loja ativa' : 'Sem loja'}
              </p>
            </div>
          </div>
        )}

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACTIONS.map(({ title, subtitle, icon: Icon, href, color, textColor }) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={href}
                className={`flex items-center gap-4 p-5 rounded-2xl border border-sand-200 transition-all duration-300 ${color}`}
              >
                <div className={`p-3 rounded-xl ${textColor ? 'bg-white/20' : 'bg-sand-200'}`}>
                  <Icon strokeWidth={1.25} className={`w-5 h-5 ${textColor ?? 'text-wood-700'}`} />
                </div>
                <div>
                  <p className={`font-medium text-sm ${textColor ?? 'text-wood-900'}`}>{title}</p>
                  <p className={`text-xs mt-0.5 ${textColor ? 'text-sand-200' : 'text-wood-400'}`}>
                    {subtitle}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* My products link */}
        <div className="mt-8 p-5 bg-sand-50 border border-sand-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package strokeWidth={1.25} className="w-5 h-5 text-wood-500" />
            <div>
              <p className="text-wood-900 text-sm font-medium">Meus produtos</p>
              <p className="text-wood-400 text-xs">Ver e editar suas peças cadastradas</p>
            </div>
          </div>
          <Link
            href={ROUTES.perfil}
            className="text-terracotta-600 text-sm hover:underline"
          >
            Ver todos →
          </Link>
        </div>
      </div>
    </div>
  );
}
