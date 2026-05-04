import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demandas — Vitrine do Artesanato',
  description: 'Solicite peças personalizadas aos artesãos do Vale do Café.',
};

export default function DemandasPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-3">
          Encomendas
        </p>
        <h1 className="font-serif text-wood-900 text-4xl sm:text-5xl font-semibold leading-tight mb-4">
          Demandas
        </h1>
        <p className="text-wood-500 text-lg mb-10 leading-relaxed">
          Não encontrou o que procura? Entre em contato com um artesão diretamente via WhatsApp
          e descreva sua peça ideal. Tapeçaria, cerâmica, marcenaria — criamos sob encomenda.
        </p>

        <div className="p-8 bg-sand-100 rounded-3xl border border-sand-200 text-center">
          <p className="text-wood-400 text-sm mb-2">
            Funcionalidade de demandas em breve
          </p>
          <p className="text-wood-600 text-base">
            Por enquanto, use o botão do WhatsApp para falar diretamente com nossos artesãos.
          </p>
        </div>
      </div>
    </div>
  );
}
