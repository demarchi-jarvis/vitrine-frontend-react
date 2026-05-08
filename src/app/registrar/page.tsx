'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registrar } from '@/lib/api/auth';
import { getUsuarioLogado } from '@/lib/api/usuario';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from '@/contexts/LanguageContext';

const schema = z
  .object({
    nome: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('E-mail inválido'),
    telefone: z
      .string()
      .min(10, 'Telefone inválido')
      .regex(/^\D*\d{10,11}\D*$/, 'Informe um telefone com DDD (10 ou 11 dígitos)'),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

type FormData = z.infer<typeof schema>;

export default function RegistrarPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit({ confirmarSenha: _confirmarSenha, ...data }: FormData) {
    try {
      const authRes = await registrar(data);

      // Store token in httpOnly cookie (no query params — prevents log leakage)
      const cookieRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authRes),
      });
      if (!cookieRes.ok) throw new Error('Falha ao estabelecer sessão.');

      const perfil = await getUsuarioLogado(authRes.token);
      setAuth(perfil, authRes.token);

      toast.success('Conta criada com sucesso! Bem-vindo(a)!');
      router.push(ROUTES.painel);
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao criar conta. Tente novamente.');
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-wood-900 relative overflow-hidden items-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-wood-900 via-wood-800 to-terracotta-900/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <p className="text-terracotta-400 text-xs font-medium uppercase tracking-widest mb-4">
            {t.auth.registerDecorBadge}
          </p>
          <h2 className="font-serif text-sand-50 text-4xl font-semibold leading-tight mb-4">
            {t.auth.registerDecorTitle}
          </h2>
          <p className="text-wood-300 text-sm leading-relaxed max-w-xs">
            {t.auth.registerDecorDesc}
          </p>
          <div className="mt-8 space-y-3">
            {(t.auth.registerBenefits as readonly string[]).map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sand-300 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-start justify-center px-4 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link href={ROUTES.home} className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-terracotta-600 flex items-center justify-center">
              <span className="text-sand-50 font-serif font-bold">V</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Vitrine do Artesanato
            </span>
          </Link>

          <h1 className="font-serif text-foreground text-3xl font-semibold mb-1">{t.auth.registerTitle}</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {t.auth.registerSubtitle}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t.auth.name}
              autoComplete="name"
              placeholder={t.auth.namePlaceholder}
              required
              error={errors.nome?.message}
              {...register('nome')}
            />
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
              label={t.auth.phone}
              type="tel"
              autoComplete="tel"
              placeholder="(24) 99999-0000"
              hint={t.auth.phoneHint}
              error={errors.telefone?.message}
              {...register('telefone')}
            />
            <Input
              label={t.auth.password}
              type="password"
              autoComplete="new-password"
              placeholder={t.auth.passwordMin}
              required
              error={errors.senha?.message}
              {...register('senha')}
            />
            <Input
              label={t.auth.confirmPassword}
              type="password"
              autoComplete="new-password"
              placeholder={t.auth.repeatPassword}
              required
              error={errors.confirmarSenha?.message}
              {...register('confirmarSenha')}
            />
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              {t.auth.registerBtn}
            </Button>
          </form>

          <p className="text-muted-foreground text-sm text-center mt-6">
            {t.auth.hasAccount}{' '}
            <Link
              href={ROUTES.entrar}
              className="text-primary hover:underline underline-offset-4 font-medium"
            >
              {t.auth.signIn}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
