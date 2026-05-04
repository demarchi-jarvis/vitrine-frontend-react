'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Package, Loader2 } from 'lucide-react';
import { PerfilForm } from '@/components/perfil/PerfilForm';
import { EnderecoForm } from '@/components/perfil/EnderecoForm';
import { ProdutoGrid } from '@/components/produto/ProdutoGrid';
import { useAuthStore } from '@/store/auth.store';
import { getUsuarioLogado } from '@/lib/api/usuario';
import { getMeusProdutos } from '@/lib/api/produto';
import type { Perfil, Produto } from '@/types';

type Tab = 'perfil' | 'endereco' | 'produtos';

const TABS: { id: Tab; label: string; Icon: typeof User }[] = [
  { id: 'perfil', label: 'Dados pessoais', Icon: User },
  { id: 'endereco', label: 'Endereço', Icon: MapPin },
  { id: 'produtos', label: 'Meus produtos', Icon: Package },
];

export default function PerfilPage() {
  const { token, usuario, setAuth } = useAuthStore();
  const [perfil, setPerfil] = useState<Perfil | null>(usuario);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loadingPerfil, setLoadingPerfil] = useState(!usuario);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('perfil');

  useEffect(() => {
    if (!token || usuario) { setLoadingPerfil(false); return; }
    getUsuarioLogado(token)
      .then((p) => { setPerfil(p); setAuth(p, token); })
      .finally(() => setLoadingPerfil(false));
  }, [token, usuario, setAuth]);

  useEffect(() => {
    if (activeTab !== 'produtos' || !token) return;
    setLoadingProdutos(true);
    getMeusProdutos(token)
      .then(setProdutos)
      .catch(() => setProdutos([]))
      .finally(() => setLoadingProdutos(false));
  }, [activeTab, token]);

  if (loadingPerfil) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta-600" />
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-8">Meu Perfil</h1>

        {/* Tab nav */}
        <div className="flex gap-2 mb-8 border-b border-sand-200 pb-0">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300 -mb-px ${
                activeTab === id
                  ? 'border-terracotta-600 text-terracotta-600'
                  : 'border-transparent text-wood-500 hover:text-wood-900'
              }`}
            >
              <Icon strokeWidth={1.25} className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'perfil' && <PerfilForm perfil={perfil} />}
          {activeTab === 'endereco' && <EnderecoForm />}
          {activeTab === 'produtos' && (
            <ProdutoGrid
              produtos={produtos}
              loading={loadingProdutos}
              showOwnerActions
              emptyMessage="Você ainda não cadastrou nenhum produto."
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
