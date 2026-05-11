# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1: deps — instala TODAS as dependências (incluindo dev)
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ============================================================
# Stage 2: builder — compila o TypeScript para JS
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Remove devDependencies para a imagem final
RUN npm prune --omit=dev

# ============================================================
# Stage 3: runner — imagem final, mínima e segura
# ============================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Cria usuário sem privilégios
RUN addgroup -g 1001 -S nodejs && adduser -S brevly -u 1001

# Copia somente o necessário
COPY --from=builder --chown=brevly:nodejs /app/dist ./dist
COPY --from=builder --chown=brevly:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=brevly:nodejs /app/package.json ./package.json
COPY --from=builder --chown=brevly:nodejs /app/drizzle ./drizzle

USER brevly

EXPOSE 3333

CMD ["node", "dist/server.js"]
