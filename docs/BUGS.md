# Bugs & Problemas — Angular → React (v2)

> Levantamento completo feito por análise do `vitrine-frontend-angular`.  
> Todos esses problemas devem ser **corrigidos por padrão** durante a construção do React — não como patch posterior.

---

## Bugs Críticos (Segurança / Funcionalidade Quebrada)

### BUG-01 — Token JWT em `localStorage` (XSS)
**Arquivo Angular:** `auth.service.ts`  
**Código problemático:**
```typescript
saveTokenLocalStorage(token: any): void {
  localStorage.setItem(this.AUTH_TOKEN_KEY, token);
}
```
**Problema:** `localStorage` é acessível por qualquer script na página. Um ataque XSS consegue roubar o token.  
**Correção React:** Token salvo em **cookie httpOnly** via Route Handler `app/api/auth/route.ts`. O middleware Next.js lê o cookie server-side, nunca expõe ao JS do browser.

---

### BUG-02 — `clienteId` vazio no pedido
**Arquivo Angular:** `carrinho-compras.component.ts`  
**Código problemático:**
```typescript
const pedidoRequest: PedidoRequest = {
  clienteId: "",   // ← VAZIO
  vendedorId: "38845fd3-0b7b-4776-a7a6-2d1a15297551", // ← HARDCODED
  ...
};
```
**Problema:** O pedido é criado sem identificar o comprador. O backend recebe `clienteId: ""` — comportamento imprevisível.  
**Correção React:** Ler `usuario.id` do `useAuthStore()` populado no login. Nunca deixar campo de ID como string vazia.

---

### BUG-03 — `vendedorId` hardcoded como UUID fixo
**Arquivo Angular:** `carrinho-compras.component.ts` (linha do pedidoRequest)  
**Problema:** Todas as compras são atribuídas ao mesmo vendedor fixo, independente de quem cadastrou o produto.  
**Correção React:** Extrair `produto.autor.id` de cada item do carrinho. Se o carrinho tem múltiplos vendedores, criar um pedido por vendedor **ou** usar o vendedor do primeiro item (dependendo da regra de negócio do backend).

---

### BUG-04 — `enderecoEntregaId` vazio no pedido
**Arquivo Angular:** `carrinho-compras.component.ts`  
**Código problemático:**
```typescript
enderecoEntregaId: "",   // ← VAZIO
```
**Problema:** O pedido é criado sem endereço de entrega. O backend pode falhar silenciosamente ou usar um endereço padrão incorreto.  
**Correção React:** Antes de finalizar a compra, verificar se o usuário tem endereço cadastrado (`GET /api/endereco/usuario`). Se não tiver, redirecionar para `/perfil` com mensagem. Se tiver, usar `endereco.id`.

---

### BUG-05 — `usuario.id` vazio ao cadastrar endereço
**Arquivo Angular:** `perfil.component.ts`  
**Código problemático:**
```typescript
const enderecoPayload: EnderecoPayload = {
  ...
  usuario: { id: '' }  // ← VAZIO
};
```
**Problema:** Endereço cadastrado sem associar ao usuário. O backend provavelmente ignora ou falha.  
**Correção React:** O backend extrai o usuário do JWT — o campo `usuario.id` no payload não é necessário se o backend já usa o token. Verificar e remover o campo ou preencher corretamente.

---

## Bugs de Navegação / UX

### BUG-06 — Redirect para rota inexistente `/login`
**Arquivos Angular:** `detalhes-produto.component.ts`, `perfil.component.ts`  
**Código problemático:**
```typescript
this.router.navigate(['/login']);  // ← rota não existe
```
**A rota correta é** `/entrar`.  
**Correção React:** Centralizar rotas em constante `ROUTES` e usar sempre `router.push(ROUTES.entrar)`.

```typescript
// lib/routes.ts
export const ROUTES = {
  home: '/',
  entrar: '/entrar',
  registrar: '/registrar',
  bazar: '/bazar',
  painel: '/painel',
  perfil: '/perfil',
  carrinho: '/carrinho',
  pedidos: '/pedidos',
  detalhes: (id: string) => `/detalhes-produto/${id}`,
  editarProduto: (id: string) => `/editar-produto/${id}`,
  loja: (email: string) => `/loja?loja=${email}`,
  perfilUsuario: (email: string) => `/perfil-usuario?email=${email}`,
  cadastrarProduto: '/cadastrar-produto',
  gerenciarVendas: '/gerenciar-vendas',
} as const;
```

---

### BUG-07 — Carrinho misto: `localStorage` + `sessionStorage`
**Arquivo Angular:** `carrinho-service.service.ts`  
**Código problemático:**
```typescript
// Salva em sessionStorage:
private salvarCarrinho(): void {
  sessionStorage.setItem('carrinho', JSON.stringify(...));
}

// Limpa em localStorage:
limparCarrinho(): void {
  localStorage.setItem('carrinho', JSON.stringify([]));  // ← storage errado!
}
```
**Problema:** `limparCarrinho()` limpa o `localStorage` mas o carrinho real está no `sessionStorage`. Após finalizar uma compra o carrinho não é limpo.  
**Correção React:** Zustand com `persist` em `sessionStorage` de forma uniforme. `limpar()` atualiza apenas o Zustand store — o middleware de persistência cuida do storage.

