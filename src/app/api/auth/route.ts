import { NextRequest, NextResponse } from 'next/server';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 2, // 2h — igual ao JWT
  path: '/',
};

export async function POST(request: NextRequest) {
  const body = await request.json() as { token?: string; nome?: string };
  if (!body?.token) {
    return NextResponse.json({ error: 'Token ausente' }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('authToken', body.token, COOKIE_OPTIONS);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('authToken');
  return res;
}
