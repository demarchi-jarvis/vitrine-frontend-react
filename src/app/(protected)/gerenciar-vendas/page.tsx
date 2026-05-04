'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getVendas } from '@/lib/api/pedido';
import { useAuthStore } from '@/store/auth.store';
import { formatBRL } from '@/lib/utils';
import type { ItemPedido } from '@/types';

interface MesData {
  mes: string;
  total: number;
  quantidade: number;
}

function buildChartData(itens: ItemPedido[]): MesData[] {
  const map = new Map<string, MesData>();
  for (const item of itens) {
    const raw = item.pedido?.dataCriacao ?? item.pedido?.dataEntrega;
    if (!raw) continue;
    const date = new Date(raw);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    const existing = map.get(key);
    if (existing) {
      existing.total += item.produto.preco * item.quantidade;
      existing.quantidade += item.quantidade;
    } else {
      map.set(key, { mes: label, total: item.produto.preco * item.quantidade, quantidade: item.quantidade });
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

export default function GerenciarVendasPage() {
  const { token } = useAuthStore();
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    // Fetch up to 200 items to build meaningful chart
    getVendas(0, 200, token)
      .then((res) => setItens(res.content))
      .catch(() => setItens([]))
      .finally(() => setLoading(false));
  }, [token]);

  const chartData = buildChartData(itens);
  const totalGeral = itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
  const totalPedidos = itens.length;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-2">
          Relatórios
        </p>
        <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-8">
          Gerenciar Vendas
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta-600" />
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-sand-100 rounded-3xl border border-sand-200"
              >
                <p className="text-wood-400 text-xs uppercase tracking-widest mb-1">Receita total</p>
                <p className="font-serif text-terracotta-600 text-3xl font-semibold">{formatBRL(totalGeral)}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="p-6 bg-sand-100 rounded-3xl border border-sand-200"
              >
                <p className="text-wood-400 text-xs uppercase tracking-widest mb-1">Itens vendidos</p>
                <p className="font-serif text-wood-900 text-3xl font-semibold">{totalPedidos}</p>
              </motion.div>
            </div>

            {/* Chart */}
            {chartData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-sand-100 rounded-3xl border border-sand-200"
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp strokeWidth={1.25} className="w-5 h-5 text-terracotta-600" />
                  <h2 className="font-serif text-wood-900 text-lg font-semibold">Vendas por mês</h2>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" vertical={false} />
                    <XAxis
                      dataKey="mes"
                      tick={{ fontSize: 12, fill: '#8B6F47' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 12, fill: '#8B6F47' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatBRL(value), 'Receita']}
                      contentStyle={{
                        background: '#FAF7F2',
                        border: '1px solid #E8DDD0',
                        borderRadius: '12px',
                        fontSize: '13px',
                      }}
                      cursor={{ fill: 'rgba(226,114,91,0.08)' }}
                    />
                    <Bar dataKey="total" fill="#E2725B" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="text-wood-400">Nenhuma venda registrada ainda.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
