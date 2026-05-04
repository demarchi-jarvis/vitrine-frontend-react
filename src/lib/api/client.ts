import { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081/api';

async function baseFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...rest } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers ?? {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Para chamadas de Server Components e Route Handlers (token explícito) */
export function serverFetch<T>(path: string, token: string, options?: RequestInit) {
  return baseFetch<T>(path, { ...options, token });
}

/** Para chamadas de Client Components via token no cookie (lido no browser) */
export function clientFetch<T>(path: string, options?: RequestInit & { token?: string }) {
  return baseFetch<T>(path, options ?? {});
}

export { API_URL };
