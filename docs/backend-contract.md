# Contrato da API Backend — Vitrine do Artesanato

Documenta todos os endpoints do backend Spring Boot consumidos pelo frontend.

**Base URL:** `NEXT_PUBLIC_API_URL` (default: `http://localhost:8081/api`)

---

## Autenticação

Todos os endpoints autenticados exigem header:
```
Authorization: Bearer {JWT_TOKEN}
```

Token obtido via `/autenticacao/login` ou `/autenticacao/registrar`.

---

## Auth (`/autenticacao`)

### POST `/autenticacao/login`
Login com credenciais.

**Body:**
```json
{ "email": "string", "senha": "string" }
```

**Response 200:**
```json
{ "nome": "string", "token": "string" }
```

**Erros:** 401 (credenciais inválidas)

---

### POST `/autenticacao/registrar`
Criação de conta.

**Body:**
```json
{
  "nome": "string",
  "email": "string",
  "telefone": "string",
  "senha": "string"
}
```

**Response 200:**
```json
{ "nome": "string", "token": "string" }
```

---

## Usuários (`/usuarios`)

### GET `/usuarios/logado` 🔒
Retorna perfil do usuário autenticado.

**Response 200:**
```json
{
  "id": "string",
  "nome": "string",
  "email": "string",
  "cpf": "string | null",
  "telefone": "string | null",
  "foto": "string | null",
  "documento": "string",
  "pontos": "string",
  "loja": "boolean"
}
```

> O frontend normaliza este response em `normalizePerfil()`:
> - `nome` é separado em `nome` (primeiro) e `sobrenome` (resto)
> - `foto` tem fallback para Gravatar anônimo

---

### GET `/usuarios/dono?email={email}` 🔒
Retorna dados públicos de um artesão (dono de loja).

**Response 200:** `Usuario` object

---

### GET `/usuarios/perfis?page={n}&size={n}&nome={string}` 🔒
Lista paginada de usuários (para página de contatos).

**Response 200:** `PaginaResponse<Usuario>`

---

### PATCH `/usuarios/alterar` 🔒
Atualiza dados do perfil do usuário autenticado.

**Body:**
```json
{
  "nome": "string",
  "cpf": "string",
  "telefone": "string",
  "foto": "string (URL)"
}
```

**Response 200:** `Perfil` atualizado

---

### PATCH `/usuarios/loja/status` 🔒
Ativa ou desativa a loja do usuário.

**Body:**
```json
{ "status": true }
```

**Response 200:** `Perfil` atualizado com `loja: boolean`

---

## Produtos (`/produtos`)

### GET `/produtos?page={n}&size={n}&nome={string}`
Lista paginada de produtos (público, sem auth).

**Response 200:** `PaginaResponse<Produto>`

---

### GET `/produtos/filtro?page={n}&size={n}&nome={string}&categoriaId={id}`
Lista paginada com filtro por categoria (público).

**Response 200:** `PaginaResponse<Produto>`

---

### GET `/produtos/{id}` 🔒
Detalhes de um produto.

**Response 200:** `Produto` com `autor: Autor`

**Erros:** 404

---

### GET `/produtos/meus-produtos` 🔒
Produtos do usuário autenticado.

**Response 200:** `Produto[]`

---

### GET `/produtos/loja?email={email}` 🔒
Produtos de uma loja específica.

**Response 200:** `Produto[]`

---

### POST `/produtos` 🔒
Cria novo produto.

**Body:**
```json
{
  "nome": "string",
  "categoriaId": "string",
  "quantidade": "number",
  "preco": "number",
  "imagem": "string (URL)",
  "descricao": "string (opcional)"
}
```

**Response 200:** `Produto` criado

---

### PATCH `/produtos/{id}` 🔒
Atualiza produto existente (campos parciais).

**Body:** `Partial<ProdutoPayload>`

**Response 200:** `Produto` atualizado

---

### DELETE `/produtos/{id}` 🔒
Remove produto.

**Response 204** (sem body)

---

## Categorias (`/categorias`)

