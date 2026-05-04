# Arquitetura — vitrine-artesao (Next.js 16 / React 19)

Migração completa do Angular 17 (`vitrine-frontend-angular`) para Next.js App Router.

---

## Estrutura de pastas

```
vitrine-artesao/
├── src/
│   ├── app/                            ← App Router (file-based routing)
│   │   ├── layout.tsx                  ← RootLayout: Providers + Header + Footer
│   │   ├── page.tsx                    ← / (landing page — SSG)
│   │   ├── not-found.tsx               ← 404 global
│   │   ├── error.tsx                   ← Error boundary global
│   │   ├── loading.tsx                 ← Loading global (Skeleton)
│   │   ├── globals.css                 ← Tailwind v4 @theme + reset
│   │   │
│   │   ├── (public)/                   ← Route group: sem auth, SSR/SSG
│   │   │   ├── bazar/
│   │   │   │   ├── page.tsx            ← GET /produtos/filtro?page&categoriaId — SSR + ISR 60s
│   │   │   │   └── loading.tsx         ← Skeleton grid 12 cards
│   │   │   ├── detalhes-produto/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx        ← GET /produtos/{id} — SSR + generateMetadata
│   │   │   │       └── loading.tsx
│   │   │   ├── loja/
│   │   │   │   └── page.tsx            ← ?loja=email → /usuarios/dono + /produtos/loja — SSR
│   │   │   ├── perfil-usuario/
│   │   │   │   └── page.tsx            ← ?email= → /usuarios/dono — SSR
│   │   │   ├── quem-somos/
│   │   │   │   └── page.tsx            ← Estático (SSG)
│   │   │   └── demandas/
│   │   │       └── page.tsx            ← SSR (lista dinâmica)
│   │   │
│   │   ├── (auth)/                     ← Route group: apenas NÃO autenticados
│   │   │   ├── entrar/
│   │   │   │   └── page.tsx            ← CSR — formulário de login
│   │   │   └── registrar/
│   │   │       └── page.tsx            ← CSR — formulário de registro
│   │   │
│   │   └── (protected)/                ← Route group: JWT obrigatório
│   │       ├── layout.tsx              ← Verifica token server-side, redireciona /entrar
│   │       ├── painel/
│   │       │   └── page.tsx            ← Dashboard com tabs (CSR)
│   │       ├── perfil/
│   │       │   └── page.tsx            ← Perfil + endereço + toggle loja (SSR)
│   │       ├── pedidos/
│   │       │   └── page.tsx            ← Compras/Vendas toggle + paginação (SSR)
│   │       ├── carrinho/
│   │       │   └── page.tsx            ← Checkout (CSR — Zustand sessionStorage)
│   │       ├── gerenciar-vendas/
│   │       │   └── page.tsx            ← Gráfico de vendas por mês (CSR — Recharts)
│   │       ├── cadastrar-produto/
│   │       │   └── page.tsx            ← Formulário criação produto + categoria (CSR)
│   │       ├── editar-produto/
│   │       │   └── [id]/
│   │       │       └── page.tsx        ← SSR (pré-popula com dados do produto)
│   │       └── contato/
│   │           └── page.tsx            ← CSR
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              ← Server Component (nav links, logo)
│   │   │   ├── HeaderClient.tsx        ← 'use client' (menu mobile, cart badge, avatar)
│   │   │   ├── Footer.tsx              ← Server Component
│   │   │   └── Providers.tsx           ← 'use client' QueryClientProvider + Zustand sync
│   │   │
│   │   ├── ui/                         ← shadcn/ui (gerado via CLI)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx               ← Drawer mobile
│   │   │   ├── skeleton.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── switch.tsx              ← Toggle loja
│   │   │   └── carousel.tsx
│   │   │
│   │   ├── produto/
│   │   │   ├── ProdutoCard.tsx         ← Card (imagem, nome, preço, badge categoria, add carrinho)
│   │   │   ├── ProdutoGrid.tsx         ← Grid responsivo com Skeleton automático
│   │   │   ├── ProdutoCarousel.tsx     ← Carrossel horizontal (loja do artesão)
│   │   │   └── ProdutoActions.tsx      ← Editar/Deletar — só para ehAutor === true
│   │   │
│   │   ├── pedido/
│   │   │   ├── PedidoCard.tsx          ← Card com expand/collapse (Framer Motion)
│   │   │   ├── PedidoDetalhe.tsx       ← Conteúdo expandido (produto, vendedor, endereço)
│   │   │   └── PedidoToggle.tsx        ← Switch Compras ↔ Vendas (atualiza URL params)
│   │   │
│   │   ├── carrinho/
│   │   │   ├── CarrinhoDropdown.tsx    ← Dropdown no header (Zustand)
│   │   │   ├── CarrinhoItem.tsx        ← Item individual com quantidade +/-
│   │   │   └── CarrinhoResumo.tsx      ← Subtotal + frete R$9,99 + botão finalizar
│   │   │
│   │   ├── usuario/
│   │   │   ├── PerfilForm.tsx          ← RHF + Zod (nome, cpf, telefone, foto)
│   │   │   ├── EnderecoForm.tsx        ← RHF + Zod + CEP autocomplete (ViaCEP)
│   │   │   └── LojaToggle.tsx          ← Switch PATCH /api/usuarios/loja/status
│   │   │
│   │   └── shared/
│   │       ├── HeroCarousel.tsx        ← Carrossel landing (autoplay 5s)
│   │       ├── Pagination.tsx          ← Paginação genérica (gera URL params)
│   │       ├── SearchBar.tsx           ← Input busca com debounce 300ms
│   │       ├── CategoryFilter.tsx      ← Pills categoria (GET /categorias)
│   │       ├── EmptyState.tsx          ← Tela vazia com ícone Lucide + CTA
│   │       └── PageWrapper.tsx         ← Container max-width + padding padrão
│   │
│   ├── lib/
│   │   ├── api/                        ← Fetch sem React — usável em Server e Client
│   │   │   ├── client.ts               ← fetch wrapper: Bearer token, error handling
│   │   │   ├── auth.ts                 ← login(), registrar()
│   │   │   ├── produtos.ts             ← listar(), filtrar(), buscarPorId(), meus(), loja(), criar(), atualizar(), deletar()
│   │   │   ├── usuarios.ts             ← logado(), dono(), alterar(), toggleLoja()
│   │   │   ├── pedidos.ts              ← compras(), vendas(), criar()
│   │   │   ├── enderecos.ts            ← buscarDoUsuario(), buscarPorEmail(), salvar(), atualizar()
│   │   │   ├── categorias.ts           ← listar(), criar()
│   │   │   └── viacep.ts               ← buscarCep(cep: string)
│   │   ├── auth.ts                     ← getToken(), setToken(), removeToken(), isExpired()
│   │   ├── schemas.ts                  ← Todos os schemas Zod (login, registro, produto, endereço…)
│   │   └── utils.ts                    ← cn(), formatPreco(), formatData(), formatEndereco()
│   │
│   ├── hooks/                          ← Custom hooks (somente Client Components)
│   │   ├── useAuth.ts                  ← token cookie, usuario, login, logout
│   │   ├── useProdutos.ts              ← useQuery (listar + filtrar paginado)
│   │   ├── useMeusProdutos.ts          ← useQuery /produtos/meus-produtos
│   │   ├── usePedidos.ts               ← useQuery compras + vendas paginadas
│   │   ├── useCarrinho.ts              ← selector Zustand carrinhoStore
│   │   ├── useUsuario.ts               ← useQuery /usuarios/logado
│   │   └── useCep.ts                   ← debounced lookup ViaCEP (500ms)
│   │
│   ├── stores/
│   │   ├── carrinhoStore.ts            ← Zustand persist sessionStorage (não mais mixed localStorage/sessionStorage)
│   │   └── authStore.ts                ← token + usuario (sincronizado com cookie)
│   │
│   ├── types/
│   │   └── index.ts                    ← Todas as interfaces TypeScript (ver TYPES.md)
│   │
│   └── middleware.ts                   ← Edge Runtime: guard routes + redirect
│
├── public/
│   ├── images/
│   │   ├── logo.png                    ← logoIndependencia.png migrado
│   │   ├── hero/                       ← independencia.jpg, bairro.jpg, publico.png
│   │   └── icones/                     ← ícones de categoria migrados
│   └── favicon.ico
│
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Rendering Strategy (por rota)

| Rota Angular | Rota Next.js | Estratégia | Motivo |
|---|---|---|---|
| `''` / `'inicio'` | `/` | **SSG** | Landing estática |
| `'bazar'` | `/bazar` | **SSR + ISR 60s** | Produtos mudam, não em tempo real |
| `'detalhes-produto/:id'` | `/detalhes-produto/[id]` | **SSR + generateMetadata** | SEO por produto |
| `'loja'` | `/loja` | **SSR** | Depende de `?loja=email` |
| `'perfil-usuario'` | `/perfil-usuario` | **SSR** | Depende de `?email=` |
| `'quem-somos'` | `/quem-somos` | **SSG** | Conteúdo institucional |
| `'demandas'` | `/demandas` | **SSR** | Lista dinâmica |
| `'entrar'` | `/entrar` | **CSR** | Formulário puro |
| `'registrar'` | `/registrar` | **CSR** | Formulário puro |
| `'painel'` | `/painel` | **CSR** (protected) | Dashboard interativo com tabs |
| `'perfil'` | `/perfil` | **SSR** (protected) | Pré-carrega dados do usuário |
| `'pedidos'` | `/pedidos` | **SSR** (protected) | Lista de pedidos |
| `'carrinho'` | `/carrinho` | **CSR** (protected) | Estado Zustand sessionStorage |
| `'gerenciar-vendas'` | `/gerenciar-vendas` | **CSR** (protected) | Recharts client-only |
| `'cadastrar-produto'` | `/cadastrar-produto` | **CSR** (protected) | Formulário interativo |
| `'editar-produto/:id'` | `/editar-produto/[id]` | **SSR** (protected) | Pré-popula com dados |
| `'contato'` | `/contato` | **CSR** (protected) | Formulário |

---

## Root Layout

```tsx
// src/app/layout.tsx
import { Inter, Sora } from 'next/font/google'
import { Providers } from '@/components/layout/Providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const sora = Sora({ subsets: ['latin'], variable: '--font-display' })

