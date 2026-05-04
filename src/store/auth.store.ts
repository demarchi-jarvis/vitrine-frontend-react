'use client';

import { create } from 'zustand';
import type { Perfil } from '@/types';

interface AuthStore {
  usuario: Perfil | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (usuario: Perfil, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,
  isLoggedIn: false,
  setAuth: (usuario, token) => set({ usuario, token, isLoggedIn: true }),
  clearAuth: () => set({ usuario: null, token: null, isLoggedIn: false }),
}));
