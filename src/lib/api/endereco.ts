import { clientFetch } from './client';
import type { EnderecoPayload, EnderecoResponse, ViaCepResponse } from '@/types';

const BASE = '/endereco';

export async function getEnderecoUsuario(token: string): Promise<EnderecoResponse> {
  return clientFetch(`${BASE}/usuario`, { token });
}

export async function cadastrarEndereco(
  payload: EnderecoPayload,
  token: string,
): Promise<EnderecoResponse> {
  return clientFetch(BASE, { method: 'POST', body: JSON.stringify(payload), token });
}

export async function atualizarEndereco(
  payload: EnderecoResponse,
  token: string,
): Promise<EnderecoResponse> {
  return clientFetch(BASE, { method: 'PUT', body: JSON.stringify(payload), token });
}

export async function buscarCep(cep: string): Promise<ViaCepResponse> {
  const clean = cep.replace(/\D/g, '');
  const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
  if (!res.ok) throw new Error('CEP não encontrado.');
  const data: ViaCepResponse = await res.json();
  if (data.erro) throw new Error('CEP inválido.');
  return data;
}
