'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, MapPin, Mail, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useTranslation();

  const links = {
    loja: [
      { label: t.nav.bazar, href: ROUTES.bazar },
      { label: t.nav.about, href: ROUTES.quemSomos },
      { label: t.nav.demands, href: ROUTES.demandas },
    ],
    conta: [
      { label: t.nav.login, href: ROUTES.entrar },
      { label: t.nav.register, href: ROUTES.registrar },
      { label: t.nav.panel, href: ROUTES.painel },
      { label: t.nav.profile, href: ROUTES.perfil },
    ],
  };

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
              <span className="font-serif text-xl font-semibold text-sand-50">
                Vitrine do Artesanato
              </span>
            </div>
            <p className="text-wood-300 text-sm leading-relaxed max-w-xs">
              {t.footer.desc}
            </p>
            <div className="space-y-2 mt-5">
              <div className="flex items-center gap-1.5 text-wood-400 text-sm">
                <MapPin strokeWidth={1.25} className="w-4 h-4 flex-shrink-0" />
                <span>{t.footer.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-wood-400 text-sm">
                <Mail strokeWidth={1.25} className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:contato@vitrineartesanato.com.br"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  contato@vitrineartesanato.com.br
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sand-50 font-semibold text-xs uppercase tracking-widest mb-5">
                {t.footer.shop}
              </h4>
              <ul className="space-y-3">
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
              <h4 className="text-sand-50 font-semibold text-xs uppercase tracking-widest mb-5">
                {t.footer.account}
              </h4>
              <ul className="space-y-3">
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

          {/* Social */}
          <div>
            <h4 className="text-sand-50 font-semibold text-xs uppercase tracking-widest mb-5">
              {t.footer.social}
            </h4>
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
              {t.footer.socialDesc}
            </p>
          </div>
        </div>

        <Separator className="bg-wood-800 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-wood-500 text-xs">
          <span>© {new Date().getFullYear()} Vitrine do Artesanato. {t.footer.rights}</span>
          <span className="flex items-center gap-1.5">
            {t.footer.madeWith} <Heart strokeWidth={1.5} className="w-3 h-3 text-terracotta-600" /> {t.footer.inValeDoCafe}
          </span>
        </div>
      </div>
    </footer>
  );
}
