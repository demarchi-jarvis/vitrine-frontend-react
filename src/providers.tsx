'use client';

import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import Lenis from 'lenis';
import { useAuthStore } from '@/store/auth.store';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import type { Perfil } from '@/types';

function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

function AuthHydrator() {
  const { isLoggedIn, setAuth } = useAuthStore();
  const hasHydrated = useRef(false);

  useEffect(() => {
    // Guard prevents double-hydration if component re-mounts (StrictMode, etc.)
    if (hasHydrated.current || isLoggedIn) return;
    hasHydrated.current = true;

    fetch('/api/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { perfil: Perfil; token: string } | null) => {
        if (data?.perfil && data?.token) setAuth(data.perfil, data.token);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <AuthHydrator />
          <LenisProvider>
            {children}
            <LanguageSelector />
            <Toaster
              richColors
              position="top-right"
              toastOptions={{
                classNames: { toast: 'font-sans' },
              }}
            />
          </LenisProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
