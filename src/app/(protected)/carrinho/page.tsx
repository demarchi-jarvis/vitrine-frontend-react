'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CarrinhoItem } from '@/components/carrinho/CarrinhoItem';
import { Button } from '@/components/ui/Button';
import { useCarrinhoStore } from '@/store/carrinho.store';
import { useAuthStore } from '@/store/auth.store';
import { getEnderecoUsuario } from '@/lib/api/endereco';
import { criarPedido } from '@/lib/api/pedido';
import { formatBRL } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { EnderecoResponse } from '@/types';
import Link from 'next/link';

export default function CarrinhoPage() {
  const { itens, subtotal, limpar } = useCarrinhoStore();
  const { usuario, token } = useAuthStore();
  const router = useRouter();

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
      toast.error('Cadastre um endereço de entrega antes de finalizar.');
      router.push(ROUTES.perfil);
      return;
    }
    if (itens.length === 0) return;

    // BUG-02/03/04 fix: group by vendor, create one pedido per vendor
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
              // BUG-02 fix: real clienteId from auth store
              clienteId: usuario.id,
              // BUG-03 fix: real vendedorId from item.autorId
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
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao finalizar pedido');
    } finally {
      setFinalizando(false);
    }
  }

  if (itens.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart strokeWidth={1.0} className="w-16 h-16 text-wood-200 mb-5" />
        <h1 className="font-serif text-wood-900 text-2xl font-semibold mb-2">Carrinho vazio</h1>
        <p className="text-wood-400 text-sm mb-8">Adicione peças do bazar para continuar.</p>
        <Link
          href={ROUTES.bazar}
          className="px-6 py-3 rounded-full bg-terracotta-600 text-sand-50 text-sm font-medium hover:bg-terracotta-700 transition-colors"
        >
          Ir ao bazar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-8">Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {itens.map((item) => (
                <CarrinhoItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 bg-sand-100 rounded-3xl border border-sand-200">
              <h2 className="font-serif text-wood-900 text-lg font-semibold mb-5">Resumo</h2>

              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-wood-500">Subtotal</span>
                  <span className="text-wood-900 font-medium">{formatBRL(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-wood-500">Frete</span>
                  <span className="text-green-600 text-xs font-medium">Grátis</span>
                </div>
              </div>

              <div className="flex justify-between font-semibold text-base border-t border-sand-200 pt-4 mb-6">
                <span className="text-wood-900">Total</span>
                <span className="text-terracotta-600">{formatBRL(subtotal())}</span>
              </div>

              {/* Delivery address info */}
              {loadingEndereco ? (
                <div className="flex items-center gap-2 text-wood-400 text-xs mb-4">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Carregando endereço…
                </div>
              ) : endereco ? (
                <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-xs text-wood-600 mb-4">
                  <p className="font-medium text-wood-800 mb-0.5">Endereço de entrega</p>
                  <p>{endereco.rua}, {endereco.numero}</p>
                  <p>{endereco.bairro} — {endereco.cidade}/{endereco.estado}</p>
                </div>
              ) : (
                <div className="p-3 bg-ocre-300/30 border border-ocre-400/30 rounded-xl text-xs text-wood-700 mb-4">
                  <Link href={ROUTES.perfil} className="underline underline-offset-2 font-medium">
                    Cadastre um endereço
                  </Link>{' '}
                  antes de finalizar.
                </div>
              )}

              <Button
                onClick={handleFinalizar}
                loading={finalizando}
                disabled={!endereco || finalizando}
                className="w-full"
              >
                Finalizar pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
