'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, ToggleLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { atualizarPerfil, toggleLoja } from '@/lib/api/usuario';
import { useAuthStore } from '@/store/auth.store';
import type { Perfil } from '@/types';

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  foto: z.string().url('URL inválida').or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface PerfilFormProps {
  perfil: Perfil;
}

export function PerfilForm({ perfil }: PerfilFormProps) {
  const { token, setAuth } = useAuthStore();
  const [lojaAtiva, setLojaAtiva] = useState(perfil.loja);
  const [togglingLoja, setTogglingLoja] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: `${perfil.nome} ${perfil.sobrenome}`.trim(),
      cpf: perfil.cpf ?? '',
      telefone: perfil.telefone ?? '',
      foto: perfil.foto ?? '',
    },
  });

  useEffect(() => {
    reset({
      nome: `${perfil.nome} ${perfil.sobrenome}`.trim(),
      cpf: perfil.cpf ?? '',
      telefone: perfil.telefone ?? '',
      foto: perfil.foto ?? '',
    });
    setLojaAtiva(perfil.loja);
  }, [perfil, reset]);

  async function onSubmit(data: FormData) {
    if (!token) return;
    try {
      const updated = await atualizarPerfil(data, token);
      setAuth(updated, token);
      toast.success('Perfil atualizado!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao atualizar perfil');
    }
  }

  async function handleToggleLoja() {
    if (!token) return;
    setTogglingLoja(true);
    try {
      const updated = await toggleLoja({ status: !lojaAtiva }, token);
      setLojaAtiva(updated.loja);
      setAuth(updated, token);
      toast.success(updated.loja ? 'Loja ativada!' : 'Loja desativada.');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao alterar loja');
    } finally {
      setTogglingLoja(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Toggle Loja */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-sand-100 border border-sand-200">
        <div>
          <p className="text-wood-900 font-medium text-sm">Status da loja</p>
          <p className="text-wood-400 text-xs mt-0.5">
            {lojaAtiva ? 'Sua loja está ativa e visível.' : 'Sua loja está desativada.'}
          </p>
        </div>
        <button
          onClick={handleToggleLoja}
          disabled={togglingLoja}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            lojaAtiva
              ? 'bg-terracotta-600 text-sand-50 hover:bg-terracotta-700'
              : 'bg-sand-200 text-wood-700 hover:bg-sand-300'
          }`}
        >
          <AnimatePresence mode="wait">
            {lojaAtiva ? (
              <motion.span key="on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <Store strokeWidth={1.25} className="w-4 h-4" /> Ativa
              </motion.span>
            ) : (
              <motion.span key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <ToggleLeft strokeWidth={1.25} className="w-4 h-4" /> Inativa
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Nome completo" error={errors.nome?.message} {...register('nome')} />
        <Input label="CPF" placeholder="000.000.000-00" error={errors.cpf?.message} {...register('cpf')} />
        <Input label="Telefone" placeholder="(00) 00000-0000" error={errors.telefone?.message} {...register('telefone')} />
        <Input label="URL da foto" placeholder="https://…" error={errors.foto?.message} {...register('foto')} />

        <div className="pt-2">
          <Input label="E-mail" value={perfil.email} disabled hint="O e-mail não pode ser alterado." />
        </div>

        <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="w-full">
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
