# Páginas e Roteamento — Vitrine do Artesanato

Mapa completo de todas as rotas, seus propósitos e implementação.

---

## Mapa de Rotas

```
/                          ← Home (SSG, revalidate=300)
/bazar                     ← Catálogo público com filtros
/detalhes-produto/[id]     ← Detalhe do produto (SSR dinâmico)
/loja?loja={email}         ← Vitrine de um artesão
/perfil-usuario?email={e}  ← Perfil público de artesão
/entrar                    ← Login
/registrar                 ← Cadastro
/quem-somos                ← Sobre o projeto (SSG)
/demandas                  ← Formulário de encomenda → WhatsApp

── ROTAS PROTEGIDAS (requerem authToken cookie) ──────────
/painel                    ← Dashboard do usuário
/perfil                    ← Dados pessoais + endereço + produtos
/carrinho                  ← Checkout e finalização
/pedidos                   ← Histórico de compras e vendas
/cadastrar-produto         ← Criar novo produto
/editar-produto/[id]       ← Editar produto existente
/gerenciar-vendas          ← Dashboard de receita (charts)
/contato                   ← Lista de artesãos da comunidade

── ROUTE HANDLERS (API) ──────────────────────────────────
/api/auth  POST            ← Seta cookie httpOnly com token
/api/auth  DELETE          ← Deleta cookie (logout)
/api/me    GET             ← Retorna {perfil, token} para hidratação
```

---

## Páginas Públicas

### `/` — Home

**Arquivo:** `src/app/page.tsx`

**Estratégia:** SSG + `revalidate = 300` (re-valida a cada 5 minutos)

**Seções:**
1. `HeroSection` — fullscreen com vídeo + busca semântica
2. `BentoGrid` — 7 produtos em destaque (Suspense com skeleton)
3. "Como Funciona" — 3 passos
4. "Nossa História" — trust section dark
5. CTA "Você é artesão?"

**Data fetching:** `getProdutos({ size: 7 })` no Server Component `FeaturedGrid` dentro de Suspense.

---

### `/bazar` — Catálogo

**Arquivos:** `src/app/bazar/page.tsx` + `src/app/bazar/BazarContent.tsx` + `src/app/bazar/loading.tsx`

**Estratégia:** SSG shell + CSR data

**Features:**
- Filtro por texto (debounce 400ms)
- Filtro por categoria (CategoriesStrip)
- Paginação com URL sync (`router.replace`)
- `page`, `categoriaId`, `nome` sincronizados com searchParams

**Endpoints:**
- `GET /produtos` ou `GET /produtos/filtro` (se categoriaId)
- `GET /categorias`

---

### `/detalhes-produto/[id]` — Produto

**Arquivo:** `src/app/detalhes-produto/[id]/page.tsx`

**Estratégia:** SSR dinâmico

**Features:**
- `generateMetadata()` para SEO por produto
- JSON-LD Schema.org `Product` para rich snippets
- Imagem do produto (4:5, priority)
- Info do artesão com link para a loja
- `AddToCartButton` (client component)

---

### `/loja?loja={email}` — Vitrine do Artesão

**Arquivos:** `src/app/loja/page.tsx` + `src/app/loja/LojaContent.tsx`

**Dados:** `getDonoLoja(email, token)` + `getProdutosLoja(email, token)`

**Requer auth** (usa token do store) — se não logado, não carrega dados.

---

### `/perfil-usuario?email={email}` — Perfil Público

**Arquivos:** `src/app/perfil-usuario/page.tsx` + `src/app/perfil-usuario/PerfilUsuarioContent.tsx`

Exibe foto, nome, pontos do artesão + grid de produtos + link para a loja.

---

### `/entrar` e `/registrar`

**Estratégia:** SSG

Redirecionam para `/painel` se o usuário já tem cookie válido (via middleware).

Formulários com React Hook Form + Zod.

---

### `/quem-somos` — Sobre

**Estratégia:** SSG

Seções: hero texto, stats (100+ artesãos, 500+ peças), valores (Comunidade, Autenticidade, Sustentabilidade, Território), missão.

---

