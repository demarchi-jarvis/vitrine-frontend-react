'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, MapPin, Mail } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const links = {
  loja: [
    { label: 'Bazar', href: ROUTES.bazar },
    { label: 'Quem Somos', href: ROUTES.quemSomos },
    { label: 'Demandas', href: ROUTES.demandas },
  ],
  conta: [
    { label: 'Entrar', href: ROUTES.entrar },
    { label: 'Registrar', href: ROUTES.registrar },
    { label: 'Meu Painel', href: ROUTES.painel },
    { label: 'Meu Perfil', href: ROUTES.perfil },
  ],
};

export function Footer() {
  return (
    <footer className="bg-wood-900 text-sand-100 pt-16 pb-8 mt-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-terracotta-600 flex items-center justify-center">
                <span className="text-sand-50 font-serif font-bold text-sm">V</span>
              </div>
              <span className="font-serif text-xl font-semibold text-sand-50">Vitrine do Artesanato</span>
            </div>
            <p className="text-wood-300 text-sm leading-relaxed max-w-xs">
              Conectando artesãos do Vale do Café com admiradores de arte e cultura.
              Peças únicas, histórias reais.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-wood-300 text-sm">
              <MapPin strokeWidth={1.25} className="w-4 h-4 flex-shrink-0" />
              <span>Vassouras, Rio de Janeiro</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-wood-300 text-sm">
              <Mail strokeWidth={1.25} className="w-4 h-4 flex-shrink-0" />
              <a href="mailto:contato@vitrineartesanato.com.br" className="hover:text-terracotta-400 transition-colors">
                contato@vitrineartesanato.com.br
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sand-50 font-medium text-sm uppercase tracking-widest mb-4">Loja</h4>
              <ul className="space-y-2.5">
                {links.loja.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-wood-300 text-sm hover:text-terracotta-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sand-50 font-medium text-sm uppercase tracking-widest mb-4">Conta</h4>
              <ul className="space-y-2.5">
                {links.conta.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-wood-300 text-sm hover:text-terracotta-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social + newsletter teaser */}
          <div>
            <h4 className="text-sand-50 font-medium text-sm uppercase tracking-widest mb-4">Redes Sociais</h4>
            <div className="flex gap-3 mb-6">
              {[
                { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
              ].map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-wood-800 flex items-center justify-center text-wood-300 hover:text-terracotta-400 hover:bg-wood-700 transition-colors"
                >
                  <Icon strokeWidth={1.25} className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="text-wood-400 text-xs leading-relaxed">
              Acompanhe novidades, histórias de artesãos e lançamentos exclusivos.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-wood-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-wood-500 text-xs">
          <span>© {new Date().getFullYear()} Vitrine do Artesanato. Todos os direitos reservados.</span>
          <span>Vassouras Tec · Vale do Café, RJ</span>
        </div>
      </div>
    </footer>
  );
}
