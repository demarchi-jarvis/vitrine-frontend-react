'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Palette, Hammer, Leaf, Scissors } from 'lucide-react';
import Link from 'next/link';

const CATEGORIAS_DEMANDA = [
  { icon: Palette, label: 'Pintura & Arte' },
  { icon: Hammer, label: 'Marcenaria' },
  { icon: Leaf, label: 'Biojóias' },
  { icon: Scissors, label: 'Tapeçaria & Bordado' },
];

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5524999999999';

export default function DemandasPage() {
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [orcamento, setOrcamento] = useState('');

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao.trim()) return;
    const msg = [
      `*Solicitação de Encomenda — Vitrine do Artesanato*`,
      categoria ? `Categoria: ${categoria}` : '',
      orcamento ? `Orçamento estimado: ${orcamento}` : '',
      ``,
      `Descrição da peça:`,
      descricao,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener noreferrer');
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-3">
            Encomendas
          </p>
          <h1 className="font-serif text-wood-900 text-4xl sm:text-5xl font-semibold leading-tight mb-4">
            Demandas
          </h1>
          <p className="text-wood-500 text-lg mb-10 leading-relaxed">
            Não encontrou o que procura? Descreva a peça dos seus sonhos e conectamos você
            diretamente ao artesão ideal do Vale do Café.
          </p>

          {/* Category selection */}
          <div className="mb-8">
            <p className="text-sm font-medium text-wood-800 mb-3">Categoria da peça</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIAS_DEMANDA.map(({ icon: Icon, label }) => (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => setCategoria(categoria === label ? '' : label)}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    categoria === label
                      ? 'border-terracotta-600 bg-terracotta-600/5 text-terracotta-700'
                      : 'border-sand-200 bg-sand-100 text-wood-700 hover:border-terracotta-600/40'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      categoria === label ? 'bg-terracotta-600/15' : 'bg-sand-200'
                    }`}
                  >
                    <Icon strokeWidth={1.5} className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEnviar} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-wood-800 block mb-1.5">
                Descreva a peça que você quer
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={5}
                required
                placeholder="Ex: Cesto de vime grande com tampa, fundo oval, cores naturais…"
                className="w-full px-4 py-3 rounded-xl text-sm text-wood-900 placeholder:text-wood-400 bg-sand-100 border border-sand-200 focus:outline-none focus:border-terracotta-600 focus:ring-2 focus:ring-terracotta-600/20 transition-all duration-300 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-wood-800 block mb-1.5">
                Orçamento estimado (opcional)
              </label>
              <input
                type="text"
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
                placeholder="Ex: R$ 150 a R$ 300"
                className="w-full px-4 py-3 rounded-xl text-sm text-wood-900 placeholder:text-wood-400 bg-sand-100 border border-sand-200 focus:outline-none focus:border-terracotta-600 focus:ring-2 focus:ring-terracotta-600/20 transition-all duration-300"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-terracotta-600 text-sand-50 font-medium hover:bg-terracotta-700 transition-colors duration-300 cursor-pointer"
            >
              <MessageCircle strokeWidth={1.5} className="w-5 h-5" />
              Enviar demanda via WhatsApp
            </motion.button>
          </form>

          <p className="text-center text-wood-400 text-xs mt-6">
            Você será redirecionado ao WhatsApp para completar o envio.{' '}
            <Link href="/bazar" className="text-terracotta-600 hover:underline">
              Ou explore o bazar
            </Link>{' '}
            para peças disponíveis.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
