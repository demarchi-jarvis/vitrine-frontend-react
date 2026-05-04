'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { login } from '@/lib/api/auth';
import { getUsuarioLogado } from '@/lib/api/usuario';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/lib/routes';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function EntrarPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      // 1. Get token from backend
      const authRes = await login(data);

      // 2. Save to httpOnly cookie via Route Handler (BUG-01 fix)
      await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authRes),
      });

      // 3. Load user profile
      const perfil = await getUsuarioLogado(authRes.token);

      // 4. Hydrate Zustand store (in-memory only; cookie is source of truth)
      setAuth(perfil, authRes.token);

      toast.success(`Bem-vindo, ${perfil.nome}!`);
      router.push(ROUTES.painel);
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao entrar');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-terracotta-600 flex items-center justify-center">
            <span className="text-sand-50 font-serif font-bold">V</span>
          </div>
          <span className="font-serif text-xl font-semibold text-wood-900">Vitrine do Artesanato</span>
        </div>

        <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-1">Entrar</h1>
        <p className="text-wood-400 text-sm mb-8">Acesse sua conta de artesão ou comprador.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={errors.senha?.message}
            {...register('senha')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Entrar
          </Button>
        </form>

        <p className="text-wood-500 text-sm text-center mt-6">
          Não tem conta?{' '}
          <Link href={ROUTES.registrar} className="text-terracotta-600 hover:underline font-medium">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
