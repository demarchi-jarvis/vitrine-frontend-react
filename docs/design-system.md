# Design System — Vitrine do Artesanato

Sistema visual completo: paleta, tipografia, animações, CSS patterns e componentes base.

---

## Identidade Visual

**Conceito:** arte artesanal do Vale do Café — orgânico, quente, terroso, premium.

**Palavras-chave:** areia, madeira, terracota, ocre, fluidez, autenticidade.

---

## Paleta de Cores

### Definida em `tailwind.config.ts`

```
sand (areia — backgrounds claros)
────────────────────────────────
sand-50   #FAF7F2   ← body background, superfícies principais
sand-100  #F5EFE6   ← cards, inputs, sections alternadas
sand-200  #EDE0CC   ← borders, divisores, skeleton base
sand-300  #DFC9A9   ← borders hover, linhas
sand-400  #C9A87C   ← texto de suporte claro

wood (madeira — escuros e textos)
─────────────────────────────────
wood-50   #FDF8F3   ← hover backgrounds sutis
wood-100  #F5E9D9   ← hover/focus light
wood-200  #DFC9AD   ← borders escuros
wood-300  #C4956A   ← scroll thumb, detalhes
wood-400  #A87040   ← textos secundários, ícones
wood-500  #8B5E3C   ← textos de suporte
wood-700  #5C3317   ← textos principais secundários
wood-800  #3D200A   ← textos escuros
wood-900  #1C0A00   ← texto principal, footer bg

terracotta (terracota — primária, CTAs)
───────────────────────────────────────
terracotta-300  #F4B4A4   ← badges claros
terracotta-400  #EFA08D   ← estados hover suaves
terracotta-500  #E88A73   ← hover intermediário
terracotta-600  #E2725B   ← COR PRIMÁRIA — botões, links, highlights
terracotta-700  #CC5A43   ← hover do primário
terracotta-800  #A84733   ← pressed/active
terracotta-900  #7A2E1E   ← texto em fundo claro terracota

ocre (âmbar/dourado — acentos, pontos, status)
───────────────────────────────────────────────
ocre-300  #E4B96A   ← skeleton shimmer
ocre-400  #D4934A   ← badges de status amarelo
ocre-500  #CC7722   ← ícones de status
ocre-600  #B36A1C   ← texto de pontos do usuário
ocre-700  #8A4F12   ← hover do ocre
```

### Uso Semântico

| Contexto | Classe |
|---|---|
| Texto principal | `text-wood-900` |
| Texto secundário | `text-wood-500` |
| Texto de suporte / placeholder | `text-wood-400` |
| Fundo de página | `bg-sand-50` |
| Fundo de card / input | `bg-sand-100` |
| Border padrão | `border-sand-200` |
| Botão primário | `bg-terracotta-600 hover:bg-terracotta-700` |
| Link de destaque | `text-terracotta-600 hover:text-terracotta-700` |
| Badge de categoria | `bg-sand-50/90 text-wood-700` |
| Status pendente | `bg-ocre-300 text-wood-900` |
| Status enviado | `bg-terracotta-600 text-sand-50` |

---

## Tipografia

### Fontes (carregadas via `next/font/google`)

```typescript
// src/app/layout.tsx
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

| Uso | Classe Tailwind | Fonte |
|---|---|---|
| Headings / Títulos | `font-serif` | Playfair Display (serif) |
| Corpo / UI | `font-sans` | Inter (sans-serif) |

### Escala Tipográfica

```
Página principal H1:  font-serif text-4xl sm:text-5xl font-semibold
Seção H2:             font-serif text-3xl sm:text-4xl font-semibold
Card H3:              font-serif text-base sm:text-lg font-semibold
Preço:                font-semibold text-base (terracotta-600)
Corpo:                text-sm leading-relaxed text-wood-500
Label de form:        text-sm font-medium text-wood-800
Badge / Tag:          text-[10px] font-medium uppercase tracking-wide
Eyebrow (sup-título): text-xs font-medium uppercase tracking-widest text-terracotta-600
```

---

## Animações

### Framer Motion — Variants Padrão

```typescript
// Fade + slide up (entrada de componentes)
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Stagger de listas
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

// Menu/dropdown
const menuVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
};

