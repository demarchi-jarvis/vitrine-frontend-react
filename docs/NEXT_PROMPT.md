# NEXT_PROMPT — Briefing para Construção Completa v2

> Este arquivo é o briefing que o próximo Claude deve ler antes de qualquer código.  
> Contexto completo, sem precisar reler o Angular.

---

## Missão

Construir o frontend **vitrine-artesao v2** do zero em `/home/ubuntu/vitrine-frontend-react`.  
Migração e melhoria completa do Angular 17 para **Next.js 16 + React 19**.

---

## Contexto do Projeto

- **Produto:** Marketplace de artesãos do Vale do Café — incubadora Vassouras Tec / UniVassouras
- **Backend:** `/home/ubuntu/independencia-backend` — Spring Boot 4 / Java 24 / PostgreSQL / JWT HMAC256
- **Backend porta:** `http://localhost:8081/api`
- **Angular original:** `/home/ubuntu/vitrine-frontend-angular` ← fonte de verdade da lógica
- **Este projeto:** `/home/ubuntu/vitrine-frontend-react` ← onde tudo será construído
- **Repo GitHub:** `git@github.com:demarchi-jarvis/vitrine-frontend-react.git`

---

## Stack Definitiva

```
Next.js 16         — App Router, Server Components, middleware
React 19           — RSC, use(), Server Actions
TypeScript 5       — strict mode
Tailwind CSS v4    — design tokens nativos, sem config JS
Zustand v5         — estado global (carrinho + auth)
TanStack Query v5  — cache/fetching (server + client)
React Hook Form    — formulários performáticos
Zod                — validação e tipos
Recharts           — gráfico de barras (gerenciar-vendas)
Lucide React       — ícones tree-shakeable
Sonner             — toasts de feedback
jwt-decode         — parse do token no middleware
next/image         — imagens otimizadas
next/font          — Roboto + Open Sans
```

---

## Documentação de Referência (já criada)

Leia nesta ordem antes de começar:

| Arquivo | O que contém |
|---|---|
| `docs/BUGS.md` | **15 bugs do Angular a corrigir** — leitura obrigatória antes de qualquer código |
| `docs/ARCHITECTURE.md` | Estrutura de pastas completa, rendering strategy por página |
| `docs/TYPES.md` | Todas as interfaces TypeScript |
| `docs/TECH_STACK.md` | Justificativa de cada dependência |
| `/home/ubuntu/vitrine-artesao/docs/API.md` | Todos os endpoints do backend |
| `/home/ubuntu/vitrine-artesao/docs/PAGES.md` | Especificação de cada página |
| `/home/ubuntu/vitrine-artesao/docs/STATE.md` | Zustand, TanStack Query, middleware, hooks |
| `/home/ubuntu/vitrine-artesao/docs/COMPONENTS.md` | Especificação de cada componente |
| `/home/ubuntu/vitrine-artesao/docs/MIGRATION.md` | Mapeamento Angular → React |

---

## Estrutura de Pastas a Criar

```
vitrine-frontend-react/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root: Providers + font + Toaster
│   │   ├── globals.css                   # Tailwind v4 @theme
│   │   ├── not-found.tsx                 # 404 customizado
│   │   ├── error.tsx                     # Error boundary global
│   │   │
│   │   ├── (public)/                     # SSR/SSG — sem auth obrigatório
│   │   │   ├── page.tsx                  # / — Home carrossel + cards
│   │   │   ├── quem-somos/page.tsx       # Institucional (SSG)
│   │   │   ├── demandas/page.tsx         # Formulário demanda
│   │   │   ├── bazar/page.tsx            # Marketplace (SSR + ISR)
│   │   │   ├── bazar/loading.tsx         # Skeleton 12 cards
│   │   │   ├── detalhes-produto/[id]/page.tsx  # SSR + generateMetadata
│   │   │   ├── loja/page.tsx             # Vitrine artesão (?loja=email)
│   │   │   └── perfil-usuario/page.tsx   # Perfil público (?email=)
│   │   │
│   │   ├── (auth)/                       # Só para NÃO autenticados
│   │   │   ├── entrar/page.tsx
│   │   │   └── registrar/page.tsx
│   │   │
│   │   ├── (protected)/                  # JWT obrigatório
│   │   │   ├── layout.tsx                # Verifica token, redireciona
│   │   │   ├── painel/page.tsx
│   │   │   ├── perfil/page.tsx
│   │   │   ├── carrinho/page.tsx
│   │   │   ├── pedidos/page.tsx
│   │   │   ├── cadastrar-produto/page.tsx
│   │   │   ├── editar-produto/[id]/page.tsx
│   │   │   ├── gerenciar-vendas/page.tsx
│   │   │   └── contato/page.tsx
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           └── route.ts              # Login/logout via cookie httpOnly
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Carousel.tsx
│   │   │   └── Pagination.tsx
│   │   ├── produto/
│   │   │   ├── ProdutoCard.tsx
│   │   │   ├── ProdutoGrid.tsx
│   │   │   └── ProdutoForm.tsx
│   │   ├── carrinho/
│   │   │   ├── CarrinhoDrawer.tsx
│   │   │   └── CarrinhoItem.tsx
│   │   ├── pedidos/
│   │   │   ├── PedidoCard.tsx
│   │   │   └── PedidoToggle.tsx
│   │   └── perfil/
│   │       ├── PerfilForm.tsx
│   │       └── EnderecoForm.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # fetch base + authFetch
│   │   │   ├── auth.ts
│   │   │   ├── produto.ts
│   │   │   ├── pedido.ts
│   │   │   ├── usuario.ts
│   │   │   ├── endereco.ts
│   │   │   └── categoria.ts
│   │   ├── auth/
│   │   │   └── token.ts              # parseToken, isExpired
│   │   └── utils.ts                  # cn(), formatBRL(), formatDate()
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCarrinho.ts
│   │   ├── useCep.ts
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/
│   │   ├── carrinho.store.ts
│   │   └── auth.store.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── providers.tsx                 # QueryClientProvider + Sonner
│
├── public/
│   └── assets/                       # Copiar de vitrine-frontend-angular/src/assets/
│
├── middleware.ts                     # Proteção de rotas (substitui authGuard)
├── next.config.ts
├── tailwind.config.ts                # v4 — mínimo, @theme em globals.css
├── tsconfig.json
└── package.json
```

