# Roadmap — Vitrine do Artesanato

Funcionalidades planejadas, melhorias técnicas e dívidas identificadas. Cada item tem prioridade e área de impacto para facilitar os próximos incrementos.

---

## Legenda de Prioridade

| Símbolo | Nível |
|---|---|
| 🔴 | Crítico — bloqueia ou degrada experiência principal |
| 🟡 | Alta — melhoria significativa esperada pelos usuários |
| 🟢 | Média — boa prática, qualidade, ou conveniência |
| ⚪ | Baixa / Futura — interessante mas não urgente |

---

## 1. Bugs Conhecidos / Limitações Técnicas

### 🔴 Página `/loja` exige auth para dados públicos
A página de vitrine do artesão chama `getDonoLoja` e `getProdutosLoja` com `token` do store. Se usuário não está logado, a página carrega vazia sem mensagem de erro.

**Solução:** criar endpoints públicos no backend ou exibir estado "faça login para ver" com CTA.

---

### 🔴 Checkout sem validação de estoque em tempo real
O carrinho persiste quantidade no `sessionStorage`, mas não valida se o estoque mudou antes de finalizar o pedido. Se produto esgotou entre o momento em que foi adicionado e o checkout, o pedido é criado com quantidade indisponível.

**Solução:** na página `/carrinho`, antes do `criarPedido`, fazer GET de cada produto para verificar `quantidade` atual.

---

### 🟡 Mensagens de erro da API não tipadas
`catch (e: unknown)` em todos os componentes usa `e instanceof Error ? e.message : 'Erro inesperado'`. Erros HTTP com status 4xx/5xx do backend chegam como `ApiError` mas o message pode ser genérico.

**Solução:** criar enum/mapa de mensagens amigáveis por status HTTP, centralizado em `src/lib/errors.ts`.

---

### 🟡 Ausência de loading state global
Navegações lentas entre páginas não têm indicador de progresso. Usuário pode clicar múltiplas vezes.

**Solução:** usar `useRouter` + `startTransition` + `NProgress` ou implementar barra de progresso com Framer Motion no layout root.

---

### 🟡 `/api/me` sem cache
O `AuthHydrator` chama `/api/me` a cada mount dos providers. Em SPAs com muito re-mounting (hot reload, strictMode), isso gera requests desnecessários.

**Solução:** adicionar `staleTime` ao fetch com TanStack Query, ou usar `useRef` para flag "já hidratou".

---

### 🟢 BazarContent: filtro de nome não limpa página
Ao digitar uma busca, `page` não é resetado para 0. Usuário pode ficar na página 3 e ver resultados vazios.

**Solução:** `setPage(0)` dentro do `useEffect` do debounce de busca.

---

### 🟢 ProdutoCard sem lazy loading de imagens
Cards de produto usam `<img>` ou `<Image>` sem `loading="lazy"` explícito. Em grids com 12+ produtos, isso impacta LCP.

**Solução:** garantir `loading="lazy"` em todos os `ProdutoCard` exceto os acima do fold.

---

## 2. Funcionalidades Novas

### 🔴 Sistema de avaliações de produto
Usuários que compraram um produto devem poder avaliar (estrelas 1-5 + texto). Exibir nota média na `ProdutoCard` e na página de detalhes.

**Arquivos a criar:** `src/components/produto/AvaliacaoForm.tsx`, `src/components/produto/AvaliacaoList.tsx`
**Backend needed:** `POST /avaliacoes`, `GET /avaliacoes/produto/{id}`

---

### 🔴 Notificações em tempo real (pedidos)
Artesãos precisam ser notificados quando recebem um novo pedido sem ter que recarregar a página.

**Opções:**
- WebSocket (Spring Boot suporta natively)
- Server-Sent Events (SSE) — mais simples para notificações unidirecionais
- Polling a cada 30s como MVP

**Arquivo a criar:** `src/hooks/useNotificacoes.ts`

---

### 🟡 Gerenciamento de status de pedido pelo artesão
Na página `/pedidos` (aba Vendas), artesão deve conseguir atualizar o status do pedido (CONFIRMADO → EM_PREPARO → ENVIADO → ENTREGUE).

**Arquivo a modificar:** `src/components/pedidos/PedidoCard.tsx` — adicionar dropdown de status quando `isVendedor`.
**Backend needed:** `PATCH /pedidos/{id}/status`

---

### 🟡 Upload de imagens para produtos
Atualmente `imagem` é uma URL manual. Artesão precisa fazer upload diretamente.

**Opções de storage:** Cloudflare R2 (barato, S3-compatible), AWS S3, Uploadcare (simples para MVP).

**Arquivo a criar:** `src/components/produto/ImageUpload.tsx`
**Variável de ambiente nova:** `NEXT_PUBLIC_UPLOAD_URL` ou config do serviço escolhido.

---

