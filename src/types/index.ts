// ── Auth ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  nome: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegistrarPayload {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

// ── Usuário / Perfil ─────────────────────────────────────────────────────────
export interface Perfil {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
  foto: string;
  documento: string;
  pontos: string;
  loja: boolean;
}

export interface UsuarioUpdate {
  nome: string;
  cpf: string;
  telefone: string;
  foto: string;
}

export interface ToggleLojaPayload {
  status: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  foto: string | null;
  cpf: string | null;
  cnpj: string | null;
  telefone: string | null;
  pontos: number | null;
  loja?: boolean;
}

// ── Produto ──────────────────────────────────────────────────────────────────
export interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  icone: string;
}

export interface Autor {
  id: string;
  nome: string;
  email: string;
  foto: string;
  cpf: string;
  cnpj: string | null;
  telefone: string;
  pontos: number;
  loja: boolean;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  categoria: Categoria;
  preco: number;
  quantidade: number;
  imagem: string;
  autor?: Autor;
  ehAutor?: boolean;
  data_criacao?: string;
}

export interface ProdutoPayload {
  nome: string;
  categoriaId: string;
  quantidade: number;
  preco: number;
  imagem: string;
  descricao?: string;
}

// ── Paginação ────────────────────────────────────────────────────────────────
export interface PaginaResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
}

export interface ProdutoFilters {
  page?: number;
  size?: number;
  categoriaId?: string;
  nome?: string;
}

// ── Pedido / Carrinho ────────────────────────────────────────────────────────
export interface ItemCarrinho {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
  estoque: number;
  autorId: string;
  autorNome: string;
}

export interface ItemPedidoRequest {
  produtoId: string;
  quantidade: number;
}

export interface PedidoRequest {
  clienteId: string;
  vendedorId: string;
  remote?: boolean;
  dataPedido?: string;
  dataEntrega: string;
  enderecoEntregaId: string;
  itens: ItemPedidoRequest[];
}

export interface PedidoResponse {
  id: string;
  dataCriacao: string;
}

export interface ProdutoDetalhes {
  id: string;
  nome: string;
  preco: number;
  descricao: string | null;
  imagem: string | null;
}

export interface Endereco {
  id: string;
  rua: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  adicional?: string;
}

export interface Pedido {
  id: string;
  cliente: Usuario;
  vendedor: Usuario;
  dataCriacao: string;
  dataEntrega: string;
  enderecoEntrega: Endereco;
  remote: boolean;
}

export interface ItemPedido {
  id: string;
  quantidade: number;
  produto: ProdutoDetalhes;
  pedido: Pedido;
  vendedor: Usuario;
  comprador: Usuario;
}

// ── Endereço ─────────────────────────────────────────────────────────────────
export interface EnderecoPayload {
  cidade: string;
  estado: string;
  cep: string;
  rua: string;
  numero: number | null;
  adicional: string;
  bairro: string;
  complemento: string;
}

export interface EnderecoResponse extends EnderecoPayload {
  id: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

// ── Painel ───────────────────────────────────────────────────────────────────
export interface PainelButton {
  name: string;
  link: string;
}

export interface PainelContent {
  name: string;
  title: string;
  subtitle: string;
  buttons: PainelButton[];
}

export interface PainelActionCard {
  title: string;
  subtitle: string;
  icon: string;
  isSpecial: boolean;
  linkedTab: string;
}

// ── Gráfico ──────────────────────────────────────────────────────────────────
export interface VendasPorMes {
  mes: string;
  totalVendas: number;
}

// ── API Error ─────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
