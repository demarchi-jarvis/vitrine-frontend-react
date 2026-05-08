'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { getCategorias } from '@/lib/api/categoria';
import { criarProduto, editarProduto, getProdutoById } from '@/lib/api/produto';
import type { Categoria } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  categoriaId: z.string().min(1, 'Categoria obrigatória'),
  quantidade: z.number().int().min(1).max(99),
  preco: z.number().min(0.01, 'Preço deve ser maior que zero'),
  imagem: z.string().url('URL de imagem inválida'),
  descricao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ProdutoFormProps {
  produtoId?: string;
}

export function ProdutoForm({ produtoId }: ProdutoFormProps) {
  const isEdit = Boolean(produtoId);
  const { token } = useAuthStore();
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantidade: 1 },
  });

  const quantidade = watch('quantidade');

  useEffect(() => {
    if (!token) return;
    getCategorias(token)
      .then(setCategorias)
      .catch(() => toast.error('Erro ao carregar categorias'))
      .finally(() => setLoadingCats(false));
  }, [token]);

  useEffect(() => {
    if (!produtoId || !token) return;
    getProdutoById(produtoId, token).then((p) => {
      setValue('nome', p.nome);
      setValue('categoriaId', p.categoria.id);
      setValue('quantidade', p.quantidade);
      setValue('preco', p.preco);
      setValue('imagem', p.imagem);
      setValue('descricao', p.descricao ?? '');
    });
  }, [produtoId, token, setValue]);

  async function onSubmit(data: FormData) {
    if (!token) { toast.error('Não autenticado'); return; }
    try {
      if (isEdit && produtoId) {
        await editarProduto(produtoId, data, token);
        toast.success('Produto atualizado!');
      } else {
        await criarProduto(data, token);
        toast.success('Produto cadastrado!');
      }
      router.push(ROUTES.perfil);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro desconhecido');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <Input label="Nome do produto" error={errors.nome?.message} {...register('nome')} />

      {/* Category — Radix Select */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="categoria-select">Categoria</Label>
        <Controller
          control={control}
          name="categoriaId"
          render={({ field }) => (
            <SelectRoot
              value={field.value}
              onValueChange={field.onChange}
              disabled={loadingCats}
            >
              <SelectTrigger id="categoria-select">
                <SelectValue placeholder={loadingCats ? 'Carregando…' : 'Selecione uma categoria'} />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          )}
        />
        {errors.categoriaId && (
          <p className="text-red-500 dark:text-red-400 text-xs">{errors.categoriaId.message}</p>
        )}
      </div>

      {/* Quantidade */}
      <div className="flex flex-col gap-1.5">
        <Label>Quantidade</Label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue('quantidade', Math.max(1, quantidade - 1))}
            className={cn(
              'p-2.5 rounded-xl bg-surface border border-border',
              'hover:bg-surface-elevated transition-colors',
            )}
          >
            <Minus strokeWidth={1.25} className="w-4 h-4 text-foreground" />
          </button>
          <span className="w-12 text-center font-semibold text-foreground tabular-nums">{quantidade}</span>
          <button
            type="button"
            onClick={() => setValue('quantidade', Math.min(99, quantidade + 1))}
            className={cn(
              'p-2.5 rounded-xl bg-surface border border-border',
              'hover:bg-surface-elevated transition-colors',
            )}
          >
            <Plus strokeWidth={1.25} className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      <Input
        label="Preço (R$)"
        type="number"
        step="0.01"
        error={errors.preco?.message}
        {...register('preco', { valueAsNumber: true })}
      />

      <Input
        label="URL da imagem"
        placeholder="https://…"
        error={errors.imagem?.message}
        {...register('imagem')}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="descricao">Descrição</Label>
        <textarea
          id="descricao"
          rows={3}
          className="field-base resize-none"
          {...register('descricao')}
        />
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        {isEdit ? 'Salvar alterações' : 'Cadastrar produto'}
      </Button>
    </form>
  );
}
