import { NextRequest, NextResponse } from 'next/server';
import { login as apiLogin, registrar as apiRegistrar } from '@/lib/api/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 2, // 2h — igual ao JWT
  path: '/',
};

// BUG-01 fix: token vai para cookie httpOnly, nunca localStorage
export async function POST(request: NextRequest) {
  const body = await request.json();
  const action = request.nextUrl.searchParams.get('action') ?? 'login';

  try {
    const data = action === 'registrar' ? await apiRegistrar(body) : await apiLogin(body);

    const res = NextResponse.json({ nome: data.nome });
    res.cookies.set('authToken', data.token, COOKIE_OPTIONS);
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro de autenticação';
    const status = (err as { status?: number }).status ?? 401;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('authToken');
  return res;
}
