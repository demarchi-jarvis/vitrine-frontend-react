# Arquitetura — Vitrine do Artesanato (Frontend)

Documento de referência para engenheiros trabalhando neste projeto. Descreve decisões de design, fluxos de dados e estrutura do sistema.

---

## Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   React 19 + Next.js 15 App Router                         │
│   ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│   │  Zustand   │  │ TanStack     │  │  Framer Motion   │   │
│   │  (estado)  │  │ Query(cache) │  │  GSAP + Lenis    │   │
│   └────────────┘  └──────────────┘  └──────────────────┘   │
│         │                │                                   │
│   ┌─────▼────────────────▼────────────────────────────────┐ │
│   │            Next.js Server (Node.js)                   │ │
│   │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│   │  │ middleware │  │ Route Handler│  │ Server Comps │  │ │
│   │  │  (JWT/     │  │  /api/auth   │  │  (SSR/SSG)   │  │ │
│   │  │  cookie)   │  │  /api/me     │  │              │  │ │
│   │  └────────────┘  └──────────────┘  └──────────────┘  │ │
│   └───────────────────────────┬───────────────────────────┘ │
└───────────────────────────────│─────────────────────────────┘
                                │ HTTP/REST
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND EXTERNO                         │
│           Spring Boot 4 / Java 24 / PostgreSQL              │
│           localhost:8081/api  (dev)                         │
│                                                             │
│  /autenticacao/*  /usuarios/*  /produtos/*                  │
│  /pedidos/*  /item/*  /endereco/*  /categorias/*            │
└─────────────────────────────────────────────────────────────┘
```

---

## Camadas da Aplicação

### 1. Roteamento e Proteção (`middleware.ts` + `(protected)/layout.tsx`)

**Middleware** executa no Edge antes de qualquer request:
- Lê cookie `authToken`
- Valida com `isTokenExpired()` (decodifica JWT localmente, sem chamada ao backend)
- Rota protegida sem cookie válido → redirect 307 para `/entrar`
- Rota de auth (`/entrar`, `/registrar`) com cookie válido → redirect para `/painel`

**ProtectedLayout** é Server Component que re-verifica o cookie:
- Primeira defesa: middleware (Edge)
- Segunda defesa: server component (Node.js)
- Dupla camada previne flash de conteúdo não autorizado

```
Request → middleware.ts → ProtectedLayout → Page Component → Client Components
              │                  │
         (Edge Runtime)    (Node.js SSR)
```

### 2. Autenticação (`/api/auth`, `/api/me`, `store/auth.store.ts`)

Ver `docs/auth.md` para fluxo completo.

**Resumo das responsabilidades:**
| Peça | Responsabilidade |
|---|---|
| `cookie authToken` | Source of truth para autenticação server-side |
| `useAuthStore` | Estado em memória para componentes React |
| `AuthHydrator` | Sincroniza cookie → store no mount |
| `/api/auth POST` | Recebe `{token}` do cliente, seta cookie httpOnly |
| `/api/auth DELETE` | Deleta o cookie (logout) |
| `/api/me GET` | Lê cookie, retorna `{perfil, token}` para hidratação |

### 3. Camada de API (`src/lib/api/`)

Dois sabores de fetch:
```typescript
// Para Client Components e Route Handlers que já têm o token
clientFetch<T>(path, { token, method, body })

// Para Server Components onde o token é passado explicitamente  
serverFetch<T>(path, token, options)
```

Ambos usam `baseFetch` internamente:
- Seta `Content-Type: application/json`
- Seta `Authorization: Bearer {token}` se token presente
- Lança `ApiError(status, message)` em respostas não-ok
- Trata 204 No Content retornando `undefined`

### 4. Estado Global (`src/store/`)

**`useAuthStore`** — não persistido (intencional):
- `{usuario, token, isLoggedIn}`
- Populado via `setAuth()` no login e via `AuthHydrator` no refresh
- Limpo via `clearAuth()` no logout

**`useCarrinhoStore`** — persistido em `sessionStorage`:
- `{itens[]}` + ações: `adicionar`, `remover`, `atualizar`, `limpar`
- Computed: `totalItens()`, `subtotal()`
- `sessionStorage` = persiste na aba, limpa ao fechar o browser
- Agrupamento por vendedor no checkout (`Map<vendedorId, itens[]>`)

### 5. Rendering Strategy por Página

| Página | Estratégia | Motivo |
|---|---|---|
| `/` (home) | SSG + `revalidate=300` | Dados públicos, SEO |
| `/bazar` | SSG shell + CSR data | Filtros dinâmicos via URL |
| `/detalhes-produto/[id]` | SSR dinâmico | SEO por produto + JSON-LD |
| `/entrar`, `/registrar` | SSG | Estático |
| `/quem-somos` | SSG | Estático |
| `/demandas` | CSR | Formulário interativo |
| `/painel` | CSR + Auth Guard | Dados do usuário |
| `/perfil` | CSR + Auth Guard | Dados mutáveis do usuário |
| `/carrinho` | CSR + Auth Guard | Dados de sessão |
| `/pedidos` | CSR + Auth Guard | Dados do usuário |
| `/gerenciar-vendas` | CSR + Auth Guard | Dados do usuário + charts |
| `/contato` | CSR + Auth Guard | Lista de usuários paginada |

### 6. Componentes — Hierarquia

```
RootLayout (Server)
  └── Providers (Client)
        ├── AuthHydrator           ← hidrata store no mount
        ├── QueryClientProvider    ← TanStack Query
        ├── LenisProvider          ← scroll suave global
        ├── Toaster (Sonner)       ← toasts globais
        ├── Header (Client)        ← nav responsivo + glassmorphism
        ├── main > {children}
        ├── Footer (Client)        ← links + redes sociais
        └── WhatsAppButton (Client) ← botão flutuante
```

**Padrão Page/Content:**
- `page.tsx` = Server Component → metadata, SEO, Suspense boundaries
- `XxxContent.tsx` = Client Component → lógica interativa, estado, hooks

---

## Decisões Arquiteturais

### Por que httpOnly cookie + Zustand em memória (e não só um ou outro)?

**Problema:** Next.js App Router tem Server Components que precisam verificar auth sem JavaScript do cliente. Ao mesmo tempo, Client Components precisam do token para chamadas diretas ao backend.

**Solução híbrida:**
- Cookie httpOnly → verificação server-side (middleware, ProtectedLayout, SSR)
- Zustand em memória → disponibilidade do token em Client Components

**Trade-off aceito:** `/api/me` expõe o token ao JavaScript para re-hidratar o store. Mitigação: token em memória (não localStorage), cookie httpOnly previne XSS direto no cookie.

### Por que TanStack Query + Zustand (e não um só)?

- **Zustand:** estado de domínio (auth, carrinho) — muda por ações do usuário
- **TanStack Query:** cache de dados remotos — muda por tempo ou invalidação
- Não há duplicação: stores não guardam dados de server (produtos, pedidos)

### Por que Framer Motion + GSAP juntos?

- **Framer Motion:** animações declarativas React (layout, variants, transitions) — componentes que precisam de reatividade
- **GSAP:** animações imperativas de alta performance (ScrollTrigger, text reveal no Hero) — efeitos que precisam de controle fino
- Regra: Framer para componentes de UI, GSAP para efeitos de página/scroll

### Por que sessionStorage (e não localStorage) no carrinho?

- Carrinho não deve persistir entre sessões diferentes (segurança, contexto)
- Persiste dentro da aba (refresh funciona)
- Limpa automaticamente ao fechar o browser

---

## Fluxo de Dados — Adicionar ao Carrinho

```
1. Usuário clica "Adicionar" em ProdutoCard
2. handleAddToCart() → useCarrinhoStore.adicionar(produto)
3. Zustand atualiza itens[] → persiste em sessionStorage
4. Header re-renderiza → totalItens() sobe de 0 para 1
5. Toast de confirmação via Sonner

Checkout:
6. CarrinhoPage agrupa itens por item.autorId (vendedorId)
7. Para cada vendedor, chama criarPedido() via clientFetch
8. Promise.all() aguarda todos os pedidos
9. limpar() reseta o carrinho
10. router.push('/pedidos?estado=compras')
```

---

## Fluxo de Dados — Login

```
1. EntrarPage.onSubmit()
   ↓
2. login({email, senha}) → POST /autenticacao/login (backend)
   ← {nome, token}
   ↓
3. fetch('/api/auth', {body: {token}}) → Next.js Route Handler
   → res.cookies.set('authToken', token, { httpOnly: true })
   ↓
4. getUsuarioLogado(token) → GET /usuarios/logado (backend)
   ← Perfil
   ↓
5. setAuth(perfil, token) → Zustand store atualizado
   ↓
6. router.push('/painel') → middleware verifica cookie → OK
```

---

## Fluxo de Dados — Page Refresh (sessão persistida)

```
1. Browser carrega / → middleware lê cookie → OK → renderiza página
2. RootLayout → Providers monta → AuthHydrator.useEffect()
3. fetch('/api/me') → servidor lê cookie httpOnly
4. getUsuarioLogado(token) no servidor → retorna {perfil, token}
5. setAuth(perfil, token) → Zustand hidratado
6. Client Components agora têm token e usuário disponíveis
```

---

## Convenções de Código

### Nomenclatura de Arquivos
- Componentes React: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Stores: `nome.store.ts`
- API modules: `recurso.ts` (singular)
- Pages: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### Imports — Order
1. `react` e hooks do React
2. `next/*` (navigation, image, link, font)
3. Libs externas (framer-motion, gsap, lucide-react, etc.)
4. `@/store/*`, `@/hooks/*`, `@/lib/*`
5. `@/components/*`
6. `@/types`

### Error Handling
- API errors: `ApiError(status, message)` capturado com `catch (e: unknown)`
- Mensagem ao usuário: `toast.error(e instanceof Error ? e.message : 'Erro genérico')`
- Global: `error.tsx` (error boundary) + `not-found.tsx`

---

## Performance

| Técnica | Onde |
|---|---|
| `revalidate = 300` | Home page (dados de produtos) |
| `placeholder="blur"` | Todas as `<Image>` de produtos |
| `priority` | Imagem above-the-fold em detalhes-produto |
| `sizes` adequado | Todas as `<Image>` |
| `optimizePackageImports` | lucide-react, framer-motion, recharts |
| Debounce 400ms | Campo de busca no bazar |
| Debounce 500ms | useCep (ViaCEP) |
| Stagger animations | ProdutoCard com `delay: index * 0.05` |
| `prefers-reduced-motion` | globals.css desativa todas animações |

---

## Segurança

| Vetor | Mitigação |
|---|---|
| XSS rouba token | Token em httpOnly cookie (inacessível via JS) |
| CSRF | cookie `sameSite: lax` |
| Token expirado | middleware + isTokenExpired() antes de servir rota |
| Dados de imagem arbitrários | next.config.ts: `remotePatterns` configurado |
| Credenciais em código | `.env.local` no `.gitignore`, `.env.example` documenta |
| Injeção de HTML | React escapa por padrão; `dangerouslySetInnerHTML` só em JSON-LD |

---

## Dependências Externas

| Serviço | Uso | Obrigatório |
|---|---|---|
| Spring Boot backend | Todas as APIs de dados | Sim |
| ViaCEP (`viacep.com.br`) | Auto-preenchimento de endereço | Não (graceful fail) |
| Google Fonts (CDN) | Inter + Playfair Display | Não (fallback system fonts) |
| WhatsApp (`wa.me`) | Botão flutuante + Demandas | Não |
| Google Tag Manager | Analytics | Não (só se NEXT_PUBLIC_GTM_ID setado) |
| Meta Pixel | Remarketing | Não (só se NEXT_PUBLIC_META_PIXEL_ID setado) |
