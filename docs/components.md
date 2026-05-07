# Catálogo de Componentes — Vitrine do Artesanato

Referência de todos os componentes reutilizáveis do projeto.

---

## Layout

### `Header` (`src/components/layout/Header.tsx`)

Header fixo com glassmorphism que encolhe no scroll.

**Features:**
- Glassmorphism progressivo via `useTransform(scrollY, [0, 80], [0, 1])`
- Indicador de rota ativa com `layoutId="nav-indicator"` (spring animation)
- Avatar do usuário com menu dropdown animado
- Badge do carrinho com contagem (AnimatePresence)
- Menu mobile hamburger → X animado
- Fecha menus ao mudar de rota (`usePathname`)

**Dependências:** `useCarrinhoStore`, `useAuth`, `ROUTES`

---

### `Footer` (`src/components/layout/Footer.tsx`)

Footer escuro com links e redes sociais.

**Seções:** Brand + contato | Links loja | Links conta | Social

---

## Home

### `HeroSection` (`src/components/home/HeroSection.tsx`)

Hero fullscreen com vídeo + parallax.

**Features:**
- Vídeo `autoPlay muted loop` com fallback `poster="/assets/hero-fallback.jpg"`
- Parallax via Framer Motion `useScroll + useTransform`
- Text reveal word-by-word com `variants` (stagger 0.07s)
- Busca semântica com 4 modos (Técnica, Material, Região, Artesão)
- Scroll indicator animado
- Badge badge com pulse lento via `animate-pulse-slow`
- GSAP para o badge de entrada

**Props:** nenhuma (standalone)

**Busca:** `router.push('/bazar?nome={query}&modo={mode}')`

---

### `BentoGrid` (`src/components/home/BentoGrid.tsx`)

Grid assimétrico para produtos em destaque na home.

**Layout:**
```
[   Featured (col-span-7 row-span-2)   ] [  Half  ]
                                         [  Half  ]
[ Third ] [ Third ] [ Third ] [ Third ]
```

**Props:**
```typescript
interface BentoGridProps {
  produtos: Produto[];  // espera ao menos 1 produto
}
```

Renderiza `null` se array vazio.

---

### `CategoriesStrip` (`src/components/home/CategoriesStrip.tsx`)

Strip horizontal de filtros por categoria com scroll automático para o item ativo.

**Props:**
```typescript
interface CategoriesStripProps {
  categorias: Categoria[];
  selected: string;       // id da categoria selecionada ('' = Todos)
  onChange: (id: string) => void;
}
```

**Features:**
- `useRef` para scroll automático ao item ativo
- Fade nas bordas com gradiente (pseudo-efeito)
- Scrollbar oculta (`.scrollbar-none`)

---

### `WhatsAppButton` (`src/components/home/WhatsAppButton.tsx`)

Botão flutuante WhatsApp no canto inferior direito.

**Props:**
```typescript
interface WhatsAppButtonProps {
  phoneNumber?: string;       // default: NEXT_PUBLIC_WHATSAPP_NUMBER
  defaultMessage?: string;
  context?: string;           // contexto adicional (URL do produto, etc.)
}
```

**Features:**
- Pulse rings animados (duplo, Framer Motion)
- Tooltip hover com AnimatePresence
- Glassmorphism no botão

---

## Produto

### `ProdutoCard` (`src/components/produto/ProdutoCard.tsx`)

Card de produto para grids.

**Props:**
```typescript
interface ProdutoCardProps {
  produto: Produto;
  onAdicionarCarrinho?: (produto: Produto) => void;  // override do comportamento padrão
  showOwnerActions?: boolean;  // mostra botão editar em vez de adicionar
  index?: number;              // delay de stagger na animação de entrada
}
```

**Features:**
- Hover: imagem zoom (`group-hover:scale-110`) + overlay com "Ver peça"
- Badge de categoria (absoluto, canto superior esquerdo)
- Badge "Sem estoque" quando `quantidade <= 0`
- Botão de carrinho desabilitado sem estoque
- Toast via `sonner` ao adicionar
- `whileHover={{ y: -4 }}` no card

---

### `ProdutoGrid` (`src/components/produto/ProdutoGrid.tsx`)

Grid responsivo de ProdutoCards com loading state.

**Props:**
```typescript
interface ProdutoGridProps {
  produtos: Produto[];
  loading?: boolean;
  emptyMessage?: string;
  showOwnerActions?: boolean;
}
```

**Features:**
- Loading: mostra `ProdutoCardSkeleton` (count derivado do tamanho da grid)
- Empty: mensagem animada com fade in
- AnimatePresence para saída suave de cards removidos
- Ao adicionar ao carrinho (modo não-owner): navega direto para `/carrinho`

---

### `ProdutoForm` (`src/components/produto/ProdutoForm.tsx`)

Formulário de criação/edição de produto.

**Props:**
```typescript
interface ProdutoFormProps {
  produtoId?: string;  // undefined = criar; string = editar
}
```

