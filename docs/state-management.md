# State Management — Vitrine do Artesanato

Zustand stores, estratégia de persistência e padrões de uso.

---

## Visão Geral

O projeto usa **duas camadas** de estado:

| Camada | Tecnologia | Propósito |
|---|---|---|
| Estado de domínio | Zustand | Auth do usuário, carrinho |
| Cache de servidor | TanStack Query | Não usado ativamente (estrutura pronta) |
| Estado de URL | `useSearchParams` / `router.replace` | Filtros do bazar, paginação |
| Estado de formulário | React Hook Form | Formulários (não no store global) |

---

## `useAuthStore` (`src/store/auth.store.ts`)

### Interface

```typescript
interface AuthStore {
  usuario: Perfil | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (usuario: Perfil, token: string) => void;
  clearAuth: () => void;
}
```

### Persistência

**Não persistido** (intencional).

- Vivência: apenas em memória durante a sessão JS ativa
- Após page refresh: re-hidratado pelo `AuthHydrator` via `/api/me`
- Após fechar aba: limpo (re-login necessário, mas cookie válido permite re-hidratação automática)

### Quando é populado

| Evento | Ação |
|---|---|
| Login bem-sucedido | `setAuth(perfil, token)` |
| Registro bem-sucedido | `setAuth(perfil, token)` |
| Page refresh (se cookie válido) | `setAuth(perfil, token)` via AuthHydrator |
| Painel/Perfil com store vazio | `setAuth(perfil, token)` (cada página tem fallback) |
| Logout | `clearAuth()` |

### Uso nos Componentes

```typescript
// Leitura básica
const { isLoggedIn, usuario } = useAuthStore();

// Para operações autenticadas
const { token } = useAuthStore();
if (!token) return;
const dados = await clientFetch('/rota', { token });

// Logout (via hook wrapper)
const { logout } = useAuth();
<button onClick={logout}>Sair</button>
```

### Fallback de Perfil em Páginas

Algumas páginas têm fallback próprio quando o store está vazio:
```typescript
// Padrão em painel/page.tsx e perfil/page.tsx
useEffect(() => {
  if (!token || usuario) return;  // pula se já tem dados
  getUsuarioLogado(token).then((p) => setAuth(p, token));
}, [token, usuario, setAuth]);
```

---

## `useCarrinhoStore` (`src/store/carrinho.store.ts`)

### Interface

```typescript
interface CarrinhoStore {
  itens: ItemCarrinho[];
  adicionar: (produto: Produto) => void;
  remover: (id: string) => void;
  atualizar: (id: string, quantidade: number) => void;
  limpar: () => void;
  totalItens: () => number;
  subtotal: () => number;
}
```

### Persistência

**Persistido em `sessionStorage`** via Zustand `persist` middleware.

- `name: 'carrinho'` → chave no sessionStorage
- Persiste durante navegação na mesma aba
- Limpa ao fechar o browser ou a aba
- Não persiste entre dispositivos ou sessões diferentes

### Computed Values (Funções)

`totalItens()` e `subtotal()` são funções (não valores derivados reativos). Uso em componentes:

```typescript
// ✅ Correto — selector retorna número, Zustand compara por valor
const totalItens = useCarrinhoStore((s) => s.totalItens());

// ✅ Alternativo para cálculo direto
const itens = useCarrinhoStore((s) => s.itens);
const total = itens.reduce((acc, i) => acc + i.quantidade, 0);
```

### Lógica de `adicionar`

```typescript
// Se produto já no carrinho → incrementa quantidade
// Se produto novo → cria ItemCarrinho com autorId e autorNome do produto.autor
```

`autorId` é crítico para o checkout (agrupamento por vendedor).

### Lógica de `atualizar`

```typescript
// quantidade <= 0 → remove o item automaticamente
```

### Lógica do Checkout

```typescript
// CarrinhoPage agrupa itens por vendedor:
const porVendedor = new Map<string, typeof itens>();
for (const item of itens) {
  const arr = porVendedor.get(item.autorId) ?? [];
  arr.push(item);
  porVendedor.set(item.autorId, arr);
}

// Um pedido por vendedor:
await Promise.all(
  Array.from(porVendedor.entries()).map(([vendedorId, items]) =>
    criarPedido({ clienteId, vendedorId, enderecoEntregaId, dataEntrega, itens }, token)
  )
);
```

---

## Estado de URL (Filtros e Paginação)

### Bazar (`/bazar`)

```typescript
// Estado sincronizado com URL
const [busca, setBusca] = useState(searchParams.get('nome') ?? '');
const [categoriaId, setCategoriaId] = useState(searchParams.get('categoriaId') ?? '');
const [page, setPage] = useState(Number(searchParams.get('page') ?? 0));

// Sync de volta para URL ao mudar
router.replace(`/bazar?${sp}`, { scroll: false });
```

### Pedidos (`/pedidos`)

```typescript
const [estado, setEstado] = useState<'compras' | 'vendas'>(
  searchParams.get('estado') as 'compras' | 'vendas' ?? 'compras'
);
const [page, setPage] = useState(Number(searchParams.get('page') ?? 0));
```

**Vantagem:** usuário pode compartilhar URL com filtros ativos, voltar navegador mantém estado.

---

## TanStack Query

**Configuração global** (`src/providers.tsx`):
```typescript
new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
})
```

**Status atual:** estrutura configurada mas não utilizada ativamente — as páginas fazem fetch manual com `useState + useEffect`.

**Migração recomendada (roadmap):** substituir os patterns de fetch manual por `useQuery` para cache automático, deduplicação e loading/error states padronizados.

```typescript
// Exemplo de como migrar uma página:
const { data: produtos, isLoading } = useQuery({
  queryKey: ['produtos', page, categoriaId, nome],
  queryFn: () => getProdutos({ page, categoriaId, nome }),
});
```

---

## Padrões a Evitar

```typescript
// ❌ Não usar localStorage para token
localStorage.setItem('token', token);

// ❌ Não derivar estado do store em todo render
const total = useCarrinhoStore((s) => s.itens).reduce(...); // recalcula sempre

// ❌ Não chamar clearAuth() sem chamar DELETE /api/auth
useAuthStore.clearAuth(); // cookie ainda existe! usar useAuth().logout()

// ❌ Não acessar store fora de componentes React sem getState()
// (dentro de event handlers diretos, use getState se necessário)
useCarrinhoStore.getState().adicionar(produto); // fora de componente
```