---

## Bugs de Lógica / Qualidade

### BUG-08 — Formulário de endereço envia campos desabilitados como `null`
**Arquivo Angular:** `perfil.component.ts`  
**Código:** usa `getRawValue()` para pegar valor de campos disabled (correto), mas o campo `isSemNumero` é enviado ao backend junto com o payload.  
**Correção React:** Remover `isSemNumero` do payload antes de enviar. Usar `z.omit()` ou transformar com Zod.

---

### BUG-09 — `adicionarAoCarrinho` duplica por nome, não por ID
**Arquivo Angular:** `carrinho-service.service.ts`  
**Código problemático:**
```typescript
const itemExistente = carrinhoAtual.find(item => item.nome === produto.nome);
```
**Problema:** Se dois produtos diferentes tiverem o mesmo nome, são tratados como um. Deveria comparar por `id`.  
**Correção React:** Comparar sempre por `produto.id`.

---

### BUG-10 — `window.location.href` ao adicionar ao carrinho (reload completo)
**Arquivo Angular:** `detalhes-produto.component.ts`  
**Código problemático:**
```typescript
adicionarAoCarrinho(produto: Produto): void {
  this.carrinhoService.adicionarAoCarrinho(produto);
  window.location.href = `/carrinho`;  // ← reload completo da página
}
```
**Problema:** Perde o estado da aplicação e é lento.  
**Correção React:** `router.push(ROUTES.carrinho)` com `useRouter()` do Next.js.

---

### BUG-11 — Painel usa `window.location.href` para redirects
**Arquivo Angular:** `pedidos.component.ts`  
**Código problemático:**
```typescript
redirecionarParaPerfil(email: string): void {
  window.location.href = `/perfil-usuario?email=${email}`;
}
```
**Correção React:** `router.push(ROUTES.perfilUsuario(email))`.

---

### BUG-12 — Token passado como parâmetro de função em vez de header centralizado
**Arquivo Angular:** `produto.service.ts`  
**Código problemático:**
```typescript
getProdutoById(id: string, token: string): Observable<any> {
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  ...
}
```
**Problema:** O token é passado manualmente de componente para componente — acoplamento desnecessário.  
**Correção React:** Interceptor centralizado que lê o cookie/store e injeta o header automaticamente em todas as requisições autenticadas.

```typescript
// lib/api/client.ts
export function authFetch(path: string, options?: RequestInit) {
  const token = getCookieClient('authToken');
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
}
```

---

### BUG-13 — Reload de página para "salvar perfil"
**Arquivo Angular:** `perfil.component.ts`  
**Código problemático:**
```typescript
next: (usuarioAtualizado) => {
  ...
  window.location.reload();  // ← reload completo
}
```
**Correção React:** Invalidar a query `['usuario', 'logado']` com `queryClient.invalidateQueries()` — TanStack Query refaz o fetch e atualiza a UI sem reload.

---

### BUG-14 — `console.log` e `alert()` em código de produção
**Arquivos Angular:** múltiplos componentes  
Exemplos:
```typescript
alert(this.carrinho);           // carrinho-compras.component.ts
console.log('Token:', token);   // múltiplos lugares
```
**Correção React:** Remover todos os `console.log` de produção. Usar `sonner` (toast) para feedback ao usuário.

---

### BUG-15 — Busca de categorias feita diretamente no componente (sem cache)
**Arquivo Angular:** `cadastrar-produto.component.ts`, `editar-produto.component.ts`  
**Problema:** Cada vez que o componente é montado, faz uma nova requisição para `/api/categorias`.  
**Correção React:** TanStack Query com `staleTime: Infinity` para categorias (dados raramente mudam).

---

## Melhorias de Funcionalidade (não eram bugs, mas precisam existir na v2)

| # | Feature | Motivo |
|---|---|---|
| M-01 | SEO com `generateMetadata` em produto e bazar | O Angular era SPA sem metadata dinâmica |
| M-02 | Loading skeletons por página | Angular não tinha |
| M-03 | Toast de feedback em todas ações (Sonner) | Angular usava `alert()` e mensagens inline simples |
| M-04 | Confirmação antes de deletar produto | Angular não tinha dialog de confirmação |
| M-05 | Filtro por categoria na URL (`/bazar?categoria=artesanato`) | Deep link e compartilhamento |
| M-06 | Badge com contagem no ícone do carrinho no header | Angular não exibia contagem |
| M-07 | Página 404 customizada | Angular não tinha |
| M-08 | Error boundary global | Angular não tinha |
| M-09 | Otimização de imagem com `next/image` | Angular usava `<img>` comum |
| M-10 | Redirect automático de `/login` e `/inicio` para as rotas corretas | Aliases do Angular nunca limpos |

---

## Resumo por Criticidade

| Prioridade | Bugs |
|---|---|
| 🔴 Crítico (segurança/quebrado) | BUG-01, BUG-02, BUG-03, BUG-04 |
| 🟠 Alto (funcionalidade incorreta) | BUG-05, BUG-07, BUG-09, BUG-13 |
| 🟡 Médio (UX/qualidade) | BUG-06, BUG-08, BUG-10, BUG-11, BUG-12 |
| 🟢 Baixo (código sujo) | BUG-14, BUG-15 |
