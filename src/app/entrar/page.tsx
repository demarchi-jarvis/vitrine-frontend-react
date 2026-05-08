'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
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
import { sanitizeRedirect } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from '@/contexts/LanguageContext';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

function EntrarForm() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get('redirect') ?? '/painel');
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      // 1. Authenticate with backend
      const authRes = await login(data);

      // 2. Store token in httpOnly cookie (no query params — prevents log leakage)
      const cookieRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authRes),
      });
      if (!cookieRes.ok) throw new Error('Falha ao estabelecer sessão.');

      // 3. Load full profile
      const perfil = await getUsuarioLogado(authRes.token);

      // 4. Hydrate in-memory store (cookie is the source of truth for auth)
      setAuth(perfil, authRes.token);

      toast.success(`Bem-vindo, ${perfil.nome}!`);
      router.push(redirectTo);
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'E-mail ou senha incorretos.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label={t.auth.email}
        type="email"
        autoComplete="email"
        placeholder={t.auth.emailPlaceholder}
        required
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={t.auth.password}
        type="password"
        autoComplete="current-password"
        placeholder={t.auth.passwordPlaceholder}
        required
        error={errors.senha?.message}
        {...register('senha')}
      />
      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        {t.auth.loginBtn}
      </Button>
    </form>
  );
}

export default function EntrarPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-wood-900 relative overflow-hidden items-end p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-wood-900 via-wood-800 to-terracotta-900/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <p className="text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-4">
            Vitrine do Artesanato
          </p>
          <h2 className="font-serif text-sand-50 text-4xl font-semibold leading-tight mb-4">
            {t.auth.loginDecorTitle}
          </h2>
          <p className="text-wood-300 text-sm leading-relaxed max-w-xs">
            {t.auth.loginDecorDesc}
          </p>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-terracotta-600 flex items-center justify-center">
              <span className="text-sand-50 font-serif font-bold">V</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Vitrine do Artesanato
            </span>
          </Link>

          <h1 className="font-serif text-foreground text-3xl font-semibold mb-1">{t.auth.loginTitle}</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {t.auth.loginSubtitle}
          </p>

          <Suspense>
            <EntrarForm />
          </Suspense>

          <p className="text-muted-foreground text-sm text-center mt-6">
            {t.auth.noAccount}{' '}
            <Link
              href={ROUTES.registrar}
              className="text-primary hover:underline underline-offset-4 font-medium"
            >
              {t.auth.createFree}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
