# Tech Stack — vitrine-artesao

Decisões tecnológicas com justificativa baseada na migração do Angular 17 e nas necessidades do domínio de marketplace de artesãos.

---

## Framework: Next.js 16 / React 19 (App Router)

| Necessidade do domínio | Solução Next.js |
|---|---|
| Páginas públicas indexáveis (bazar, produtos) | SSR / ISR — HTML pré-renderizado |
| Middleware de autenticação JWT | `middleware.ts` Edge Runtime — sem JS no cliente |
| SEO por loja de artesão | `generateMetadata()` dinâmico por página |
| Otimização de imagens de produtos | `next/image` — WebP automático, lazy load |
| Fontes sem layout shift | `next/font` — zero CLS |
| Server Actions para mutations | `'use server'` + `revalidatePath` |

---

## React 19 — Recursos Ativamente Usados

```typescript
// use() — resolve Promise em Server Component
const produto = use(fetchProduto(id))

// Server Actions — sem API Route Handler para mutations simples
async function cadastrarProduto(formData: FormData) {
  'use server'
  await api.post('/produtos', Object.fromEntries(formData))
  revalidatePath('/bazar')
}

// useOptimistic — carrinho com feedback imediato
const [carrinho, addOptimistic] = useOptimistic(carrinhoItems, (state, item) => [...state, item])

// useFormStatus — disable automático do botão submit
const { pending } = useFormStatus()

// useTransition — loading states sem bloquear UI
const [isPending, startTransition] = useTransition()
```

---

## Tailwind CSS v4

| Angular (Tailwind v3) | React (Tailwind v4) |
|---|---|
| `tailwind.config.js` com `theme.extend` | CSS nativo `@theme {}` |
| `require('flowbite/plugin')` | shadcn/ui (zero plugin) |
| `theme.extend.colors` | `--color-primary: oklch(...)` |

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary:       oklch(40% 0.18 260);   /* azul-índigo da identidade visual */
  --color-primary-hover: oklch(32% 0.20 260);
  --color-secondary:     oklch(65% 0.15 210);
  --color-accent:        oklch(70% 0.18 85);    /* laranja artesanal */
  --font-sans:    'Inter', sans-serif;
  --font-display: 'Sora', sans-serif;
  --radius: 0.5rem;
}
```

---

## shadcn/ui

Substitui Flowbite (Angular). Componentes TypeScript no projeto, não em `node_modules`.

```bash
npx shadcn@latest init
npx shadcn@latest add button input card badge dialog sheet
npx shadcn@latest add skeleton avatar dropdown-menu tabs switch
npx shadcn@latest add form toast pagination carousel
```

Vantagens sobre Flowbite:
- Acessibilidade via Radix UI primitives
- Tree-shaking real (só o que usa)
- CSS variables — temas trocáveis sem rebuild
- TypeScript nativo

---

## React Hook Form + Zod

Substitui os Reactive Forms do Angular.

```typescript
// Equivalência de Validators do Angular → Zod
// Angular: Validators.required + Validators.email + Validators.minLength(5)
// React:
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(5, 'Mínimo 5 caracteres'),
})

// Angular: passwordMatchValidator (cross-field)
const registroSchema = z.object({
  nome:         z.string().min(2),
  email:        z.string().email(),
  telefone:     z.string().regex(/^\d{10,11}$/, '10 ou 11 dígitos'),
  senha:        z.string().min(6),
  repetirSenha: z.string(),
}).refine(d => d.senha === d.repetirSenha, {
  message: 'Senhas não coincidem',
  path: ['repetirSenha'],
})

