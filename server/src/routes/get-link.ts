import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { links } from '../db/schema.js'
import { NotFoundError } from '../lib/errors.js'

export const getLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/links/:shortUrl',
    {
      schema: {
        tags: ['links'],
        summary: 'Obter um link pelo shortUrl (não incrementa acessos)',
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

      const [link] = await db
        .select()
        .from(links)
        .where(eq(links.shortUrl, shortUrl))
        .limit(1)

      if (!link) {
        throw new NotFoundError('Link não encontrado')
      }

      return link
    },
  )
}
