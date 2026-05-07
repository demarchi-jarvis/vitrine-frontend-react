import { serverFetch, clientFetch } from './client';
import type { Perfil, UsuarioUpdate, ToggleLojaPayload, Usuario, PaginaResponse } from '@/types';

const BASE = '/usuarios';

export async function getUsuarioLogado(token: string): Promise<Perfil> {
  const raw = await serverFetch<Record<string, unknown>>(`${BASE}/logado`, token);
  return normalizePerfil(raw);
}

export async function getDonoLoja(email: string, token: string): Promise<Usuario> {
  return serverFetch(`${BASE}/dono?email=${encodeURIComponent(email)}`, token);
}

export async function getPerfis(
  token: string,
  page = 0,
  size = 8,
  nome?: string,
): Promise<PaginaResponse<Usuario>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (nome) params.set('nome', nome);
  return clientFetch(`${BASE}/perfis?${params}`, { token });
}

export async function atualizarPerfil(payload: UsuarioUpdate, token: string): Promise<Perfil> {
  return clientFetch(`${BASE}/alterar`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    token,
  });
}

export async function toggleLoja(payload: ToggleLojaPayload, token: string): Promise<Perfil> {
  return clientFetch(`${BASE}/loja/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    token,
  });
}

function normalizePerfil(raw: Record<string, unknown>): Perfil {
  const nome = String(raw.nome ?? '');
  const parts = nome.split(' ');
  const primeiroNome = parts[0] ?? '';
  const sobrenome = parts.slice(1).join(' ');
  return {
    ...(raw as unknown as Perfil),
    nome: primeiroNome,
    sobrenome,
    foto:
      (raw.foto as string) ||
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  };
}
