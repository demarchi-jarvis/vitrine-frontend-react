import { clientFetch, serverFetch } from './client';
import type { Produto, ProdutoPayload, PaginaResponse, ProdutoFilters } from '@/types';

const BASE = '/produtos';

// Público — sem token (SSR/SSG para bazar e detalhes)
export async function getProdutos(filters: ProdutoFilters = {}): Promise<PaginaResponse<Produto>> {
  const params = new URLSearchParams();
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.size !== undefined) params.set('size', String(filters.size));
  if (filters.nome) params.set('nome', filters.nome);
  const qs = params.toString();

  // Se há categoriaId, usa o endpoint de filtro (igual ao Angular: /produtos/filtro)
  if (filters.categoriaId) {
    const fp = new URLSearchParams(qs);
    fp.set('categoriaId', filters.categoriaId);
    return clientFetch(`${BASE}/filtro?${fp}`);
  }

  return clientFetch(`${BASE}${qs ? `?${qs}` : ''}`);
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