// ProdutoCard individual
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
whileHover={{ y: -4 }}
```

### Ease Padrão

```css
/* globals.css */
.ease-organic {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

Usar `.ease-organic` ou `ease: [0.25, 0.46, 0.45, 0.94]` em todas as animações principais.

### Spring Animations (Framer Motion)

```typescript
// Botões / ícones interativos
transition={{ type: 'spring', stiffness: 400, damping: 20 }}

// Nav indicator (underline)
transition={{ type: 'spring', stiffness: 400, damping: 30 }}
```

### GSAP — Quando Usar

Reservado para efeitos de **scroll** e animações imperativas do HeroSection:
```typescript
gsap.registerPlugin(ScrollTrigger, useGSAP);
// Text reveal no hero, badge entrada
```

### Scroll Suave (Lenis)

Configurado globalmente em `LenisProvider` (dentro de `Providers`):
```typescript
new Lenis({ lerp: 0.1, wheelMultiplier: 1.1, smoothWheel: true })
```

**Não remover** — todas as animações de parallax dependem do scroll suave.

### Prefers-Reduced-Motion

`globals.css` contém media query que desativa todas as animações para usuários que preferem sem movimento:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## CSS Classes Utilitárias (`globals.css`)

### Glassmorphism

```css
.glass       → backdrop-blur-md bg-white/60 border border-white/40 shadow-lg
.glass-dark  → backdrop-blur-md bg-wood-900/60 border border-white/10 shadow-lg
```

Usar em: Header scrollado, dropdowns, tooltips, modal overlays.

### Skeleton Shimmer

```css
.skeleton → gradient animado (areia claro → areia médio → areia claro)
           background-size: 200% 100%; animation: shimmer 1.5s infinite;
```

### Cards

```css
.card-hover → transition-all duration-700 ease-organic hover:shadow-xl hover:-translate-y-1
.img-zoom   → transition-transform duration-700 ease-organic group-hover:scale-110
```

### Focus Ring (Acessibilidade)

```css
.focus-ring → focus:outline-none focus-visible:ring-2
              focus-visible:ring-terracotta-600 focus-visible:ring-offset-2
```

Aplicar em todos os elementos interativos (botões, links, inputs).

### Bento Grid

```css
.bento-featured → col-span-12 md:col-span-7 row-span-2
.bento-half     → col-span-12 md:col-span-5
.bento-third    → col-span-12 md:col-span-4
```

### Text Reveal (Hero)

```css
.text-reveal-wrapper → overflow: hidden; display: inline-block;
```

Envolve cada palavra no Hero para o efeito de reveal por baixo.

### Scrollbar

```css
/* Scrollbar visível customizada */
::-webkit-scrollbar → width: 6px
::-webkit-scrollbar-thumb → bg-wood-300 (hover: terracotta-600)

/* Scrollbar oculta */
.scrollbar-none → -ms-overflow-style: none; scrollbar-width: none;
```

---

## Componentes UI Base

### Button (`src/components/ui/Button.tsx`)

```typescript
<Button
  variant="primary"    // primary | secondary | outline | ghost | danger
  size="md"            // sm | md | lg
  loading={false}      // mostra spinner Loader2
  disabled={false}
>
  Texto
</Button>
```

**Variantes:**
- `primary`: `bg-terracotta-600 text-sand-50` — ação principal
- `secondary`: `bg-wood-900 text-sand-50` — ação secundária dark
- `outline`: `border-2 border-wood-900` — ação terciária
- `ghost`: `text-wood-700 hover:bg-sand-100` — ação suave
- `danger`: `bg-red-600 text-white` — ação destrutiva

Todos têm: `hover:scale-[1.02]`, `active:scale-[0.98]`, `disabled:opacity-50`, `focus-visible:ring-2`.

### Input (`src/components/ui/Input.tsx`)

```typescript
<Input
  label="Nome"
  error="Campo obrigatório"  // mensagem de erro (+ ícone AlertCircle)
  hint="Texto de ajuda"      // hint abaixo (não aparece se houver error)
  success={true}             // borda verde + ícone CheckCircle
  {...register('nome')}      // compatível com react-hook-form
/>
```

- Gera `id` automático a partir do `label`
- `aria-invalid` e `aria-describedby` para acessibilidade

### Skeleton (`src/components/ui/Skeleton.tsx`)

```typescript
// Grid de cards loading
<ProdutoCardSkeleton count={8} />
```

### Pagination (`src/components/ui/Pagination.tsx`)

```typescript
<Pagination
  currentPage={page}      // 0-indexed
  totalPages={totalPages}
  onPageChange={(p) => setPage(p)}
/>
```

Usa `usePagination` internamente para gerar array com `null` (ellipsis).

---

## Padrões Visuais Recorrentes

### Seção com eyebrow

```tsx
<p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-3">
  Label pequeno
</p>
<h2 className="font-serif text-wood-900 text-3xl font-semibold">Título</h2>
```

### Card de ação (painel)

```tsx
<Link href={href} className={`flex items-center gap-4 p-5 rounded-2xl border border-sand-200 transition-all duration-300 ${color}`}>
  <div className="p-3 rounded-xl bg-sand-200">
    <Icon className="w-5 h-5 text-wood-700" />
  </div>
  <div>
    <p className="font-medium text-sm text-wood-900">{title}</p>
    <p className="text-xs mt-0.5 text-wood-400">{subtitle}</p>
  </div>
</Link>
```

### Estado vazio

```tsx
<div className="text-center py-24">
  <p className="text-wood-400 text-lg">Mensagem vazia.</p>
</div>
```

### Loading spinner

```tsx
<Loader2 className="w-8 h-8 animate-spin text-terracotta-600" />
```

---

## Responsividade

Breakpoints Tailwind (padrão):
```
sm: 640px    → mobile landscape / tablet pequeno
md: 768px    → tablet
lg: 1024px   → desktop pequeno
xl: 1280px   → desktop
2xl: 1536px  → widescreen
```

Padrões usados:
```
max-w-7xl mx-auto px-4 sm:px-6    ← container padrão de página
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4   ← grid de produtos
hidden lg:flex    ← nav desktop
lg:hidden         ← menu mobile
```

---

## Como Adicionar uma Nova Cor

1. Adicionar em `tailwind.config.ts` na seção `theme.extend.colors`
2. Documentar neste arquivo
3. **Nunca usar hex diretamente no JSX** — sempre via classe Tailwind