// Uso no componente
const form = useForm<z.infer<typeof loginSchema>>({
  resolver: zodResolver(loginSchema),
})
```

Schemas completos definidos em `src/lib/schemas.ts`.

---

## Zustand v5

Substitui BehaviorSubject + Signals do Angular para estado global.

```typescript
// src/stores/carrinhoStore.ts
// FIX Angular: misturava localStorage (limpar) com sessionStorage (salvar)
// React: Zustand persist sessionStorage — consistente
export const useCarrinhoStore = create<CarrinhoStore>()(
  persist(
    (set, get) => ({
      itens: [] as ItemCarrinho[],
      adicionar: (produto, quantidade = 1) => set(s => {
        const existe = s.itens.find(i => i.id === produto.id)
        return {
          itens: existe
            ? s.itens.map(i => i.id === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i)
            : [...s.itens, { ...produto, quantidade }]
        }
      }),
      remover:  (id) => set(s => ({ itens: s.itens.filter(i => i.id !== id) })),
      limpar:   ()   => set({ itens: [] }),
      total:    ()   => get().itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0),
    }),
    { name: 'carrinho', storage: createJSONStorage(() => sessionStorage) }
  )
)
```

---

## TanStack Query v5

Substitui HttpClient + Observable + AsyncPipe do Angular.

```typescript
// Equivalência Angular → TanStack Query
// Angular: this.http.get<Page<Produto>>('/api/produtos', { params }).subscribe(...)
// React:
const { data, isLoading } = useQuery({
  queryKey: ['produtos', { categoriaId, page }],
  queryFn: () => api.produtos.filtrar({ categoriaId, page }),
  staleTime: 60_000,
})

// Angular: subscribe + tap para mutation
// React:
const { mutate } = useMutation({
  mutationFn: api.produtos.criar,
  onSuccess: () => {
    toast.success('Produto cadastrado!')
    queryClient.invalidateQueries({ queryKey: ['meus-produtos'] })
  },
})
```

---

## Framer Motion v11

Substitui Angular Animations (`trigger`, `state`, `animate`).

```typescript
// Angular trigger('expandCollapse') → Framer Motion AnimatePresence
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {isExpanded && (
    <motion.div
      key="detalhe"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <PedidoDetalhe item={item} />
    </motion.div>
  )}
</AnimatePresence>
```

---

## Recharts

Substitui ng-apexcharts (Angular) para gráfico de vendas por mês.

```tsx
// GerenciarVendas — BarChart responsivo
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={350}>
  <BarChart data={dadosGrafico}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="mes" />
    <YAxis tickFormatter={v => `R$ ${v}`} />
    <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
    <Bar dataKey="totalVendas" fill="var(--color-primary)" radius={[6,6,0,0]} />
  </BarChart>
</ResponsiveContainer>
```

---

## Lucide React

Substitui Font Awesome (Angular). Tree-shakeable, stroke-based, tipagem nativa.

```typescript
import { ShoppingCart, User, Store, Package, Search, ChevronLeft, ChevronRight } from 'lucide-react'
// vs Angular: <fa-icon [icon]="faSearch" />
```

---

## jwt-decode

Igual ao Angular — decodifica JWT para verificar expiração.

```typescript
// src/lib/auth.ts
import { jwtDecode } from 'jwt-decode'

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    return exp < Date.now() / 1000
  } catch {
    return true
  }
}

// Token armazenado em cookie (não localStorage)
export function getToken(): string | null {
  if (typeof document === 'undefined') return null
  return document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1] ?? null
}

export function setToken(token: string): void {
  const exp = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2h (igual JWT backend)
  document.cookie = `token=${token}; expires=${exp.toUTCString()}; path=/; SameSite=Strict`
}

export function removeToken(): void {
  document.cookie = 'token=; Max-Age=0; path=/'
}
```

---

## package.json — dependências finais

```json
{
  "name": "vitrine-artesao",
  "version": "1.0.0",
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0",
    "framer-motion": "^11.0.0",
    "recharts": "^2.0.0",
    "lucide-react": "^0.400.0",
    "jwt-decode": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-switch": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

---

## O que NÃO usamos (e por quê)

| Descartado | Motivo |
|---|---|
| Redux Toolkit | Overkill — Zustand + TanStack Query cobrem tudo |
| next-auth | JWT simples não precisa — complexidade desnecessária |
| Axios | `fetch` nativo + wrapper próprio é zero-dep |
| SWR | Já temos TanStack Query — não usar os dois |
| Emotion / styled-components | Tailwind v4 resolve |
| ApexCharts / ng-apexcharts | Recharts é React-first e mais leve |
| Flowbite | Substituído por shadcn/ui |
| Font Awesome | Substituído por Lucide React |
