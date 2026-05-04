import { clientFetch } from './client';
import type { Categoria } from '@/types';

const BASE = '/categorias';

export async function getCategorias(token: string): Promise<Categoria[]> {
  const all = await clientFetch<Categoria[]>(BASE, { token });
  return all.filter((c) => c.nome !== 'Todos');
}

export async function criarCategoria(
  payload: { nome: string; icone: string },
  token: string,
): Promise<Categoria> {
  return clientFetch(BASE, { method: 'POST', body: JSON.stringify(payload), token });
}