**Features:**
- Carrega categorias na montagem
- Em modo edição: pré-preenche campos via `getProdutoById`
- Controle +/- para quantidade (1–99)
- Validação Zod: nome min 2, categoriaId required, preco > 0, imagem URL
- Redireciona para `/perfil` após salvar

---

### `AddToCartButton` (`src/components/produto/AddToCartButton.tsx`)

Botão grande de "Adicionar ao carrinho" na página de detalhes do produto.

**Props:**
```typescript
interface AddToCartButtonProps {
  produto: Produto;
}
```

**Features:**
- Estado: idle → added (verde com ✓) → volta idle em 2s
- Após 600ms de "added": navega para `/carrinho`
- Cleanup de timers com `useRef` + `useEffect` (sem memory leak)
- Disabled quando sem estoque

---

## Pedidos

### `PedidoCard` (`src/components/pedidos/PedidoCard.tsx`)

Card de item de pedido (compra ou venda).

**Exibe:** imagem do produto, nome, preço, quantidade, status, vendedor/comprador

**Status possíveis:** PENDENTE | CONFIRMADO | EM_PREPARO | ENVIADO | ENTREGUE | CANCELADO

Cores por status: mapeadas em `STATUS_COLORS` (ocre → terracotta → wood).

---

### `PedidoToggle` (`src/components/pedidos/PedidoToggle.tsx`)

Alternador "Compras / Vendas" na página de pedidos.

**Props:**
```typescript
interface PedidoToggleProps {
  estado: 'compras' | 'vendas';
  onChange: (e: 'compras' | 'vendas') => void;
}
```

---

## Perfil

### `PerfilForm` (`src/components/perfil/PerfilForm.tsx`)

Formulário de edição de dados pessoais.

**Props:** `{ perfil: Perfil }`

**Fields:** nome completo, CPF, telefone, URL da foto, e-mail (readonly)

**Extra:** Toggle ativa/desativa loja com `PATCH /usuarios/loja/status`

---

### `EnderecoForm` (`src/components/perfil/EnderecoForm.tsx`)

Formulário de endereço de entrega com auto-preenchimento via CEP.

**Features:**
- `useCep(cepValue)` → busca ViaCEP com debounce 500ms
- Pré-preenche: rua, bairro, cidade, estado, complemento
- Spinner no campo CEP enquanto busca
- Detecta se já tem endereço → usa PUT em vez de POST

---

## Carrinho

### `CarrinhoItem` (`src/components/carrinho/CarrinhoItem.tsx`)

Item individual na página do carrinho.

**Features:**
- Controles +/- de quantidade
- Botão remover
- Exibe nome do artesão (`autorNome`)
- Animado com Framer Motion (entrada/saída)

---

## UI Base

### `Button` (`src/components/ui/Button.tsx`)

Ver `docs/design-system.md#button`.

---

### `Input` (`src/components/ui/Input.tsx`)

Ver `docs/design-system.md#input`.

---

### `Pagination` (`src/components/ui/Pagination.tsx`)

Componente de paginação com ellipsis.

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;    // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

Usa `usePagination()` internamente para gerar `(number | null)[]` onde `null` = ellipsis.

---

### `Skeleton` (`src/components/ui/Skeleton.tsx`)

```typescript
// Card de produto em loading
<ProdutoCardSkeleton count={8} />
```

Usa a classe `.skeleton` do globals.css (shimmer gradient animado).

---

## Hooks

### `useAuth` (`src/hooks/useAuth.ts`)

```typescript
const { usuario, token, isLoggedIn, logout } = useAuth();
```

Wrapper do `useAuthStore` + `logout()` que chama DELETE `/api/auth` e limpa o store.

---

### `useCarrinho` (`src/hooks/useCarrinho.ts`)

Wrapper do `useCarrinhoStore` para uso simplificado em componentes.

---

### `useCep(rawCep: string)`

```typescript
const { data, loading, error } = useCep(cepValue);
// data: ViaCepResponse | null
```

- Debounce 500ms
- Só busca quando CEP tem 8 dígitos
- Remove caracteres não-numéricos antes de buscar

---

### `useDebounce<T>(value, delay?)`

```typescript
const debouncedBusca = useDebounce(busca, 400);
```

---

### `usePagination(totalPages, currentPage)`

```typescript
const pages = usePagination(totalPages, currentPage);
// Retorna: [0, 1, 2, null, 8, 9, 10] (null = ellipsis)
```

---

## Providers (`src/providers.tsx`)

Árvore de providers na raiz da aplicação:

```
QueryClientProvider (TanStack Query, staleTime: 60s)
  AuthHydrator (hidrata useAuthStore via /api/me)
  LenisProvider (scroll suave global)
    {children}
    Toaster (Sonner, richColors, position: top-right)
  ReactQueryDevtools (só em dev)
```

---

## Quando Criar um Novo Componente

1. **UI base reutilizável** → `src/components/ui/`
2. **Específico de domínio** → pasta da feature (`produto/`, `pedidos/`, `perfil/`)
3. **Específico de página** → dentro da pasta da página como `XxxContent.tsx`
4. **Só de layout** → `src/components/layout/`
5. Sempre com `'use client'` se usar hooks, eventos ou browser APIs
