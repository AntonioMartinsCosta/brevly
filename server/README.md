# Brev.ly — Server

API REST para encurtamento de URLs construída com **Fastify**, **Drizzle ORM**, **PostgreSQL** e **Cloudflare R2**.

## Stack

- **Node.js 22+** + **TypeScript**
- **Fastify 5** com `fastify-type-provider-zod` para validação tipada
- **Drizzle ORM** + driver `postgres-js`
- **PostgreSQL 16**
- **Cloudflare R2** (compatível com S3) via `@aws-sdk/client-s3`
- **Swagger UI** em `/docs`

## Setup

```bash
# 1. Copie o env de exemplo
cp .env.example .env

# 2. Suba o Postgres
docker compose up -d

# 3. Instale dependências
npm install

# 4. Gere e rode as migrations
npm run db:generate   # gera os SQLs (já estão versionados em ./drizzle)
npm run db:migrate    # aplica no banco

# 5. Suba o servidor em modo dev
npm run dev
```

Servidor em `http://localhost:3333` · Docs em `http://localhost:3333/docs`.

## Endpoints

| Método  | Rota                          | Descrição                                        |
| ------- | ----------------------------- | ------------------------------------------------ |
| `POST`  | `/links`                      | Cria um novo link                                |
| `GET`   | `/links`                      | Lista links (paginado: `?page=1&pageSize=20`)    |
| `GET`   | `/links/:shortUrl`            | Obtém um link pelo `shortUrl`                    |
| `PATCH` | `/links/:shortUrl/access`     | Incrementa o contador de acessos                 |
| `DELETE`| `/links/:shortUrl`            | Remove o link                                    |
| `POST`  | `/links/exports`              | Gera CSV, faz upload no R2 e retorna a URL       |

## Decisões de design

- **Identificador para mutações:** usamos `shortUrl` (mesmo no delete e no increment) para manter consistência com o front-end e ficar mais RESTful.
- **Validação de `shortUrl`:** regex `^[a-zA-Z0-9_-]+$` (apenas alfanuméricos, `_` e `-`).
- **Listagem performática:** índices em `short_url` e `created_at`; `count` e `select` rodam em paralelo.
- **CSV:** geração por streaming (paginado de mil em mil) e upload via `@aws-sdk/lib-storage` `Upload` (multipart). Nome do arquivo gerado com `crypto.randomUUID()`.
- **CORS:** habilitado para qualquer origem (ajuste para produção se necessário).
- **Dockerfile:** multi-stage, imagem final mínima, usuário não-root.

## Build de produção

```bash
npm run build
npm start
```

Ou via Docker:

```bash
docker build -t brevly-server .
docker run --env-file .env -p 3333:3333 brevly-server
```
