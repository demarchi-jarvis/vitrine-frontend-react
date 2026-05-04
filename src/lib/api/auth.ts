import { clientFetch } from './client';
import type { AuthResponse, LoginPayload, RegistrarPayload } from '@/types';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return clientFetch('/autenticacao/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registrar(payload: RegistrarPayload): Promise<AuthResponse> {
  return clientFetch('/autenticacao/registrar', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
