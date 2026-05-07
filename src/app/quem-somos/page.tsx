import type { Metadata } from 'next';
import { Users, MapPin, Heart, Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quem Somos — Vitrine do Artesanato',
  description:
    'Conheça a história da Vitrine do Artesanato e o projeto Vassouras Tec que conecta artesãos do Vale do Café.',
};

const STATS = [
  { value: '100+', label: 'Artesãos cadastrados' },
  { value: '500+', label: 'Peças disponíveis' },
  { value: '15+', label: 'Categorias de arte' },
  { value: 'RJ', label: 'Vale do Café' },
];

const VALORES = [
  {
    icon: Users,
    title: 'Comunidade',
    desc: 'Conectamos artesãos entre si e com compradores que valorizam o feito à mão.',
  },
  {
    icon: Heart,
    title: 'Autenticidade',
    desc: 'Cada peça tem nome, origem e história. Aqui não existe estoque anônimo.',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade',
    desc: 'Valorizamos técnicas tradicionais, matérias-primas locais e economia circular.',
  },
  {
    icon: MapPin,
    title: 'Território',
    desc: 'O Vale do Café é berço de técnicas centenárias — tapeçaria, cerâmica, biojóias e mais.',
  },
];

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-3">
          Nossa história
        </p>
        <h1 className="font-serif text-wood-900 text-4xl sm:text-5xl font-semibold leading-tight mb-6">
          Quem Somos
        </h1>
        <p className="text-xl text-wood-600 leading-relaxed max-w-2xl">
          A <strong className="text-wood-900">Vitrine do Artesanato</strong> nasceu dentro do
          programa <strong className="text-terracotta-600">Vassouras Tec</strong> — uma iniciativa
          que transforma cidadãos em criadores de soluções digitais para a sua própria comunidade.
        </p>
      </div>

      {/* Stats strip */}
      <div className="mt-16 bg-wood-900 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-terracotta-400 text-4xl font-bold">{value}</p>
                <p className="text-wood-300 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl mt-16">
        <div className="space-y-6 text-wood-700 leading-relaxed">
          <p>
            O Vale do Café é território de cultura, história e trabalho manual. Aqui, famílias
            inteiras dominam técnicas centenárias — tapeçaria, cerâmica, marcenaria, bordado,
            biojóias. Mas essas histórias raramente chegavam além das feiras locais.
          </p>
          <p>
            Criamos esta plataforma para dar visibilidade às peças e às pessoas que as fazem. Cada
            produto cadastrado carrega um nome, uma técnica, uma origem. Aqui você não compra de um
            estoque anônimo — você compra diretamente do artesão.
          </p>
        </div>

        {/* Valores */}
        <h2 className="font-serif text-wood-900 text-2xl font-semibold mt-16 mb-8">
          Nossos valores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALORES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 bg-sand-100 rounded-2xl border border-sand-200 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-terracotta-600/10 flex items-center justify-center flex-shrink-0">
                <Icon strokeWidth={1.5} className="w-5 h-5 text-terracotta-600" />
              </div>
              <div>
                <h3 className="font-semibold text-wood-900 text-sm mb-1">{title}</h3>
                <p className="text-wood-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Vassouras Tec */}
        <div className="mt-16 p-8 bg-wood-900 rounded-3xl">
          <p className="text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-3">
            Sobre o programa
          </p>
          <h2 className="font-serif text-sand-50 text-2xl font-semibold mb-4">Vassouras Tec</h2>
          <p className="text-wood-300 leading-relaxed">
            O programa Vassouras Tec capacita moradores de Vassouras e região em desenvolvimento de
            software, design e empreendedorismo digital. Este marketplace é um dos projetos
            construídos pelos participantes — da concepção ao deploy, por quem conhece e vive a
            cultura local.
          </p>
        </div>
      </div>
    </div>
  );
}
