import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { links } from '../db/schema.js'
import { ConflictError } from '../lib/errors.js'

// Regex: apenas letras, números, hífen e underline. Sem espaços e sem barras.
const SHORT_URL_REGEX = /^[a-zA-Z0-9_-]+$/

const createLinkBody = z.object({
  originalUrl: z
    .string({ required_error: 'URL original é obrigatória' })
    .url('URL original inválida'),
  shortUrl: z
    .string({ required_error: 'URL encurtada é obrigatória' })
    .min(1, 'URL encurtada não pode ser vazia')
    .max(64, 'URL encurtada muito longa')
    .regex(SHORT_URL_REGEX, 'URL encurtada mal formatada (apenas letras, números, _ e -)'),
})

export const createLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/links',
    {
      schema: {
        tags: ['links'],
        summary: 'Criar um novo link encurtado',
        body: createLinkBody,
        response: {
          201: z.object({
            id: z.string().uuid(),
            originalUrl: z.string().url(),
            shortUrl: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const existing = await db
        .select({ id: links.id })
        .from(links)
        .where(eq(links.shortUrl, shortUrl))
        .limit(1)

      if (existing.length > 0) {
        throw new ConflictError('Já existe um link com essa URL encurtada')
      }

      const [created] = await db
        .insert(links)
        .values({ originalUrl, shortUrl })
        .returning()

      return reply.status(201).send(created)
    },
  )
}
