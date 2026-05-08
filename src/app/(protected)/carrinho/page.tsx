'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Loader2, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { CarrinhoItem } from '@/components/carrinho/CarrinhoItem';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { useCarrinhoStore } from '@/store/carrinho.store';
import { useAuthStore } from '@/store/auth.store';
import { getEnderecoUsuario } from '@/lib/api/endereco';
import { criarPedido } from '@/lib/api/pedido';
import { formatBRL, getErrorMessage } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from '@/contexts/LanguageContext';
import type { EnderecoResponse } from '@/types';

export default function CarrinhoPage() {
  const { itens, subtotal, limpar } = useCarrinhoStore();
  const { usuario, token } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  const [endereco, setEndereco] = useState<EnderecoResponse | null>(null);
  const [loadingEndereco, setLoadingEndereco] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    if (!token) return;
    getEnderecoUsuario(token)
      .then(setEndereco)
      .catch(() => {})
      .finally(() => setLoadingEndereco(false));
  }, [token]);

  async function handleFinalizar() {
    if (!token || !usuario?.id) {
      toast.error('Você precisa estar logado.');
      return;
    }
    if (!endereco?.id) {
      toast.error('Cadastre um endereço antes de finalizar.');
      router.push(ROUTES.perfil);
      return;
    }
    if (itens.length === 0) return;

    const porVendedor = new Map<string, typeof itens>();
    for (const item of itens) {
      if (!item.autorId) {
        toast.error(`Produto "${item.nome}" sem vendedor. Remova e tente novamente.`);
        return;
      }
      const arr = porVendedor.get(item.autorId) ?? [];
      arr.push(item);
      porVendedor.set(item.autorId, arr);
    }

    setFinalizando(true);
    const dataEntrega = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const pedidos = await Promise.all(
        Array.from(porVendedor.entries()).map(([vendedorId, items]) =>
          criarPedido(
            {
              clienteId: usuario.id,
              vendedorId,
              enderecoEntregaId: endereco.id,
              dataEntrega,
              itens: items.map((i) => ({ produtoId: i.id, quantidade: i.quantidade })),
            },
            token,
          ),
        ),
      );
      limpar();
      toast.success(`${pedidos.length} pedido(s) realizado(s) com sucesso!`);
      router.push(ROUTES.pedidos('compras'));
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setFinalizando(false);
    }
  }

  if (itens.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xs"
        >
          <div className="w-20 h-20 rounded-3xl bg-surface mx-auto flex items-center justify-center mb-6">
            <ShoppingCart strokeWidth={1.0} className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-foreground text-2xl font-semibold mb-2">
            {t.cart.emptyTitle}
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {t.cart.emptyDesc}
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href={ROUTES.bazar}>
              {t.cart.explore}
              <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const totalItems = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <div className="min-h-screen pt-24 pb-32 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-foreground text-3xl font-semibold mb-2">{t.cart.title}</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {totalItems} {totalItems === 1 ? t.cart.item : t.cart.items}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {itens.map((item) => (
                <CarrinhoItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop order summary — sticky sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <OrderSummary
              subtotal={subtotal()}
              endereco={endereco}
              loadingEndereco={loadingEndereco}
              finalizando={finalizando}
              onFinalizar={handleFinalizar}
            />
          </div>
        </div>
      </div>

      {/* Mobile order summary — fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">{t.cart.total}</span>
            <span className="text-primary font-bold text-lg">{formatBRL(subtotal())}</span>
          </div>
          {loadingEndereco ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {t.cart.checkingAddress}
            </div>
          ) : !endereco ? (
            <Link
              href={ROUTES.perfil}
              className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs mb-3 font-medium"
            >
              <AlertCircle strokeWidth={1.5} className="w-3.5 h-3.5 flex-shrink-0" />
              {t.cart.addressCta}
              <ArrowRight strokeWidth={1.5} className="w-3 h-3 ml-auto" />
            </Link>
          ) : null}
          <Button
            onClick={handleFinalizar}
            loading={finalizando}
            disabled={!endereco || finalizando}
            className="w-full"
            size="lg"
          >
            {t.cart.finalize}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({
  subtotal,
  endereco,
  loadingEndereco,
  finalizando,
  onFinalizar,
}: {
  subtotal: number;
  endereco: EnderecoResponse | null;
  loadingEndereco: boolean;
  finalizando: boolean;
  onFinalizar: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-28 p-6 bg-surface rounded-3xl border border-border">
      <h2 className="font-serif text-foreground text-lg font-semibold mb-5">{t.cart.summary}</h2>

      <div className="space-y-2.5 mb-5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.cart.subtotal}</span>
          <span className="text-foreground font-medium">{formatBRL(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.cart.shipping}</span>
          <span className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wide">
            {t.cart.free}
          </span>
        </div>
      </div>

      <Separator className="mb-5" />

      <div className="flex justify-between font-bold text-base mb-6">
        <span className="text-foreground">{t.cart.total}</span>
        <span className="text-primary">{formatBRL(subtotal)}</span>
      </div>

      {/* Delivery address */}
      {loadingEndereco ? (
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {t.cart.loadingAddress}
        </div>
      ) : endereco ? (
        <div className="p-3.5 bg-background rounded-xl border border-border text-xs mb-5">
          <div className="flex items-start gap-2">
            <MapPin strokeWidth={1.25} className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground mb-0.5">{t.cart.delivery}</p>
              <p className="text-muted-foreground">
                {endereco.rua}, {endereco.numero}
              </p>
              <p className="text-muted-foreground">
                {endereco.bairro} — {endereco.cidade}/{endereco.estado}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href={ROUTES.perfil}
          className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl border-2 border-dashed border-amber-400/60 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-xs font-medium hover:border-amber-500 transition-colors"
        >
          <AlertCircle strokeWidth={1.5} className="w-4 h-4 flex-shrink-0" />
          <span>{t.cart.addressCta}</span>
          <ArrowRight strokeWidth={1.5} className="w-3.5 h-3.5 ml-auto" />
        </Link>
      )}

      <Button
        onClick={onFinalizar}
        loading={finalizando}
        disabled={!endereco || finalizando}
        className="w-full"
        size="lg"
      >
        {t.cart.finalize}
      </Button>
    </div>
  );
}
