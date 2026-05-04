'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCep } from '@/hooks/useCep';
import { cadastrarEndereco, atualizarEndereco, getEnderecoUsuario } from '@/lib/api/endereco';
import { useAuthStore } from '@/store/auth.store';
import type { EnderecoResponse } from '@/types';

const schema = z.object({
  cep: z.string().min(8, 'CEP obrigatório'),
  rua: z.string().min(2, 'Rua obrigatória'),
  numero: z.number({ invalid_type_error: 'Número inválido' }).int().positive('Número inválido'),
  bairro: z.string().min(2, 'Bairro obrigatório'),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  estado: z.string().min(2, 'Estado obrigatório'),
  complemento: z.string().optional(),
  adicional: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function EnderecoForm() {
  const { token } = useAuthStore();
  const [enderecoExistente, setEnderecoExistente] = useState<EnderecoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { numero: undefined },
  });

  const cepValue = watch('cep') ?? '';
  const { data: cepData, loading: cepLoading } = useCep(cepValue);

  // Auto-fill from ViaCEP
  useEffect(() => {
    if (!cepData) return;
    setValue('rua', cepData.logradouro);
    setValue('bairro', cepData.bairro);
    setValue('cidade', cepData.localidade);
    setValue('estado', cepData.uf);
    if (cepData.complemento) setValue('complemento', cepData.complemento);
  }, [cepData, setValue]);

  // Load existing address
  useEffect(() => {
    if (!token) return;
    getEnderecoUsuario(token)
      .then((e) => {
        setEnderecoExistente(e);
        reset({
          cep: e.cep,
          rua: e.rua,
          numero: e.numero ?? undefined,
          bairro: e.bairro,
          cidade: e.cidade,
          estado: e.estado,
          complemento: e.complemento ?? '',
          adicional: e.adicional ?? '',
        });
      })
      .catch(() => { /* no address yet */ })
      .finally(() => setLoading(false));
  }, [token, reset]);

  async function onSubmit(data: FormData) {
    if (!token) return;
    const payload = {
      cep: data.cep.replace(/\D/g, ''),
      rua: data.rua,
      numero: data.numero,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      complemento: data.complemento ?? '',
      adicional: data.adicional ?? '',
    };
    try {
      if (enderecoExistente) {
        const updated = await atualizarEndereco({ ...payload, id: enderecoExistente.id }, token);
        setEnderecoExistente(updated);
        toast.success('Endereço atualizado!');
      } else {
        const created = await cadastrarEndereco(payload, token);
        setEnderecoExistente(created);
        toast.success('Endereço cadastrado!');
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao salvar endereço');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-terracotta-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="relative">
        <Input
          label="CEP"
          placeholder="00000-000"
          error={errors.cep?.message}
          {...register('cep')}
        />
        {cepLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-terracotta-600 absolute right-4 bottom-3.5" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Input label="Rua / Logradouro" error={errors.rua?.message} {...register('rua')} />
        </div>
        <Input
          label="Número"
          type="number"
          error={errors.numero?.message}
          {...register('numero', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Bairro" error={errors.bairro?.message} {...register('bairro')} />
        <Input label="Complemento" placeholder="Apto, bloco…" {...register('complemento')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Cidade" error={errors.cidade?.message} {...register('cidade')} />
        <Input label="Estado (UF)" maxLength={2} error={errors.estado?.message} {...register('estado')} />
      </div>

      <Input label="Informações adicionais" placeholder="Referência, observações…" {...register('adicional')} />

      <Button type="submit" loading={isSubmitting} className="w-full">
        {enderecoExistente ? 'Atualizar endereço' : 'Cadastrar endereço'}
      </Button>
    </form>
  );
}