---

## 17 Rotas a Implementar

### Públicas
| Rota | Rendering | Angular equiv. |
|---|---|---|
| `/` | SSG | `IndexComponent` |
| `/quem-somos` | SSG | `QuemSomosComponent` |
| `/demandas` | SSR | `DemandasComponent` |
| `/bazar` | SSR + ISR 60s | `BazarComponent` |
| `/detalhes-produto/[id]` | SSR | `DetalhesProdutoComponent` |
| `/loja` | SSR | `LojaComponent` |
| `/perfil-usuario` | SSR | `PerfilUsuarioComponent` |
| `/entrar` | CSR | `EntrarComponent` |
| `/registrar` | CSR | `RegistrarComponent` |

### Protegidas
| Rota | Rendering | Angular equiv. |
|---|---|---|
| `/painel` | CSR | `PainelComponent` |
| `/perfil` | CSR | `PerfilComponent` |
| `/carrinho` | CSR | `CarrinhoComprasComponent` |
| `/pedidos` | CSR | `PedidosComponent` |
| `/cadastrar-produto` | CSR | `CadastrarProdutoComponent` |
| `/editar-produto/[id]` | CSR | `EditarProdutoComponent` |
| `/gerenciar-vendas` | CSR | `GerenciarVendasComponent` |
| `/contato` | CSR | `ContatoComponent` |

---

## Bugs Críticos a Corrigir (obrigatório)

Ver `docs/BUGS.md` para detalhes completos.

| # | Bug | Fix em |
|---|---|---|
| BUG-01 | Token em localStorage → XSS | `app/api/auth/route.ts` + cookie httpOnly |
| BUG-02 | clienteId vazio no pedido | `store/auth.store.ts` + `carrinho/page.tsx` |
| BUG-03 | vendedorId hardcoded | `carrinho/page.tsx` — extrair de `item.autor.id` |
| BUG-04 | enderecoEntregaId vazio | `carrinho/page.tsx` — buscar antes de finalizar |
| BUG-05 | usuario.id vazio no endereço | `perfil/page.tsx` — backend usa JWT |
| BUG-06 | Redirect /login inexistente | `lib/routes.ts` + uso consistente |
| BUG-07 | Carrinho localStorage/sessionStorage misto | `store/carrinho.store.ts` uniforme |
| BUG-09 | Dedup carrinho por nome, não id | `store/carrinho.store.ts` |
| BUG-10 | window.location ao add carrinho | `router.push()` |
| BUG-13 | window.location.reload ao salvar perfil | `queryClient.invalidateQueries()` |
| BUG-14 | alert() e console.log em produção | Remover todos |

---

## Ordem de Implementação