### 🟡 Busca semântica funcional
O `HeroSection` tem 4 modos (Técnica, Material, Região, Artesão) e envia `?nome={query}&modo={mode}` para o `/bazar`. Mas o BazarContent ignora o parâmetro `modo`.

**Solução:** passar `modo` para o backend como filtro adicional, ou implementar pré-processamento de query no frontend com mapeamentos (ex: "pintura a óleo" → categoriaId=ceramica).

---

### 🟡 Paginação infinita no Bazar
Substituir paginação numérica por scroll infinito na listagem de produtos para experiência mobile mais fluida.

**Solução:** `useInfiniteQuery` do TanStack Query + Intersection Observer.

**Arquivos a modificar:** `src/app/bazar/BazarContent.tsx`, `src/components/produto/ProdutoGrid.tsx`

---

### 🟢 Favoritos / Wishlist
Usuário pode salvar produtos favoritos para ver depois.

**Opção MVP (sem backend):** persistir ids no `localStorage`.
**Opção completa:** `POST /favoritos`, `GET /favoritos/meus`, `DELETE /favoritos/{id}`.

**Arquivo a criar:** `src/store/favoritos.store.ts`

---

### 🟢 Compartilhamento de produto
Botão "Compartilhar" na página de detalhes usando a Web Share API com fallback para copiar URL.

**Arquivo a modificar:** `src/app/detalhes-produto/[id]/page.tsx`

---

### 🟢 SEO dinâmico para `/loja` e `/perfil-usuario`
Essas páginas usam `searchParams` (client-side) para carregar dados, então `generateMetadata` não pode buscar dados reais. Migrar para params dinâmicos ou usar metadados estáticos genéricos com Open Graph customizado.

---

### ⚪ Chat entre comprador e artesão
Canal de mensagens diretas via WebSocket para negociar encomendas.

---

### ⚪ Mapa de artesãos
Visualização geográfica no `/quem-somos` ou `/contato` mostrando a concentração de artesãos no Vale do Café.

**Biblioteca sugerida:** Leaflet.js com React-Leaflet.

---

### ⚪ PWA / App-like experience
Configurar `next-pwa` para permitir instalação como app e uso parcial offline (cache de produtos visualizados).

---

## 3. Melhorias de Frontend / Design

### 🟡 Migração do sistema de cores para CSS Custom Properties
Atualmente as cores são definidas no `tailwind.config.ts` e usadas como `bg-terracotta-500`. Migrar para `--color-terracotta: 174 72 40;` no `:root` do CSS permitiria temas dinâmicos (ex: modo escuro).

**Arquivo a modificar:** `tailwind.config.ts`, `src/app/globals.css`

---

### 🟡 Dark Mode
Implementar toggle de tema usando CSS Custom Properties + `data-theme` no `<html>`.

**Dependência:** item anterior (CSS Custom Properties).

---

### 🟡 Animações de page transition
Transições suaves entre páginas com Framer Motion `AnimatePresence` no layout root.

**Arquivo a modificar:** `src/app/layout.tsx`, criar `src/components/layout/PageTransition.tsx`

---

### 🟡 Skeleton screens consistentes
Algumas páginas mostram spinner genérico, outras mostram skeleton customizado. Padronizar: toda página deve ter `loading.tsx` com skeleton que replica o layout real.

**Páginas sem loading.tsx adequado:** `/perfil`, `/pedidos`, `/contato`

---

### 🟢 Micro-interações em formulários
Campos com validação em tempo real (feedback visual imediato), não só ao submit.

**Padrão:** usar `watch` do React Hook Form + animação de `border-color` com Framer Motion.

---

### 🟢 Empty states ilustrados
Telas de "nenhum produto", "carrinho vazio", "nenhum pedido" têm apenas texto. Adicionar ilustrações SVG temáticas (artesanato).

---

### 🟢 Acessibilidade (a11y)
- Garantir `aria-label` em todos os botões com apenas ícones
- Adicionar `role="status"` em loaders
- Verificar contraste de cores (sand-100 sobre wood-800)
- Suporte a `prefers-reduced-motion` (já tem CSS, mas falta verificar Framer Motion)

---

### ⚪ Storybook para componentes UI
Documentação visual e testes de snapshot dos componentes `ui/` e principais componentes de domínio.

---

## 4. Melhorias de Arquitetura

### 🔴 Migrar fetch manual para TanStack Query
O projeto tem TanStack Query configurado mas não usado. Todas as páginas usam `useState + useEffect + fetch` manual, que não deduplica requests, não faz cache entre navegações e duplica lógica de loading/error.

**Impacto:** redução de re-fetches, UX mais rápida, código mais limpo.

**Prioridade de migração:**
1. `BazarContent` (mais critical, já paginated)
2. `ProdutoGrid` em `/perfil`
3. Páginas de pedidos
4. Demais páginas

