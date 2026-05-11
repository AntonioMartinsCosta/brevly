import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { desc, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { links } from '../db/schema.js'

export const listLinksRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/links',
    {
      schema: {
        tags: ['links'],
        summary: 'Listar todos os links com paginação',
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          pageSize: z.coerce.number().int().positive().max(100).default(20),
        }),
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string().uuid(),
                originalUrl: z.string().url(),
                shortUrl: z.string(),
                accessCount: z.number(),
                createdAt: z.date(),
              }),
            ),
            total: z.number(),
            page: z.number(),
            pageSize: z.number(),
          }),
        },
      },
    },
    async (request) => {
      const { page, pageSize } = request.query
      const offset = (page - 1) * pageSize

      // Executa as duas queries em paralelo para reduzir latência
      const [rows, [{ count }]] = await Promise.all([
        db
          .select()
          .from(links)
          .orderBy(desc(links.createdAt))
          .limit(pageSize)
          .offset(offset),
        db.select({ count: sql<number>`count(*)::int` }).from(links),
      ])

      return {
        links: rows,
        total: count,
        page,
        pageSize,
      }
    },
  )
}
