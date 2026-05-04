# Types — vitrine-artesao

Todas as interfaces TypeScript extraídas do Angular e refinadas para o React.
Definidas centralmente em `src/types/index.ts`.

---

## Auth

```typescript
// POST /api/autenticacao/login → AuthResponse
export interface AuthResponse {
  nome: string
  token: string
}

// POST /api/autenticacao/registrar (body)
export interface RegistrarPayload {
  nome: string
  email: string
  telefone: string
  senha: string
}
```

---

## Produto

```typescript
export interface Categoria {
  id: string
  nome: string
  descricao: string | null
  icone: string
}

export interface Autor {
  id: string
  nome: string
  email: string
  cpf: string
  cnpj: string | null
  telefone: string
  foto: string
  pontos: number
  loja: boolean
  // nota: campo 'senha' no Angular — NÃO expor no React
}

export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  quantidade: number
  imagem: string
  categoria: Categoria
  autor: Autor
  ehAutor: boolean          // true se o usuário logado é o autor
  data_criacao?: string
}

// Paginação genérica (Spring Page)
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  size: number
  number: number            // página atual (0-indexed)
}

// Payload criação/edição de produto
export interface ProdutoPayload {
  nome: string
  categoriaId: string
  quantidade: number
  preco: number
  imagem: string
}
```

---

## Usuário / Perfil

```typescript
export interface Perfil {
  id: string
  nome: string
  sobrenome: string         // derivado do nome completo no Angular (split por espaço)
  email: string
  cpf: string
  telefone: string
  foto: string
  documento: string | null
  pontos: number
  loja: boolean             // true = perfil artesão ativo
}

// PATCH /api/usuarios/alterar (body)
export interface UsuarioUpdate {
  nome: string              // nome completo (Angular juntava nome + sobrenome)
  cpf: string
  telefone: string
  foto: string
}

// No React: separar nome/sobrenome no formulário, juntar no submit
// Angular fazia: `nome: dadosAtualizados.nome + ' ' + dadosAtualizados.sobrenome`

export interface Usuario {
  id: string
  nome: string
  email: string
  foto: string | null
  cpf: string | null
  cnpj: string | null
  telefone: string | null
  pontos: number | null
}
```

---

## Endereço

```typescript
export interface EnderecoPayload {
  cidade: string
  estado: string
  cep: string
  rua: string
  numero: number | null     // null quando "sem número"
  adicional: string
  bairro: string
  complemento: string
  // nota: Angular enviava `usuario: { id: '' }` — no React o backend infere do JWT
}

export interface EnderecoResponse extends EnderecoPayload {
  id: string
}

// ViaCEP
export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  ddd: string
  erro?: boolean            // 'true' (string) quando CEP não encontrado
}
```

---

## Pedido

```typescript
export interface Endereco {
  id: string
  rua: string
  numero: number
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  adicional?: string
}

export interface ProdutoDetalhes {
  id: string
  nome: string
  preco: number
  descricao: string | null
  imagem: string | null
}

export interface Pedido {
  id: string
  cliente: Usuario
  vendedor: Usuario
  dataCriacao: string
  dataEntrega: string
  enderecoEntrega: Endereco
  remote: boolean
}

export interface ItemPedido {
  id: string
  quantidade: number
  produto: ProdutoDetalhes
  pedido: Pedido
  vendedor: Usuario
  comprador: Usuario
}

// PaginaResponse (igual ao Page<T> mas do endpoint /item/comprador e /item/vendedor)
export interface PaginaResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// POST /api/pedidos (body)
export interface ItemPedidoRequest {
  produtoId: string
  quantidade: number
}

export interface PedidoRequest {
  clienteId: string         // FIX Angular: estava hardcoded como ""
  vendedorId: string        // FIX Angular: estava hardcoded como UUID fixo
  remote?: boolean
  dataPedido?: string       // ISO 8601
  dataEntrega: string       // ISO 8601
  enderecoEntregaId: string // FIX Angular: estava hardcoded como ""
  itens: ItemPedidoRequest[]
}

// POST /api/pedidos → PedidoResponse
export interface PedidoResponse {
  id: string
  dataCriacao: string
}
```

---

## Carrinho (local — Zustand)

```typescript
export interface ItemCarrinho {
  id: string
  nome: string
  preco: number
  imagem: string
  categoria: Categoria
  autor: Autor              // necessário para extrair vendedorId no checkout
  quantidade: number
}
```

---

## Dashboard / Painel

```typescript
export interface PainelTab {
  name: string
  title: string
  subtitle: string
  buttons: { name: string; link: string }[]
}

export interface PainelCard {
  title: string
  subtitle: string
  icon: string
  isSpecial: boolean
  linkedTab: string
}
```

---

## Utilitários de tipo

```typescript
// Paginação — parâmetros padrão
export interface PaginaParams {
  page?: number   // default 0
  size?: number   // default 12
}

// Filtro do Bazar
export interface FiltroParams extends PaginaParams {
  categoriaId?: string
  nome?: string
}
```