**Padrão:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['produtos', page, categoriaId, nome],
  queryFn: () => getProdutos({ page, categoriaId, nome }),
});
```

---

### 🟡 Error Boundaries por feature
Atualmente há apenas um `error.tsx` global. Erros em componentes filhos da home (ex: `BentoGrid` falha) derrubam a página inteira.

**Solução:** adicionar `error.tsx` por pasta de feature principal (`/bazar/error.tsx`, etc.) e usar `<ErrorBoundary>` nos Suspense boundaries do lado do cliente.

---

### 🟡 Server Actions para mutações
Substituir chamadas `clientFetch` em formulários por Server Actions do Next.js 15. Elimina boilerplate de `token` nos formulários e move lógica sensível para o servidor.

**Candidatos:** `PerfilForm`, `EnderecoForm`, `ProdutoForm`

**Nota:** requer refatoração significativa; avaliar custo vs benefício.

---

### 🟢 Testes automatizados
O projeto não tem nenhuma suite de testes.

**Plano mínimo:**
- `vitest` + `@testing-library/react` para unit tests de hooks (`usePagination`, `useDebounce`, `useCep`)
- `playwright` para E2E dos fluxos críticos (login → adicionar produto → checkout)

**Arquivos a criar:** `vitest.config.ts`, `tests/` ou `__tests__/` por feature

---

### 🟢 Variáveis de ambiente validadas com Zod
Erros de configuração de `.env` só aparecem em runtime. Validar no startup com Zod.

**Arquivo a criar:** `src/lib/env.ts`
```typescript
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  // ...
});
export const env = envSchema.parse(process.env);
```

---

### 🟢 Rate limiting nas Route Handlers
As routes `/api/auth` e `/api/me` não têm rate limiting. Em produção, são expostas a brute force.

**Solução:** usar `upstash/ratelimit` (Redis) ou implementar rate limit simples com `Map` em memória (não persiste entre deploys, mas protege contra ataques básicos).

---

### ⚪ Monorepo com backend
Considerar migrar para Turborepo monorepo com `apps/frontend` e `apps/backend` se o desenvolvimento conjunto se intensificar.

---

## 5. Infraestrutura e DevOps

### 🟡 CI/CD Pipeline
Não há pipeline automatizado. Um `push` para `main` pode quebrar o build sem que ninguém perceba.

**Arquivo a criar:** `.github/workflows/ci.yml`
```yaml
jobs:
  validate:
    steps:
      - npm run type-check
      - npm run lint
      - npm run build
```

---

### 🟡 Preview Deploys automáticos (Vercel)
Cada PR deve gerar um preview deploy com URL única para revisão visual antes de merge.

**Solução:** conectar repositório ao Vercel e configurar variáveis de ambiente de staging.

---

### 🟢 Monitoramento de erros (Sentry)
Erros de runtime no browser não são capturados. Em produção, é impossível saber se alguma página está quebrando.

**Arquivo a criar:** `src/app/instrumentation.ts` (padrão Next.js para Sentry).

---

### 🟢 Análise de bundle
Verificar quais dependências estão inflando o bundle. GSAP e Framer Motion juntos são pesados.

**Comando:** `ANALYZE=true npm run build` com `@next/bundle-analyzer`.

**Ação esperada:** lazy-load GSAP (só usado no HeroSection) e verificar se Recharts pode ser importado parcialmente.

---

## 6. Dívidas Documentadas

| Item | Arquivo | Dívida |
|---|---|---|
| Token enviado como body | `src/lib/api/auth.ts` | Token enviado no body JSON; considerar header `Authorization` para consistência |
| `normalizePerfil()` sem test | `src/lib/api/usuario.ts` | Lógica de split de nome é frágil para nomes com prefixo (ex: "de", "da") |
| `useCarrinhoStore` totalItens como função | `src/store/carrinho.store.ts` | Funções no store não são reativas; migrar para computed com `subscribeWithSelector` |
| Recharts sem responsividade completa | `src/app/(protected)/gerenciar-vendas/page.tsx` | `width: 400` hardcoded em `BarChart`; usar `<ResponsiveContainer>` |
| `ProdutoForm` sem feedback de progresso de upload | `src/components/produto/ProdutoForm.tsx` | Quando backend demora, usuário não sabe se o submit funcionou |

---

## 7. Próximos Incrementos Recomendados (Ordem de Execução)

Considerando impacto + esforço, a sequência ideal para os próximos prompts:

1. **Migrar BazarContent para TanStack Query** — alto impacto técnico, base para os demais
2. **Fix: reset de página ao filtrar no Bazar** — 3 linhas, bug visível
3. **CI/CD Pipeline GitHub Actions** — segurança do processo de deploy
4. **Loading states consistentes** — QoL para todos os usuários
5. **Sistema de avaliações** — feature de maior valor percebido pelo comprador
6. **Status de pedido pelo artesão** — feature crítica para o vendedor
7. **Upload de imagens** — elimina fricção no cadastro de produtos
