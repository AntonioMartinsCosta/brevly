import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { PassThrough } from 'node:stream'
import { db } from '../db/index.js'
import { uploadToR2 } from '../services/r2.js'

// Escapa um campo segundo a RFC 4180 (CSV padrão)
function escapeCsvField(value: string | number | Date): string {
  const str = value instanceof Date ? value.toISOString() : String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCsvRow(values: Array<string | number | Date>): string {
  return values.map(escapeCsvField).join(',') + '\n'
}

export const exportCsvRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/links/exports',
    {
      schema: {
        tags: ['links'],
        summary: 'Exportar todos os links em CSV (upload no R2 e retorno da URL pública)',
        response: {
          200: z.object({
            reportUrl: z.string().url(),
          }),
        },
      },
    },
    async () => {
      // Gera um nome único para o arquivo
      const fileName = `reports/${randomUUID()}.csv`

      // Stream que será consumido pelo Upload do S3
      const stream = new PassThrough()

      // Inicia o upload (não aguardamos aqui ainda; deixamos rolar em paralelo
      // enquanto vamos escrevendo dados do banco no stream).
      const uploadPromise = uploadToR2({
        fileName,
        contentType: 'text/csv; charset=utf-8',
        body: stream,
      })

      try {
        // Escreve o cabeçalho
        stream.write(
          toCsvRow(['original_url', 'short_url', 'access_count', 'created_at']),
        )

        // Cursor / chunked read para não carregar tudo na memória.
        // Usamos `.values()` do postgres-js como streaming via async iterator.
        const PAGE_SIZE = 1000
        let offset = 0

        // Loop paginado — performático e sem carregar a tabela inteira
        while (true) {
          const rows = await db.query.links.findMany({
            limit: PAGE_SIZE,
            offset,
            orderBy: (l, { asc }) => asc(l.createdAt),
          })

          if (rows.length === 0) break

          for (const row of rows) {
            stream.write(
              toCsvRow([
                row.originalUrl,
                row.shortUrl,
                row.accessCount,
                row.createdAt,
              ]),
            )
          }

          if (rows.length < PAGE_SIZE) break
          offset += PAGE_SIZE
        }

        stream.end()
      } catch (err) {
        stream.destroy(err as Error)
        throw err
      }

      const { url } = await uploadPromise

      return { reportUrl: url }
    },
  )
}
