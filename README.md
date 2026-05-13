# Brev.ly

Aplicação fullstack para encurtamento de URLs — desafio Rocketseat.

## Estrutura
.
├── server/   # API Fastify + Drizzle + Postgres + Cloudflare R2
└── web/      # SPA React + Vite + Tailwind

## Quickstart

```bash
# 1. Back-end
cd server
cp .env.example .env
docker compose up -d        # sobe o Postgres
npm install
npm run db:generate
npm run db:migrate
npm run dev                 # http://localhost:3333

# 2. Front-end (em outro terminal)
cd web
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

## Configuração de Variáveis de Ambiente (.env)

### ⚠️ Segurança

**Nunca commite o arquivo `.env`** — ele contém credenciais privadas. O arquivo está automaticamente ignorado via `.gitignore`.

Use o **`.env.example`** como template. Cada pasta (`server/` e `web/`) tem seu próprio `.env.example`.

### Back-end (`server/.env`)

**Obrigatórias para rodar:**
PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/brevly"

- `PORT` — porta do servidor (padrão: 3333)
- `DATABASE_URL` — connection string do Postgres (se usou o docker-compose padrão, deixe assim)

**Obrigatórias para exportar CSV (Cloudflare R2):**
CLOUDFLARE_ACCOUNT_ID="seu_account_id"
CLOUDFLARE_ACCESS_KEY_ID="sua_access_key"
CLOUDFLARE_SECRET_ACCESS_KEY="sua_secret_key"
CLOUDFLARE_BUCKET="seu_bucket_name"
CLOUDFLARE_PUBLIC_URL="https://pub-xxxxx.r2.dev"

### Front-end (`web/.env`)
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3333
- `VITE_FRONTEND_URL` — URL da sua aplicação (para links públicos)
- `VITE_BACKEND_URL` — URL do servidor Fastify

Se hospedou em produção, ajuste essas URLs para os domínios reais.

## Funcionalidades

### Back-end

- [x] Criar link (com validação de short URL malformada e short URL já existente)
- [x] Deletar link
- [x] Obter URL original a partir do shortUrl
- [x] Listar todas as URLs (paginado, performático)
- [x] Incrementar contador de acessos
- [x] Exportar links em CSV via streaming
- [x] Upload do CSV no Cloudflare R2 com nome aleatório (UUID)
- [x] Acesso ao CSV pela CDN pública configurada
- [x] CSV contém `original_url`, `short_url`, `access_count`, `created_at`
- [x] PostgreSQL como banco de dados
- [x] CORS habilitado
- [x] Dockerfile multi-stage com boas práticas
- [x] Script `npm run db:migrate`
- [x] `.env.example` documentando todas as variáveis

### Front-end

- [x] Criar link com validação no client (mesmo regex do back)
- [x] Erro inline quando shortUrl já existe (409 do back vira erro de campo)
- [x] Deletar link com confirmação em duas etapas
- [x] Listar todos os links cadastrados
- [x] Página de redirecionamento `/:shortUrl` (incrementa acesso → redireciona)
- [x] Página 404 para shortUrls inexistentes ou rotas inválidas
- [x] Botão "Baixar CSV"
- [x] SPA com Vite (sem framework SSR)
- [x] Empty state, loading states, bloqueio de ações
- [x] Responsivo (mobile-first → desktop a partir de 768px)

## Stack

| Camada     | Principais tecnologias                                                |
| ---------- | --------------------------------------------------------------------- |
| Back-end   | TypeScript, Fastify 5, Drizzle ORM, PostgreSQL 16, AWS SDK v3 (R2)    |
| Front-end  | TypeScript, React 18, Vite 5, TailwindCSS 3, TanStack Query, RHF, Zod |
| Infra      | Docker (multi-stage), docker-compose para Postgres                    |

Veja os READMEs individuais em `server/README.md` e `web/README.md` para detalhes.

## Decisão arquitetural — identificador para mutações

Todas as operações por link (`GET /links/:shortUrl`, `DELETE /links/:shortUrl`,
`PATCH /links/:shortUrl/access`) usam o **`shortUrl`** como identificador, em vez
do `id` UUID. Isso mantém consistência entre back e front (a SPA já tem o
shortUrl em mãos via URL params) e fica mais RESTful.
