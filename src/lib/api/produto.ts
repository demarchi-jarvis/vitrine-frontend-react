import { clientFetch, serverFetch } from './client';
import type { Produto, ProdutoPayload, PaginaResponse, ProdutoFilters } from '@/types';

const BASE = '/produtos';

// Público — usa /filtro que é permitAll no Spring Security
// GET /produtos requer auth, /filtro não — sempre usar /filtro para listagem pública
export async function getProdutos(filters: ProdutoFilters = {}): Promise<PaginaResponse<Produto>> {
  const params = new URLSearchParams();
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.size !== undefined) params.set('size', String(filters.size));
  if (filters.categoriaId) params.set('categoriaId', filters.categoriaId);
  const qs = params.toString();
  return clientFetch(`${BASE}/filtro${qs ? `?${qs}` : ''}`);
}

export async function getProdutoById(id: string, token: string): Promise<Produto> {
  return serverFetch(`${BASE}/${id}`, token);
}

// Privado — token obrigatório
export async function getMeusProdutos(token: string): Promise<Produto[]> {
  return serverFetch(`${BASE}/meus-produtos`, token);
}

export async function getProdutosLoja(email: string, token: string): Promise<Produto[]> {
  return serverFetch(`${BASE}/loja?email=${encodeURIComponent(email)}`, token);
}

export async function criarProduto(payload: ProdutoPayload, token: string): Promise<Produto> {
  return clientFetch(`${BASE}`, { method: 'POST', body: JSON.stringify(payload), token });
}

export async function editarProduto(
  id: string,
  payload: Partial<ProdutoPayload>,
  token: string,
): Promise<Produto> {
  return clientFetch(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload), token });
}

export async function deletarProduto(id: string, token: string): Promise<void> {
  return clientFetch(`${BASE}/${id}`, { method: 'DELETE', token });
}
