# Brev.ly — Web

SPA em React + Vite + TypeScript que consome a API do Brev.ly para gerenciar URLs encurtadas.

## Stack

- **React 18** + **TypeScript** + **Vite 5**
- **TailwindCSS 3** (mobile-first, tokens do design no `tailwind.config.js`)
- **React Router DOM v6** — 3 páginas (home, redirect, 404)
- **TanStack Query v5** — cache, refetch e atualização otimista
- **React Hook Form + Zod** — formulário tipado e validado
- **Phosphor Icons React** — iconografia
- **Sonner** — toasts
- **Axios** — cliente HTTP

## Setup

```bash
cp .env.example .env
# Ajuste VITE_BACKEND_URL para apontar pro servidor (default: http://localhost:3333)

npm install
npm run dev
```

Aplicação em `http://localhost:5173`.

## Páginas

| Rota               | Descrição                                                                    |
| ------------------ | ---------------------------------------------------------------------------- |
| `/`                | Formulário de cadastro + listagem dos links + botão de exportar CSV          |
| `/:shortUrl`       | Busca o link na API, incrementa o contador de acessos e redireciona          |
| `/url/not-found`   | URL canônica do 404 (tela de "Link não encontrado")                          |
| `*`                | Qualquer outra rota → 404                                                    |

## Decisões de UX

- **Empty state** com ícone e mensagem quando não há links cadastrados.
- **Loading state** com spinner durante o `fetch` inicial.
- **Otimismo no cache:** ao criar um link, ele já aparece na lista antes da invalidação.
- **Confirmação de delete em duas etapas:** primeiro clique fica vermelho, segundo confirma; auto-cancela após 3 segundos.
- **Bloqueio de ações:** o botão "Baixar CSV" fica desabilitado se não houver links ou enquanto a exportação estiver em andamento; ações de delete/copiar ficam desabilitadas durante operações pendentes.
- **Responsivo:** layout em coluna única no mobile; duas colunas (form 380px + lista flexível) no desktop a partir de `md` (768px).
- **Validação no front:** mesmo regex do back (`^[a-zA-Z0-9_-]+$`) — falha rápida sem ir ao servidor.

## Build

```bash
npm run build
npm run preview
```