export const metadata = {
  title: { default: 'Vitrine Artesão', template: '%s | Vitrine Artesão' },
  description: 'Marketplace de artesãos do Vale do Café',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
```

---

## Protected Layout (guard server-side)

```tsx
// src/app/(protected)/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isTokenExpired } from '@/lib/auth'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token || isTokenExpired(token)) redirect('/entrar')
  return <>{children}</>
}
```

---

## Middleware (Edge Runtime)

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { isTokenExpired } from '@/lib/auth'

const PROTECTED = ['/painel', '/perfil', '/pedidos', '/carrinho', '/gerenciar-vendas', '/cadastrar-produto', '/editar-produto', '/contato']
const AUTH_ONLY = ['/entrar', '/registrar']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const autenticado = token && !isTokenExpired(token)

  if (PROTECTED.some(r => pathname.startsWith(r)) && !autenticado)
    return NextResponse.redirect(new URL('/entrar', request.url))

  if (AUTH_ONLY.some(r => pathname.startsWith(r)) && autenticado)
    return NextResponse.redirect(new URL('/bazar', request.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

---

## Providers

```tsx
// src/components/layout/Providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
  }))
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

---

## API Client

```typescript
// src/lib/api/client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081/api'

type Opts = RequestInit & { token?: string }

async function request<T>(path: string, opts: Opts = {}): Promise<T> {
  const { token, ...init } = opts
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const http = {
  get:    <T>(path: string, opts?: Opts) => request<T>(path, { method: 'GET', ...opts }),
  post:   <T>(path: string, body: unknown, opts?: Opts) => request<T>(path, { method: 'POST',   body: JSON.stringify(body), ...opts }),
  patch:  <T>(path: string, body: unknown, opts?: Opts) => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body), ...opts }),
  put:    <T>(path: string, body: unknown, opts?: Opts) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body), ...opts }),
  delete: <T>(path: string, opts?: Opts)               => request<T>(path, { method: 'DELETE', ...opts }),
}
```

---

## next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
}

export default nextConfig
```