### GET `/categorias`
Lista todas as categorias (público ou autenticado).

**Response 200:**
```json
[
  { "id": "string", "nome": "string", "descricao": "string | null", "icone": "string" }
]
```

> O frontend filtra a categoria "Todos" do resultado.

---

### POST `/categorias` 🔒
Cria nova categoria (admin).

**Body:**
```json
{ "nome": "string", "icone": "string" }
```

---

## Endereço (`/endereco`)

### GET `/endereco/usuario` 🔒
Retorna o endereço de entrega do usuário.

**Response 200:** `EnderecoResponse`

**Erros:** 404 (sem endereço cadastrado)

---

### POST `/endereco` 🔒
Cadastra endereço de entrega.

**Body:**
```json
{
  "cep": "string",
  "rua": "string",
  "numero": "number",
  "bairro": "string",
  "cidade": "string",
  "estado": "string (UF, 2 chars)",
  "complemento": "string",
  "adicional": "string"
}
```

**Response 200:** `EnderecoResponse` (inclui `id`)

---

### PUT `/endereco` 🔒
Atualiza endereço existente.

**Body:** `EnderecoResponse` (inclui `id`)

**Response 200:** `EnderecoResponse` atualizado

---

## Pedidos (`/pedidos`)

### POST `/pedidos` 🔒
Cria um pedido.

> **Importante:** um pedido é por vendedor. Para carrinhos com múltiplos vendedores, o frontend cria múltiplos pedidos via `Promise.all()`.

**Body:**
```json
{
  "clienteId": "string",
  "vendedorId": "string",
  "enderecoEntregaId": "string",
  "dataEntrega": "string (ISO 8601)",
  "itens": [
    { "produtoId": "string", "quantidade": "number" }
  ]
}
```

**Response 200:**
```json
{ "id": "string", "dataCriacao": "string (ISO 8601)" }
```

---

## Itens de Pedido (`/item`)

### GET `/item/comprador?page={n}&size={n}` 🔒
Compras do usuário autenticado.

**Response 200:** `PaginaResponse<ItemPedido>`

---

### GET `/item/vendedor?page={n}&size={n}` 🔒
Vendas do usuário autenticado (artesão).

**Response 200:** `PaginaResponse<ItemPedido>`

---

## Tipos TypeScript

Todos os tipos estão em `src/types/index.ts`. Referência rápida:

```typescript
interface Produto {
  id: string; nome: string; descricao: string;
  categoria: Categoria; preco: number; quantidade: number;
  imagem: string; autor?: Autor; ehAutor?: boolean;
}

interface ItemPedido {
  id: string; quantidade: number;
  produto: ProdutoDetalhes; pedido: Pedido;
  vendedor: Usuario; comprador: Usuario;
}

interface PaginaResponse<T> {
  content: T[]; totalElements: number; totalPages: number;
  number: number; size: number; last: boolean; first: boolean;
}
```

---

## API Client — Como Funciona

```typescript
// src/lib/api/client.ts

// Uso em Client Components
clientFetch<T>(path: string, options?: { token?: string, method?, body?, headers? })

// Uso em Server Components / Route Handlers
serverFetch<T>(path: string, token: string, options?: RequestInit)
```

**Tratamento de erros:**
```typescript
throw new ApiError(res.status, body.message ?? res.statusText)
```

Capturar nos componentes:
```typescript
catch (e: unknown) {
  toast.error(e instanceof Error ? e.message : 'Erro inesperado');
}
```

---

## ViaCEP (serviço externo)

**URL:** `https://viacep.com.br/ws/{cep}/json/`

Usado em `src/lib/api/endereco.ts → buscarCep()`.

**Response:**
```json
{
  "cep": "27700-000",
  "logradouro": "Rua Exemplo",
  "complemento": "",
  "bairro": "Centro",
  "localidade": "Vassouras",
  "uf": "RJ",
  "erro": true  // presente apenas quando CEP inválido
}
```

Chamado via `useCep(rawCep)` com debounce de 500ms.
