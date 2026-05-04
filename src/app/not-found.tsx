import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-terracotta-600 font-serif text-8xl font-semibold mb-4">404</p>
      <h1 className="font-serif text-wood-900 text-2xl font-semibold mb-2">Página não encontrada</h1>
      <p className="text-wood-400 text-sm mb-8">A página que você procura não existe ou foi removida.</p>
      <Link
        href={ROUTES.home}
        className="px-6 py-3 rounded-full bg-terracotta-600 text-sand-50 text-sm font-medium hover:bg-terracotta-700 transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
