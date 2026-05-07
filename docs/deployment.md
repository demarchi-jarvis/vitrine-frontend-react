# Deploy e Setup — Vitrine do Artesanato

Como rodar, configurar e fazer deploy do frontend.

---

## Requisitos

- Node.js 18+ (recomendado: 20 LTS)
- npm 9+
- Backend Spring Boot rodando (para funcionalidades que consomem API)

---

## Setup Local

```bash
# 1. Clonar
git clone https://github.com/demarchi-jarvis/vitrine-frontend-react.git
cd vitrine-frontend-react

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com seus valores

# 4. Rodar em desenvolvimento
npm run dev
# → http://localhost:3000
```

---

## Variáveis de Ambiente

| Variável | Obrigatório | Descrição | Exemplo |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ Sim | URL do backend Spring Boot | `http://localhost:8081/api` |
| `NEXT_PUBLIC_SITE_URL` | Recomendado | URL pública do site (OG tags) | `https://vitrineartesanato.com.br` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Recomendado | Número WhatsApp suporte | `5524999999999` |
| `NEXT_PUBLIC_GTM_ID` | Opcional | Google Tag Manager | `GTM-XXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Opcional | Meta Pixel ID | `123456789012345` |

**Atenção:** todas as variáveis `NEXT_PUBLIC_*` são expostas no bundle do browser. Não colocar secrets aqui.

---

## Scripts

```bash
npm run dev          # Desenvolvimento com Turbopack (hot reload rápido)
npm run build        # Build de produção
npm start            # Serve o build de produção (requer build antes)
npm run lint         # ESLint (next/core-web-vitals)
npm run type-check   # TypeScript sem emitir arquivos
```

### Validação Completa (antes de commitar)

```bash
npm run type-check && npm run lint && npm run build
```

---

## Build de Produção

```bash
npm run build
# → .next/  (output de build)

npm start
# → http://localhost:3000 (produção)
```

### Output de Rotas

O build gera:
- **○ Static** — rotas pré-renderizadas (SSG): `/`, `/bazar`, `/entrar`, `/registrar`, `/quem-somos`, `/loja`, `/perfil-usuario`, `/demandas`
- **ƒ Dynamic** — rotas server-rendered on demand: páginas protegidas, `/detalhes-produto/[id]`, `/api/*`

---

## Deploy em Produção

### Vercel (recomendado para Next.js)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel antes do primeiro deploy.

### VPS / Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name vitrineartesanato.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Assets Estáticos

Os assets esperados em `/public/assets/`:

```
public/
└── assets/
    ├── hero.webm               ← vídeo de background do Hero (autoplay)
    ├── hero-fallback.jpg       ← poster/fallback do vídeo
    ├── placeholder-produto.svg ← imagem quando produto sem foto
    └── og-home.jpg             ← Open Graph image da home
```

**Se `hero.webm` não existir:** o Hero usa apenas a imagem `poster` como background estático. O site funciona normalmente.

---

## Compatibilidade Windows

- `.gitattributes` garante LF em todos os arquivos (`* text=auto eol=lf`)
- Scripts npm são cross-platform (via Next.js CLI)
- Sem scripts bash nas npm scripts

---

## Variáveis de Ambiente para Produção

```env
NODE_ENV=production                              # setado automaticamente
NEXT_PUBLIC_API_URL=https://api.dominio.com.br/api
NEXT_PUBLIC_SITE_URL=https://vitrineartesanato.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5524999999999
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

---

## Troubleshooting

| Problema | Solução |
|---|---|
| `npm run dev` falha na porta 3000 | Usar `npm run dev -- --port 3001` |
| Build falha com erro TypeScript | `npm run type-check` para ver erros |
| Imagens externas não carregam | Adicionar domínio em `next.config.ts → images.remotePatterns` |
| Cookie não funciona em produção | Verificar `NEXT_PUBLIC_SITE_URL` + `secure: true` no cookie |
| CORS do backend | Configurar `origins` no Spring Boot para aceitar o domínio do frontend |
