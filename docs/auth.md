# Autenticação — Vitrine do Artesanato

Documento completo do sistema de autenticação: fluxos, decisões, arquivos e como modificar.

---

## Estratégia

**Híbrida: httpOnly cookie (servidor) + Zustand em memória (cliente)**

```
┌──────────────────────────────────────────────────────────┐
│  Cookie httpOnly "authToken"                             │
│  → Middleware (Edge)                                     │
│  → ProtectedLayout (SSR)                                 │
│  → /api/me (hidratação)                                  │
│  Inacessível via JavaScript → protege contra XSS         │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  Zustand useAuthStore { usuario, token, isLoggedIn }     │
│  → Header (exibe nome/foto)                              │
│  → Client Components que chamam o backend com token      │
│  Em memória apenas → limpo no refresh (hidratado via /api/me) │
└──────────────────────────────────────────────────────────┘
```

---

## Fluxo de Login

```
src/app/entrar/page.tsx

1. Usuário preenche {email, senha} e submete
2. login({email, senha})
   → POST {API_URL}/autenticacao/login
   ← {nome: string, token: string}

3. fetch('/api/auth', { method: 'POST', body: {token, nome} })
   → src/app/api/auth/route.ts (POST)
   → res.cookies.set('authToken', token, {
       httpOnly: true,
       secure: true (produção),
       sameSite: 'lax',
       maxAge: 7200  // 2h
     })
   ← {ok: true}

4. getUsuarioLogado(token)
   → GET {API_URL}/usuarios/logado (com Bearer token)
   ← Perfil { id, nome, sobrenome, email, cpf, ... }

5. useAuthStore.setAuth(perfil, token)
   → store em memória populado

6. toast.success('Bem-vindo, {nome}!')
7. router.push('/painel') + router.refresh()
   → middleware verifica cookie → OK
```

---

## Fluxo de Registro

Idêntico ao login, com diferenças:
- Chama `registrar({nome, email, telefone, senha})` em vez de `login()`
- Envia para `/api/auth` com `?action=registrar` (ignorado, mas mantém semântica)
- Arquivo: `src/app/registrar/page.tsx`

---

## Fluxo de Logout

```
src/hooks/useAuth.ts → logout()

1. fetch('/api/auth', { method: 'DELETE' })
   → src/app/api/auth/route.ts (DELETE)
   → res.cookies.delete('authToken')

2. useAuthStore.clearAuth()
   → {usuario: null, token: null, isLoggedIn: false}

3. router.push('/')
4. router.refresh()
   → middleware não vê mais o cookie
```

---

## Fluxo de Hidratação (Page Refresh)

```
src/providers.tsx → AuthHydrator

1. Componente monta (após qualquer page refresh/navegação direta)
2. if (isLoggedIn) return  ← skip se já hidratado
3. fetch('/api/me')
   → src/app/api/me/route.ts
   → cookies().get('authToken')
   → isTokenExpired(token) ? 401 : continua
   → getUsuarioLogado(token)  ← chama backend com token do cookie
   ← {perfil: Perfil, token: string} ou null (401)

4. if (data) setAuth(data.perfil, data.token)
   → store hidratado

5. Client Components agora funcionam normalmente
```

---

## Proteção de Rotas

### Middleware (`middleware.ts`)

```typescript
const PROTECTED = [
  '/painel', '/perfil', '/carrinho', '/pedidos',
  '/cadastrar-produto', '/editar-produto',
  '/gerenciar-vendas', '/contato',
];

const AUTH_ONLY = ['/entrar', '/registrar'];
```

- Executa no **Edge Runtime** (antes do Node.js)
- Rotas em `PROTECTED`: sem cookie → redirect `/entrar`; cookie expirado → deleta cookie + redirect
- Rotas em `AUTH_ONLY`: cookie válido → redirect `/painel` (evita login duplo)
- Matcher: exclui `api/`, `_next/static`, `_next/image`, `favicon.ico`

### ProtectedLayout (`src/app/(protected)/layout.tsx`)

- Server Component executado no Node.js
- Segunda verificação do cookie (defesa em profundidade)
- Se falhar: `redirect(ROUTES.entrar)` server-side (sem flash)

---

## Arquivos Envolvidos

| Arquivo | Papel |
|---|---|
| `middleware.ts` | Guard de rotas — Edge Runtime |
| `src/app/(protected)/layout.tsx` | Guard server-side das rotas protegidas |
| `src/app/api/auth/route.ts` | Seta/deleta cookie httpOnly |
| `src/app/api/me/route.ts` | Hidrata store a partir do cookie |
| `src/lib/auth/token.ts` | `parseToken()`, `isTokenExpired()`, `getTokenFromCookie()` |
| `src/store/auth.store.ts` | `useAuthStore` — estado em memória |
| `src/hooks/useAuth.ts` | `logout()` helper para componentes |
| `src/providers.tsx` | `AuthHydrator` — re-hidrata store no mount |
| `src/app/entrar/page.tsx` | Formulário de login |
| `src/app/registrar/page.tsx` | Formulário de registro |

---

## Configuração do Cookie

```typescript
// src/app/api/auth/route.ts
const COOKIE_OPTIONS = {
  httpOnly: true,                              // inacessível via document.cookie
  secure: process.env.NODE_ENV === 'production', // HTTPS apenas em prod
  sameSite: 'lax',                             // proteção CSRF parcial
  maxAge: 60 * 60 * 2,                         // 2 horas (igual ao JWT)
  path: '/',                                   // disponível em todas as rotas
};
```

**maxAge deve ser igual ao `exp` do JWT** — se um expirar, o outro também.

---

## JWT

- Algoritmo esperado: HS256 (Spring Boot default)
- Payload esperado: `{ sub: string, exp: number, iat: number }`
- Decodificação client-side: `jwt-decode` (sem verificação de assinatura — confiar no backend)
- Verificação de expiração: `payload.exp < Date.now() / 1000`

---

## Como Adicionar uma Nova Rota Protegida

1. Crie a pasta dentro de `src/app/(protected)/`
2. O `layout.tsx` já protege automaticamente
3. Se precisar no middleware também, adicione o path em `PROTECTED[]` no `middleware.ts`
4. No Client Component, use `useAuthStore()` para obter `token` e `usuario`

---

## Como Usar o Token em um Client Component

```typescript
'use client';
import { useAuthStore } from '@/store/auth.store';
import { clientFetch } from '@/lib/api/client';

export function MeuComponente() {
  const { token } = useAuthStore();

  async function fetchDados() {
    if (!token) return;
    const dados = await clientFetch('/minha-rota', { token });
  }
}
```

---

## Troubleshooting

| Problema | Causa provável | Fix |
|---|---|---|
| Usuário logado mas vê tela de login | Cookie não foi setado | Verificar `POST /api/auth` retorna 200 e seta cookie |
| Store vazio após refresh | AuthHydrator não rodou | Verificar `/api/me` retorna `{perfil, token}` |
| Loop de redirect em `/entrar` | Cookie expirado mas não sendo deletado | Middleware deleta cookie expirado e redireciona |
| 401 em rotas protegidas | Token expirou | Re-login necessário; considerar refresh token |
