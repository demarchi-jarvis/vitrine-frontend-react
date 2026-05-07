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

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  confirmarSenha: z.string(),
}).refine((d) => d.senha === d.confirmarSenha, {
  message: 'As senhas não conferem',
  path: ['confirmarSenha'],
});

type FormData = z.infer<typeof schema>;

export default function RegistrarPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit({ confirmarSenha: _confirmarSenha, ...data }: FormData) {
    try {
      const authRes = await registrar(data);

      await fetch('/api/auth?action=registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authRes),
      });

      const perfil = await getUsuarioLogado(authRes.token);
      setAuth(perfil, authRes.token);

      toast.success('Conta criada com sucesso!');
      router.push(ROUTES.painel);
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao registrar');
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
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-terracotta-600 flex items-center justify-center">
            <span className="text-sand-50 font-serif font-bold">V</span>
          </div>
          <span className="font-serif text-xl font-semibold text-wood-900">Vitrine do Artesanato</span>
        </div>

        <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-1">Criar conta</h1>
        <p className="text-wood-400 text-sm mb-8">Junte-se à comunidade de artesãos do Vale do Café.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Nome completo"
            autoComplete="name"
            error={errors.nome?.message}
            {...register('nome')}
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            error={errors.telefone?.message}
            {...register('telefone')}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={errors.senha?.message}
            {...register('senha')}
          />
          <Input
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            error={errors.confirmarSenha?.message}
            {...register('confirmarSenha')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Criar conta
          </Button>
        </form>

        <p className="text-wood-500 text-sm text-center mt-6">
          Já tem conta?{' '}
          <Link href={ROUTES.entrar} className="text-terracotta-600 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
