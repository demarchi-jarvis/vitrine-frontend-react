import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quem Somos — Vitrine do Artesanato',
  description:
    'Conheça a história da Vitrine do Artesanato e o projeto Vassouras Tec que conecta artesãos do Vale do Café.',
};

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-3">
          Nossa história
        </p>
        <h1 className="font-serif text-wood-900 text-4xl sm:text-5xl font-semibold leading-tight mb-8">
          Quem Somos
        </h1>

        <div className="prose prose-stone max-w-none space-y-6 text-wood-700 leading-relaxed">
          <p className="text-xl text-wood-600 leading-relaxed">
            A <strong className="text-wood-900">Vitrine do Artesanato</strong> nasceu dentro do
            programa <strong className="text-terracotta-600">Vassouras Tec</strong>, uma iniciativa
            da Prefeitura de Vassouras, RJ, que transforma cidadãos em criadores de soluções digitais.
          </p>

          <p>
            O Vale do Café é território de cultura, história e trabalho manual. Aqui, famílias inteiras
            dominam técnicas centenárias — tapeçaria, cerâmica, marcenaria, bordado, biojóias. Mas essas
            histórias raramente chegam além das feiras locais.
          </p>

          <p>
            Criamos esta plataforma para dar visibilidade às peças e às pessoas que as fazem. Cada
            produto cadastrado carrega um nome, uma técnica, uma origem. Aqui você não compra de um
            estoque anônimo — você compra diretamente do artesão.
          </p>

          <h2 className="font-serif text-wood-900 text-2xl font-semibold mt-10 mb-4">
            Nossa missão
          </h2>
          <p>
            Conectar artesãos do Vale do Café com compradores que valorizam o feito à mão. Gerar renda
            digna para quem transforma matéria-prima em arte. Preservar técnicas tradicionais através
            do comércio justo e da visibilidade digital.
          </p>

          <h2 className="font-serif text-wood-900 text-2xl font-semibold mt-10 mb-4">
            Vassouras Tec
          </h2>
          <p>
            O programa Vassouras Tec capacita moradores de Vassouras e região em desenvolvimento de
            software, design e empreendedorismo digital. Este marketplace é um dos projetos construídos
            pelos participantes — da concepção à implementação.
          </p>
        </div>
      </div>
    </div>
  );
}
