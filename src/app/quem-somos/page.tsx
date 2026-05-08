import type { Metadata } from 'next';
import { QuemSomosContent } from './QuemSomosContent';

export const metadata: Metadata = {
  title: 'Quem Somos — Vitrine do Artesanato',
  description:
    'Conheça a história da Vitrine do Artesanato e o projeto Vassouras Tec que conecta artesãos do Vale do Café.',
};

export default function QuemSomosPage() {
  return <QuemSomosContent />;
}
