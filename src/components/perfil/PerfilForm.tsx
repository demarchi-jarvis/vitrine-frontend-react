'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { atualizarPerfil, toggleLoja } from '@/lib/api/usuario';
import { useAuthStore } from '@/store/auth.store';
import type { Perfil } from '@/types';
import { cn } from '@/lib/utils';

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
      toast.success('Perfil atualizado com sucesso!');
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
      {/* ── Loja toggle ── */}
      <div className={cn(
        'flex items-center justify-between p-5 rounded-2xl border transition-all duration-300',
        lojaAtiva
          ? 'bg-primary/8 border-primary/20'
          : 'bg-surface border-border',
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2.5 rounded-xl transition-colors',
            lojaAtiva ? 'bg-primary/15' : 'bg-surface-elevated',
          )}>
            <Store
              strokeWidth={1.25}
              className={cn('w-5 h-5', lojaAtiva ? 'text-primary' : 'text-muted-foreground')}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-foreground font-medium text-sm">Status da loja</p>
              <Badge variant={lojaAtiva ? 'success' : 'default'} size="sm">
                {lojaAtiva ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">
              {lojaAtiva
                ? 'Sua loja está visível para compradores.'
                : 'Ative para começar a vender.'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleLoja}
          disabled={togglingLoja}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
            lojaAtiva
              ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
              : 'bg-surface-elevated text-foreground hover:bg-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <AnimatePresence mode="wait">
            {lojaAtiva ? (
              <motion.span
                key="on"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="flex items-center gap-1.5"
              >
                <ToggleRight strokeWidth={1.25} className="w-4 h-4" />
                Desativar
              </motion.span>
            ) : (
              <motion.span
                key="off"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="flex items-center gap-1.5"
              >
                <ToggleLeft strokeWidth={1.25} className="w-4 h-4" />
                Ativar
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <Separator />

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Nome completo"
          required
          error={errors.nome?.message}
          {...register('nome')}
        />
        <Input
          label="CPF"
          placeholder="000.000.000-00"
          error={errors.cpf?.message}
          {...register('cpf')}
        />
        <Input
          label="Telefone"
          placeholder="(00) 00000-0000"
          error={errors.telefone?.message}
          {...register('telefone')}
        />
        <Input
          label="URL da foto"
          placeholder="https://…"
          error={errors.foto?.message}
          hint="Cole o link de uma foto de perfil."
          {...register('foto')}
        />

        <Input
          label="E-mail"
          value={perfil.email}
          disabled
          hint="O e-mail não pode ser alterado."
        />

        <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="w-full">
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
