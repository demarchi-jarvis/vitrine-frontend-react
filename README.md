# Vitrine Artesão — Frontend React

Frontend moderno da plataforma **Vitrine Virtual** — marketplace de artesãos do Vale do Café (incubadora Vassouras Tec / UniVassouras).

Migração completa do Angular 17 para **Next.js 15 + React 19**, com design system próprio, SSR seletivo, autenticação via middleware e DX de alto nível.

---

## Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSR/SSG seletivo, middleware auth, file-based routing |
| UI | **React 19** | Server Components, Actions, use() hook |
| Estilo | **Tailwind CSS v4** | Performance, design tokens nativos |
| Componentes | **shadcn/ui** | Acessível, customizável, sem lock-in |
| Forms | **React Hook Form + Zod** | Validação tipada, performance |
| Estado global | **Zustand v5** | Leve, sem boilerplate |
| Data fetching | **TanStack Query v5** | Cache, refetch, optimistic updates |
| Ícones | **Lucide React** | Tree-shakeable, consistente |
| Animações | **Framer Motion** | Animações declarativas fluidas |
| Tipagem | **TypeScript 5** | End-to-end type safety |

---

## Documentação de arquitetura

| Arquivo | Conteúdo |
|---|---|
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | Decisões tecnológicas com justificativa |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Estrutura de pastas, App Router, rendering strategy |
| [docs/ROUTES.md](docs/ROUTES.md) | Mapeamento Angular → Next.js de todas as rotas |
| [docs/AUTH.md](docs/AUTH.md) | JWT + Middleware + Zustand auth flow |
| [docs/API.md](docs/API.md) | Contratos de API com tipos TypeScript completos |
| [docs/PAGES.md](docs/PAGES.md) | Guia de implementação página por página |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | Biblioteca de componentes planejada |
| [docs/STATE.md](docs/STATE.md) | Arquitetura de estado global e local |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens de design, paleta, tipografia |

---

## Backend

API REST em Spring Boot 3.4.1 rodando em `http://localhost:8081`.  
Repositório: [demarchi-jarvis/vitrine-artesao](https://github.com/demarchi-jarvis/vitrine-artesao)

---

## Projeto

Incubadora **Vassouras Tec** — Vale do Café, RJ.  
Desenvolvido por Antonio Demarchi.