```
FASE 1 — Fundação (não tem UI, mas tudo depende disso)
  1.1  package.json + next.config.ts + tsconfig.json
  1.2  src/types/index.ts — todas as interfaces
  1.3  src/lib/utils.ts — cn(), formatBRL(), formatDate()
  1.4  src/lib/auth/token.ts — parseToken, isTokenExpired
  1.5  src/lib/api/client.ts — apiFetch, authFetch
  1.6  src/lib/api/*.ts — auth, produto, pedido, usuario, endereco, categoria
  1.7  middleware.ts — proteção de rotas
  1.8  src/app/api/auth/route.ts — cookie httpOnly
  1.9  src/store/auth.store.ts + src/store/carrinho.store.ts
  1.10 src/providers.tsx — QueryClientProvider + Sonner
  1.11 src/app/globals.css — Tailwind v4 @theme + cores da marca
  1.12 src/app/layout.tsx — Root com font + Providers

FASE 2 — Layout Base
  2.1  src/components/layout/Header.tsx
  2.2  src/components/layout/Footer.tsx
  2.3  src/components/ui/Button.tsx
  2.4  src/components/ui/Input.tsx
  2.5  src/components/ui/Spinner.tsx + Badge.tsx + Card.tsx
  2.6  src/components/ui/Pagination.tsx + hooks/usePagination.ts
  2.7  src/components/ui/Carousel.tsx
  2.8  src/hooks/useAuth.ts + useCarrinho.ts + useCep.ts + useDebounce.ts

FASE 3 — Páginas Públicas
  3.1  / — Home (carrossel + cards projetos + seção comunidade)
  3.2  /bazar — Marketplace (filtro categoria + busca + paginação)
  3.3  /detalhes-produto/[id] — Detalhe + add carrinho / editar (se autor)
  3.4  /entrar — Login → cookie httpOnly
  3.5  /registrar — Cadastro → cookie httpOnly
  3.6  /quem-somos — Institucional estático
  3.7  /demandas — Formulário demanda

FASE 4 — Páginas Protegidas (Core)
  4.1  /perfil — Perfil + endereço + toggle loja (3 abas)
  4.2  /carrinho — Checkout com todos os bugs corrigidos
  4.3  /pedidos — Histórico compras/vendas com accordion + paginação
  4.4  /cadastrar-produto — Form produto + categorias
  4.5  /editar-produto/[id] — Form pré-populado

FASE 5 — Páginas Protegidas (Secundárias)
  5.1  /painel — Dashboard 6 tabs + ActionCards + underline animada
  5.2  /gerenciar-vendas — Dashboard gráfico Recharts
  5.3  /loja — Vitrine artesão carrossel horizontal
  5.4  /perfil-usuario — Perfil público por email
  5.5  /contato — Página de contato

FASE 6 — Qualidade
  6.1  src/app/not-found.tsx — 404 customizado
  6.2  src/app/error.tsx — Error boundary
  6.3  loading.tsx por página (skeleton)
  6.4  generateMetadata em /bazar e /detalhes-produto/[id]
  6.5  Copiar assets: cp -r /home/ubuntu/vitrine-frontend-angular/src/assets/* ./public/assets/
```

---

## Padrões de Código Obrigatórios

### Server vs Client
- Server Component por padrão
- `'use client'` apenas quando: hooks, eventos, browser APIs, Zustand
- Páginas de listagem (bazar, pedidos): Server Component busca dados, passa como props

### Formulários
```typescript
// Sempre: React Hook Form + Zod
const schema = z.object({ ... });
type Form = z.infer<typeof schema>;
const { register, handleSubmit, formState } = useForm<Form>({
  resolver: zodResolver(schema),
});
```

### Fetch
```typescript
// Server-side: fetch direto com token do cookie
// Client-side: authFetch() de lib/api/client.ts
// Cache: TanStack Query com queryKeys padronizados
```

### Navegação
```typescript
// Sempre via ROUTES constante, nunca string literal
import { ROUTES } from '@/lib/routes';
router.push(ROUTES.carrinho);
router.push(ROUTES.detalhes(produto.id));
```

### Feedback ao usuário
```typescript
// Sempre Sonner, nunca alert() ou console.log
import { toast } from 'sonner';
toast.success('Produto cadastrado!');
toast.error('Erro ao finalizar compra: ' + error.message);
```

---

## Cores da Marca (Tailwind v4)

```css
/* globals.css */
@theme {
  --color-brand-900: #1a237e;   /* azul-marinho primário */
  --color-brand-700: #283593;
  --color-brand-500: #3949ab;
  --color-brand-100: #e8eaf6;
}
```

---

## Assets Disponíveis

Copiar de `/home/ubuntu/vitrine-frontend-angular/src/assets/` para `public/assets/`:

- `logoIndependencia.png`, `Independencia.png` — logos
- `mendes-fundo-azul.png`, `LocalizacaoMendes.png`
- `icones/` — ícones de categoria (artesanato, brinquedo, camiseta, croche, decoracao, quadro, todos)
- Imagens carrossel: `independencia.jpg`, `bairro.jpg`, `associacao-carrousel2.jpg`, `participacao-ativa.jpg`
- `moradores.png`, `publico.png`, `colaboracao.png`, `associados.png`

---

## Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

---

## O que NÃO fazer

- Não criar testes (não foi pedido)
- Não adicionar Storybook ou documentação de componentes além do código
- Não usar `window.location.href` — sempre `router.push()`
- Não usar `alert()` — sempre `toast`
- Não deixar `console.log` no código final
- Não duplicar lógica entre CadastrarProduto e EditarProduto — usar ProdutoForm compartilhado
- Não passar token como parâmetro de função — usar `authFetch()` centralizado
- Não usar `any` em TypeScript — usar os tipos de `types/index.ts`
