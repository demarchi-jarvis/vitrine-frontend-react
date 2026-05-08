'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  Settings,
  BarChart3,
  Plus,
  Store,
  TrendingUp,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { getUsuarioLogado } from '@/lib/api/usuario';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  {
    title: 'Meu Perfil',
    subtitle: 'Dados pessoais e endereço',
    icon: Settings,
    href: ROUTES.perfil,
    accent: false,
  },
  {
    title: 'Meus Pedidos',
    subtitle: 'Compras e vendas',
    icon: ShoppingBag,
    href: ROUTES.pedidos(),
    accent: false,
  },
  {
    title: 'Nova Peça',
    subtitle: 'Adicionar produto à vitrine',
    icon: Plus,
    href: ROUTES.cadastrarProduto,
    accent: true,
  },
  {
    title: 'Relatórios',
    subtitle: 'Receita e métricas',
    icon: BarChart3,
    href: ROUTES.gerenciarVendas,
    accent: false,
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

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
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">

        {/* ── Greeting ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-5 mb-8">
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-surface border-2 border-border flex-shrink-0">
              {usuario?.foto ? (
                <Image
                  src={usuario.foto}
                  alt={nome}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-terracotta-600/15">
                  <span className="font-serif text-terracotta-600 text-2xl font-bold">
                    {nome.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-sm">{saudacao},</p>
              <h1 className="font-serif text-foreground text-2xl sm:text-3xl font-semibold truncate">
                {loading ? (
                  <span className="inline-block w-36 h-7 skeleton rounded-lg" />
                ) : (
                  nome
                )}
              </h1>
              {usuario?.loja && (
                <div className="mt-1">
                  <Badge variant="success" size="sm">
                    <Store strokeWidth={1.5} className="w-3 h-3" />
                    Loja ativa
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Stats strip ── */}
          {usuario?.pontos != null && (
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-8">
              <StatCard
                label="Pontos"
                value={String(usuario.pontos)}
                icon={Star}
                accent
              />
              <StatCard
                label="Status"
                value={usuario.loja ? 'Vendedor' : 'Comprador'}
                icon={Store}
              />
              <StatCard
                label="Nível"
                value="Artesão"
                icon={TrendingUp}
              />
            </motion.div>
          )}
        </motion.div>

        <Separator className="mb-8" />

        {/* ── Quick actions grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-4"
          >
            Ações rápidas
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ title, subtitle, icon: Icon, href, accent }) => (
              <motion.div key={href} variants={fadeUp} whileHover={{ y: -3 }}>
                <Link
                  href={href}
                  className={cn(
                    'group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300',
                    accent
                      ? 'bg-primary text-primary-foreground border-primary/20 hover:bg-primary-hover shadow-lg shadow-primary/20'
                      : 'bg-surface border-border hover:border-border-strong hover:bg-surface-elevated',
                  )}
                >
                  <div
                    className={cn(
                      'p-3 rounded-xl flex-shrink-0',
                      accent
                        ? 'bg-white/20'
                        : 'bg-surface-elevated group-hover:bg-background transition-colors',
                    )}
                  >
                    <Icon
                      strokeWidth={1.25}
                      className={cn(
                        'w-5 h-5',
                        accent ? 'text-primary-foreground' : 'text-foreground',
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'font-semibold text-sm',
                        accent ? 'text-primary-foreground' : 'text-foreground',
                      )}
                    >
                      {title}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-0.5 truncate',
                        accent ? 'text-primary-foreground/70' : 'text-muted-foreground',
                      )}
                    >
                      {subtitle}
                    </p>
                  </div>
                  <ArrowRight
                    strokeWidth={1.5}
                    className={cn(
                      'w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity',
                      accent ? 'text-primary-foreground' : 'text-muted-foreground',
                    )}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── My products ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="p-5 bg-surface border border-border rounded-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-surface-elevated">
              <Package strokeWidth={1.25} className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">Meus produtos</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Ver e editar todas as peças cadastradas
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.perfil}
            className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline underline-offset-4 flex-shrink-0"
          >
            Ver todos
            <ArrowRight strokeWidth={1.5} className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-2xl border text-center',
        accent
          ? 'bg-primary/10 border-primary/20'
          : 'bg-surface border-border',
      )}
    >
      <div className="flex justify-center mb-2">
        <Icon
          strokeWidth={1.25}
          className={cn('w-5 h-5', accent ? 'text-primary' : 'text-muted-foreground')}
        />
      </div>
      <p
        className={cn(
          'text-lg font-bold',
          accent ? 'text-primary' : 'text-foreground',
        )}
      >
        {value}
      </p>
      <p className="text-muted-foreground text-xs mt-0.5">{label}</p>
    </div>
  );
}
