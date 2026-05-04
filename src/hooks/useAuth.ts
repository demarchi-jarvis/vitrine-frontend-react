'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/lib/routes';

export function useAuth() {
  const { usuario, token, isLoggedIn, clearAuth } = useAuthStore();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    clearAuth();
    router.push(ROUTES.home);
    router.refresh();
  }

  return { usuario, token, isLoggedIn, logout };
}
