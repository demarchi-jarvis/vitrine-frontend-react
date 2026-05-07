'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, Package, Settings, Plus } from 'lucide-react';
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

  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const totalItens = useCarrinhoStore((s) => s.totalItens());
  const { isLoggedIn, logout, usuario } = useAuth();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === ROUTES.home) return pathname === href;
    return pathname.startsWith(href);
  }

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
                className={cn(
                  'relative text-sm font-medium transition-colors duration-300 py-1',
                  isActive(link.href)
                    ? 'text-terracotta-600'
                    : 'text-wood-700 hover:text-terracotta-600',
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-terracotta-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
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
                <motion.button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>

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
                        { href: ROUTES.cadastrarProduto, label: 'Vender', icon: Plus },
                      ].map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-wood-700 hover:bg-sand-100 hover:text-terracotta-600 transition-colors cursor-pointer"
                        >
                          <Icon strokeWidth={1.25} className="w-4 h-4" />
                          {label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-terracotta-600 hover:bg-terracotta-600/10 transition-colors border-t border-sand-200 mt-1 cursor-pointer"
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
                  'focus-ring cursor-pointer',
                )}
              >
                Entrar
              </Link>
            )}

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen((o) => !o)}
              whileTap={{ scale: 0.92 }}
              className="lg:hidden p-2 rounded-full hover:bg-sand-100 transition-colors focus-ring cursor-pointer"
              aria-label="Abrir menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X strokeWidth={1.25} className="w-5 h-5 text-wood-900" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu strokeWidth={1.25} className="w-5 h-5 text-wood-900" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
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
            <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'font-medium py-3 px-3 rounded-xl border-b border-sand-200 last:border-0 transition-colors cursor-pointer',
                    isActive(link.href)
                      ? 'text-terracotta-600 bg-terracotta-600/5'
                      : 'text-wood-700 hover:text-terracotta-600 hover:bg-sand-100',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <Link
                  href={ROUTES.entrar}
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 px-6 py-3 rounded-full bg-terracotta-600 text-sand-50 text-center font-medium cursor-pointer"
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
