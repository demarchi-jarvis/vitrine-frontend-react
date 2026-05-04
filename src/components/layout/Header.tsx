'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, Package, Settings } from 'lucide-react';
import { useCarrinhoStore } from '@/store/carrinho.store';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: ROUTES.home, label: 'Início' },
  { href: ROUTES.bazar, label: 'Bazar' },
  { href: ROUTES.quemSomos, label: 'Quem Somos' },
  { href: ROUTES.demandas, label: 'Demandas' },
];

export function Header() {
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 80], [80, 60]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 0.1]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const totalItens = useCarrinhoStore((s) => s.totalItens());
  const { isLoggedIn, logout, usuario } = useAuth();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, []);

  return (
    <>
      <motion.header
        style={{ height }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Glass background layer */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-sand-50/90 backdrop-blur-md border-b border-sand-200"
        />
        <motion.div
          style={{ opacity: shadowOpacity }}
          className="absolute inset-x-0 bottom-0 h-px bg-wood-900/10"
        />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta-600 flex items-center justify-center">
              <span className="font-serif text-sand-50 text-sm font-bold">V</span>
            </div>
            <span className="font-serif text-wood-900 text-lg font-semibold hidden sm:block">
              Vitrine do Artesanato
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-wood-700 hover:text-terracotta-600 text-sm font-medium transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              href={ROUTES.carrinho}
              className="relative p-2 rounded-full hover:bg-sand-100 transition-colors duration-300 focus-ring"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart strokeWidth={1.25} className="w-5 h-5 text-wood-700" />
              <AnimatePresence>
                {totalItens > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-terracotta-600 text-sand-50 text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItens > 9 ? '9+' : totalItens}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="p-2 rounded-full hover:bg-sand-100 transition-colors duration-300 focus-ring"
                  aria-label="Menu do usuário"
                >
                  {usuario?.foto ? (
                    <Image
                      src={usuario.foto}
                      alt={usuario.nome}
                      width={28}
                      height={28}
                      className="rounded-full object-cover w-7 h-7"
                    />
                  ) : (
                    <User strokeWidth={1.25} className="w-5 h-5 text-wood-700" />
                  )}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-56 glass rounded-2xl overflow-hidden py-2"
                    >
                      <p className="px-4 py-2 text-xs text-wood-500 border-b border-sand-200">
                        {usuario?.nome} {usuario?.sobrenome}
                      </p>
                      {[
                        { href: ROUTES.painel, label: 'Painel', icon: Settings },
                        { href: ROUTES.perfil, label: 'Meu Perfil', icon: User },
                        { href: ROUTES.pedidos(), label: 'Pedidos', icon: Package },
                        { href: ROUTES.cadastrarProduto, label: 'Vender', icon: Package },
                      ].map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-wood-700 hover:bg-sand-100 hover:text-terracotta-600 transition-colors"
                        >
                          <Icon strokeWidth={1.25} className="w-4 h-4" />
                          {label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-terracotta-600 hover:bg-terracotta-600/10 transition-colors border-t border-sand-200 mt-1"
                      >
                        <LogOut strokeWidth={1.25} className="w-4 h-4" />
                        Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={ROUTES.entrar}
                className={cn(
                  'hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                  'bg-terracotta-600 text-sand-50 hover:bg-terracotta-700',
                  'transition-all duration-300 ease-organic hover:scale-[1.02]',
                  'focus-ring',
                )}
              >
                Entrar
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 rounded-full hover:bg-sand-100 transition-colors focus-ring"
              aria-label="Abrir menu"
            >
              {mobileOpen ? (
                <X strokeWidth={1.25} className="w-5 h-5 text-wood-900" />
              ) : (
                <Menu strokeWidth={1.25} className="w-5 h-5 text-wood-900" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-sand-200 lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-wood-700 hover:text-terracotta-600 font-medium py-2 border-b border-sand-200 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <Link
                  href={ROUTES.entrar}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-6 py-3 rounded-full bg-terracotta-600 text-sand-50 text-center font-medium"
                >
                  Entrar
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
