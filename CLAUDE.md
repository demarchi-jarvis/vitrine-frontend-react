# CLAUDE.md — Vitrine do Artesanato

Instruções para Claude Code trabalhar neste projeto. Este arquivo é carregado automaticamente em toda sessão.

---

## Contexto do Projeto

**Vitrine do Artesanato** é um marketplace B2C de produtos artesanais do Vale do Café (Vassouras, RJ). Conecta artesãos locais com compradores. Faz parte do programa **Vassouras Tec**.

- Frontend: este repositório (`vitrine-frontend-react`)
- Backend: repositório separado (`independencia-backend`) — Spring Boot 4 / Java 24 / PostgreSQL
- Os dois projetos se comunicam via REST API em `localhost:8081/api` (dev)

---

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.0 |
| UI | React | 19.0 |
| Linguagem | TypeScript | 5.7 |
| Estilo | Tailwind CSS | 3.4 |
| Animações | Framer Motion | 11 |
| Animações imperativas | GSAP + @gsap/react | 3.12 |
| Scroll suave | Lenis | 1.1 |
| Estado global | Zustand | 5 |
| Fetch/cache | TanStack Query | 5.62 |
| Formulários | React Hook Form + Zod | 7.54 / 3.23 |
| Toast | Sonner | 1.7 |
| Ícones | Lucide React | 0.469 |
| Gráficos | Recharts | 2.14 |
| JWT decode | jwt-decode | 4.0 |

---

## Comandos Essenciais

```bash
npm run dev          # dev server com Turbopack (porta 3000)
npm run build        # build de produção
npm run type-check   # tsc --noEmit (TypeScript sem emitir)
npm run lint         # ESLint next/core-web-vitals
npm start            # serve o build de produção
```

**Antes de qualquer commit:** `npm run type-check && npm run lint && npm run build`

---

## Arquitetura em 30 Segundos

```
Browser
  └── Next.js App Router (SSR/SSG + Client Components)
        ├── middleware.ts          ← verifica cookie authToken em rotas protegidas
        ├── /app/api/auth          ← seta/deleta cookie httpOnly (login/logout)
        ├── /app/api/me            ← hidrata store pós-refresh
        ├── src/store/             ← Zustand (auth + carrinho)
        ├── src/lib/api/           ← fetch layer para o backend Spring Boot
        └── src/components/        ← UI em camadas (layout / home / produto / ui)
```

**Backend externo:** `http://localhost:8081/api` (Spring Boot). Não é parte deste repo.

---

## Regras de Auth (CRÍTICO — não quebrar)

1. **Login/Registro:** cliente chama backend diretamente → recebe `{nome, token}` → envia para `/api/auth` (Next.js route handler) → cookie `httpOnly` é setado.
2. **Middleware** (`middleware.ts`): intercepta toda rota não-API, verifica cookie `authToken`, redireciona para `/entrar` se ausente/expirado.
3. **ProtectedLayout** (`/app/(protected)/layout.tsx`): segunda camada server-side — verifica cookie novamente antes de renderizar.
4. **AuthHydrator** (`src/providers.tsx`): no mount, chama `/api/me` para re-hidratar `useAuthStore` com `{perfil, token}` após page refresh.
5. **Token nunca vai para localStorage ou sessionStorage** — só httpOnly cookie (servidor) e memória Zustand (cliente).

---

## Padrões Obrigatórios

### Chamadas de API
```typescript
// Client Component → usa clientFetch (token via parâmetro)
import { clientFetch } from '@/lib/api/client';
const data = await clientFetch('/rota', { token });

// Server Component / Route Handler → usa serverFetch
import { serverFetch } from '@/lib/api/client';
const data = await serverFetch('/rota', token);
```

### Páginas com conteúdo interativo
```typescript
// page.tsx = Server Component (SEO/metadata)
// XxxContent.tsx = Client Component (lógica interativa)
// Exemplo: /bazar/page.tsx + /bazar/BazarContent.tsx
```

### Rotas tipadas — sempre usar ROUTES
```typescript
import { ROUTES } from '@/lib/routes';
<Link href={ROUTES.detalhes(produto.id)} />   // ✓
<Link href={`/detalhes-produto/${id}`} />     // ✗
```

### Classes CSS — sempre via cn()
```typescript
import { cn } from '@/lib/utils';
className={cn('base-classes', condicao && 'extra-class')}
```

### Formulários — React Hook Form + Zod (obrigatório)
```typescript
const schema = z.object({ campo: z.string().min(1) });
type FormData = z.infer<typeof schema>;
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### Feedback ao usuário — Sonner toast
```typescript
import { toast } from 'sonner';
toast.success('Mensagem!');
toast.error('Erro!');
```

---

## Design System (resumo — ver docs/design-system.md)

**Nunca usar cores hex diretamente.** Usar as paletas do Tailwind config:

| Paleta | Uso |
|---|---|
| `sand-*` | backgrounds, superfícies claras |
| `wood-*` | textos, escuros, footer |
| `terracotta-*` | primária, CTAs, destaques |
| `ocre-*` | acentos, pontos, badges |

**Fontes:** `font-serif` (Playfair Display) para headings, `font-sans` (Inter) para corpo.

**Ease padrão:** `ease-organic` = `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.

