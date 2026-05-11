import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),

  // Variáveis do Cloudflare R2 — opcionais. São validadas no momento em que
  // a rota de export-csv for executada (lib/r2-config.ts). Isso permite rodar
  // o resto do projeto (migrations, dev local, testes) sem precisar configurar R2.
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_BUCKET: z.string().optional(),
  CLOUDFLARE_PUBLIC_URL: z.string().url().optional().or(z.literal('')),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:', parsed.error.format())
  throw new Error('Variáveis de ambiente inválidas')
}

export const env = parsed.data
