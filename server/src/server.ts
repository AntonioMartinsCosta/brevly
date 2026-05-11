import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { env } from './env.js'
import { AppError } from './lib/errors.js'

import { createLinkRoute } from './routes/create-link.js'
import { deleteLinkRoute } from './routes/delete-link.js'
import { getLinkRoute } from './routes/get-link.js'
import { listLinksRoute } from './routes/list-links.js'
import { incrementAccessRoute } from './routes/increment-access.js'
import { exportCsvRoute } from './routes/export-csv.js'

const isDev = process.env.NODE_ENV !== 'production'

const app = fastify({
  logger: isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss' },
        },
      }
    : true,
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// CORS — habilitado para qualquer origem (em produção, restrinja via env se quiser)
await app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
})

// Swagger / OpenAPI (DX)
await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      description: 'API para encurtamento de URLs',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
await app.register(fastifySwaggerUi, { routePrefix: '/docs' })

// Healthcheck
app.get('/health', async () => ({ status: 'ok' }))

// Rotas
await app.register(createLinkRoute)
await app.register(deleteLinkRoute)
await app.register(getLinkRoute)
await app.register(listLinksRoute)
await app.register(incrementAccessRoute)
await app.register(exportCsvRoute)

// Error handler global
app.setErrorHandler((error, request, reply) => {
  // Erros de validação Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação',
      issues: error.format(),
    })
  }

  // fastify-type-provider-zod encapsula validações com `validation`
  if ((error as any).validation) {
    return reply.status(400).send({
      message: 'Erro de validação',
      issues: (error as any).validation,
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  request.log.error(error)
  return reply.status(500).send({ message: 'Erro interno do servidor' })
})

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`)
    console.log(`📚 Documentação em http://localhost:${env.PORT}/docs`)
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar o servidor:', err)
    process.exit(1)
  })