---

## O que NÃO Alterar sem Justificativa

- `middleware.ts` — lógica de proteção de rotas
- `src/lib/auth/token.ts` — parsing/validação de JWT
- `src/app/api/auth/route.ts` — gestão do cookie httpOnly
- `src/app/api/me/route.ts` — hidratação de sessão
- Paletas de cores em `tailwind.config.ts`
- Fontes (`--font-playfair`, `--font-inter`) em `layout.tsx`

---

## Estrutura de Arquivos

```
src/
├── app/
│   ├── (protected)/          # Rotas que exigem auth (layout verifica cookie)
│   │   ├── layout.tsx         # Guard server-side
│   │   ├── painel/            # Dashboard do usuário
│   │   ├── perfil/            # Dados pessoais + endereço + produtos
│   │   ├── carrinho/          # Checkout + finalização de pedido
│   │   ├── pedidos/           # Histórico compras/vendas
│   │   ├── cadastrar-produto/ # Criar novo produto
│   │   ├── editar-produto/    # Editar produto existente
│   │   ├── gerenciar-vendas/  # Dashboard de receita (Recharts)
│   │   └── contato/           # Lista de artesãos da comunidade
│   ├── api/
│   │   ├── auth/route.ts      # POST (seta cookie) + DELETE (logout)
│   │   └── me/route.ts        # GET (hidratação de sessão)
│   ├── bazar/                 # Catálogo público com filtros
│   ├── detalhes-produto/[id]/ # Detalhe do produto (SSR + JSON-LD)
│   ├── loja/                  # Vitrine de um artesão
│   ├── perfil-usuario/        # Perfil público de artesão
│   ├── entrar/                # Login
│   ├── registrar/             # Cadastro
│   ├── demandas/              # Formulário de encomenda → WhatsApp
│   ├── quem-somos/            # Sobre o projeto
│   ├── layout.tsx             # Root layout (fontes, GTM, Pixel, Providers)
│   ├── page.tsx               # Home (Hero + BentoGrid + seções)
│   ├── error.tsx              # Error boundary global
│   ├── not-found.tsx          # 404
│   └── globals.css            # Tailwind + tokens CSS + utilitários
├── components/
│   ├── home/                  # HeroSection, BentoGrid, CategoriesStrip, WhatsAppButton
│   ├── layout/                # Header, Footer
│   ├── produto/               # ProdutoCard, ProdutoGrid, ProdutoForm, AddToCartButton
│   ├── pedidos/               # PedidoCard, PedidoToggle
│   ├── perfil/                # PerfilForm, EnderecoForm
│   ├── carrinho/              # CarrinhoItem
│   └── ui/                    # Button, Input, Pagination, Skeleton
├── hooks/
│   ├── useAuth.ts             # logout helper
│   ├── useCarrinho.ts         # wrapper do store do carrinho
│   ├── useCep.ts              # busca ViaCEP com debounce
│   ├── useDebounce.ts         # debounce genérico
│   └── usePagination.ts       # gera array de páginas com ellipsis
├── lib/
│   ├── api/                   # client.ts + auth/categoria/endereco/pedido/produto/usuario
│   ├── auth/token.ts          # parse + validação de JWT
│   ├── routes.ts              # ROUTES object tipado
│   └── utils.ts               # cn, formatBRL, formatDate, buildWhatsAppUrl
├── providers.tsx              # QueryClient + Lenis + Toaster + AuthHydrator
├── store/
│   ├── auth.store.ts          # useAuthStore (Zustand, não persistido)
│   └── carrinho.store.ts      # useCarrinhoStore (Zustand + sessionStorage)
└── types/index.ts             # Todos os tipos TypeScript do domínio
```

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api    # obrigatório
NEXT_PUBLIC_SITE_URL=http://localhost:3000       # OG tags
NEXT_PUBLIC_WHATSAPP_NUMBER=5524999999999        # botão flutuante + demandas
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX                  # opcional (tracking)
NEXT_PUBLIC_META_PIXEL_ID=000000000000000       # opcional (remarketing)
```

---

## Referências Rápidas

- Documentação completa de arquitetura: `ARCHITECTURE.md`
- Design System detalhado: `docs/design-system.md`
- Fluxo de autenticação: `docs/auth.md`
- Contrato da API backend: `docs/backend-contract.md`
- Roadmap de funcionalidades: `docs/roadmap.md`
- Todos os componentes UI: `docs/components.md`
