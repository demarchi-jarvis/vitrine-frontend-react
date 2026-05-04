import { clientFetch } from './client';
import type { PedidoRequest, PedidoResponse, PaginaResponse, ItemPedido } from '@/types';

const BASE = '/pedidos';
const ITEM = '/item';

export async function criarPedido(payload: PedidoRequest, token: string): Promise<PedidoResponse> {
  return clientFetch(BASE, { method: 'POST', body: JSON.stringify(payload), token });
}

export async function getCompras(
  page: number,
  size: number,
  token: string,
): Promise<PaginaResponse<ItemPedido>> {
  return clientFetch(`${ITEM}/comprador?page=${page}&size=${size}`, { token });
}

export async function getVendas(
  page: number,
  size: number,
  token: string,
): Promise<PaginaResponse<ItemPedido>> {
  return clientFetch(`${ITEM}/vendedor?page=${page}&size=${size}`, { token });
}
