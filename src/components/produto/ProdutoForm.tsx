'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getCategorias } from '@/lib/api/categoria';
import { criarProduto, editarProduto, getProdutoById } from '@/lib/api/produto';
import type { Categoria } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

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
  produtoId?: string; // undefined = criar, string = editar
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantidade: 1 },
  });

  const quantidade = watch('quantidade');

  // Load categorias
  useEffect(() => {
    if (!token) return;
    getCategorias(token)
      .then(setCategorias)
      .catch(() => toast.error('Erro ao carregar categorias'))
      .finally(() => setLoadingCats(false));
  }, [token]);

  // Load produto for editing
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
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      toast.error(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <Input label="Nome do produto" error={errors.nome?.message} {...register('nome')} />

      <div>
        <label className="text-sm font-medium text-wood-800 block mb-1.5">Categoria</label>
        <select
          className="w-full px-4 py-3 rounded-xl text-sm bg-sand-100 border border-sand-200 focus:outline-none focus:border-terracotta-600"
          disabled={loadingCats}
          {...register('categoriaId')}
        >
          <option value="">Selecione…</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        {errors.categoriaId && (
          <p className="text-red-600 text-xs mt-1">{errors.categoriaId.message}</p>
        )}
      </div>

      {/* Quantidade com +/- */}
      <div>
        <label className="text-sm font-medium text-wood-800 block mb-1.5">Quantidade</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue('quantidade', Math.max(1, quantidade - 1))}
            className="p-2 rounded-xl bg-sand-200 hover:bg-sand-300 transition-colors"
          >
            <Minus strokeWidth={1.25} className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-wood-900">{quantidade}</span>
          <button
            type="button"
            onClick={() => setValue('quantidade', Math.min(99, quantidade + 1))}
            className="p-2 rounded-xl bg-sand-200 hover:bg-sand-300 transition-colors"
          >
            <Plus strokeWidth={1.25} className="w-4 h-4" />
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

      <div>
        <label className="text-sm font-medium text-wood-800 block mb-1.5">Descrição</label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm bg-sand-100 border border-sand-200 focus:outline-none focus:border-terracotta-600 resize-none"
          {...register('descricao')}
        />
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        {isEdit ? 'Salvar alterações' : 'Cadastrar produto'}
      </Button>
    </form>
  );
}
