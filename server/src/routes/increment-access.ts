import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { links } from '../db/schema.js'
import { NotFoundError } from '../lib/errors.js'

export const incrementAccessRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/links/:shortUrl/access',
    {
      schema: {
        tags: ['links'],
        summary: 'Incrementar contador de acessos de um link',
        params: z.object({
          shortUrl: z.string().min(1),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            originalUrl: z.string().url(),
            shortUrl: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
        },
      },
    },
    async (request) => {
      const { shortUrl } = request.params

      // Atomicamente: incrementa e retorna a linha atualizada
      const [updated] = await db
        .update(links)
        .set({ accessCount: sql`${links.accessCount} + 1` })
        .where(eq(links.shortUrl, shortUrl))
        .returning()

      if (!updated) {
        throw new NotFoundError('Link não encontrado')
      }

      return updated
    },
  )
}
