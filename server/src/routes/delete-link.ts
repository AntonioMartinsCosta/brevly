import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { links } from '../db/schema.js'
import { NotFoundError } from '../lib/errors.js'

export const deleteLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/links/:shortUrl',
    {
      schema: {
        tags: ['links'],
        summary: 'Deletar um link pelo seu shortUrl',
        params: z.object({
          shortUrl: z.string().min(1),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const deleted = await db
        .delete(links)
        .where(eq(links.shortUrl, shortUrl))
        .returning({ id: links.id })

      if (deleted.length === 0) {
        throw new NotFoundError('Link não encontrado')
      }

      return reply.status(204).send()
    },
  )
}
