import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsuarioLogado } from '@/lib/api/usuario';
import { isTokenExpired } from '@/lib/auth/token';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token || isTokenExpired(token)) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const perfil = await getUsuarioLogado(token);
    return NextResponse.json({ perfil, token });
  } catch {
    return NextResponse.json(null, { status: 401 });
  }
}