### `/demandas` — Encomendas

**Estratégia:** CSR

Formulário para solicitar peças personalizadas:
- Seleção de categoria (grid de botões toggle)
- Descrição livre + orçamento estimado
- Envia para WhatsApp formatado via `wa.me/{number}?text={encoded}`

---

## Páginas Protegidas

### `/painel` — Dashboard

Greeting com foto + nome. Stats de pontos e status da loja. Action cards para as seções principais.

Carrega perfil via `getUsuarioLogado(token)` se store vazio.

---

### `/perfil` — Meu Perfil

Tabs: Dados pessoais | Endereço | Meus produtos

- **Dados pessoais:** `PerfilForm` (nome, CPF, tel, foto + toggle loja)
- **Endereço:** `EnderecoForm` (CEP auto-fill, cria ou atualiza)
- **Meus produtos:** `ProdutoGrid` com `showOwnerActions=true` (botão editar)

---

### `/carrinho` — Checkout

Lista de items + resumo com subtotal.

**Fluxo de finalização:**
1. Verifica se tem endereço cadastrado (alerta se não tem)
2. Agrupa itens por `autorId` (vendedor)
3. `Promise.all()` → cria um pedido por vendedor
4. `limpar()` → navega para `/pedidos?estado=compras`

---

### `/pedidos` — Histórico

Toggle Compras / Vendas. Paginado. URL sync com `estado` e `page`.

---

### `/cadastrar-produto` e `/editar-produto/[id]`

Ambos usam o mesmo `ProdutoForm`:
- `/cadastrar-produto` → `<ProdutoForm />` (sem produtoId)
- `/editar-produto/[id]` → `<ProdutoForm produtoId={id} />`

---

### `/gerenciar-vendas` — Relatórios

Busca até 200 itens vendidos. Processa localmente:
- Agrupa por mês (`buildChartData()`)
- `BarChart` Recharts com tooltip customizado
- Cards de receita total e itens vendidos

---

### `/contato` — Comunidade

Lista paginada de usuários com busca por nome (debounce 400ms). Para cada perfil: botão "Loja" e "Perfil". Botão "Falar com suporte" → WhatsApp.

---

## Middleware de Roteamento

**Arquivo:** `middleware.ts` (raiz do projeto)

```typescript
const PROTECTED = [
  '/painel', '/perfil', '/carrinho', '/pedidos',
  '/cadastrar-produto', '/editar-produto',
  '/gerenciar-vendas', '/contato',
];

const AUTH_ONLY = ['/entrar', '/registrar'];
```

**Matcher:** exclui `/api/*`, `/_next/static`, `/_next/image`, `favicon.ico`

**Edge Runtime** — não tem acesso ao Node.js APIs.

---

## Convenção Page/Content

Para páginas com muita lógica client-side, o padrão é:

```
/bazar/
  page.tsx         ← Server Component: metadata, Suspense, importa BazarContent
  BazarContent.tsx ← 'use client': toda a lógica interativa
  loading.tsx      ← UI de loading (automático pelo Next.js)
```

Vantagens:
- `metadata` não pode ser exportado de Client Components
- Suspense funciona melhor com Server Components como boundary
- SEO sem sacrificar interatividade

---

## Layouts Especiais

### `src/app/layout.tsx` — Root Layout

- Aplica fontes (`--font-inter`, `--font-playfair`)
- Injeta GTM e Meta Pixel (se env vars configuradas)
- Monta `<Providers>`, `<Header>`, `<Footer>`, `<WhatsAppButton>`
- `suppressHydrationWarning` no `<html>` (Lenis + dark mode futuramente)

### `src/app/(protected)/layout.tsx` — Protected Layout

- Server Component
- Lê cookie com `cookies()` (Next.js)
- `isTokenExpired()` → `redirect('/entrar')` se falhar

---

## Páginas Especiais

### `error.tsx` — Error Boundary Global

Captura erros de runtime. Exibe mensagem + botão "Tentar novamente" que chama `reset()`.

### `not-found.tsx` — 404

Exibido automaticamente quando `notFound()` é chamado ou rota não existe.
