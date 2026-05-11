import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Readable } from 'node:stream'
import { env } from '../env.js'
import { AppError } from '../lib/errors.js'

interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicUrl: string
}

/**
 * Garante que todas as variáveis do R2 estejam preenchidas no .env.
 * Lança um AppError com mensagem amigável caso contrário.
 */
function getR2Config(): R2Config {
  const {
    CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ACCESS_KEY_ID,
    CLOUDFLARE_SECRET_ACCESS_KEY,
    CLOUDFLARE_BUCKET,
    CLOUDFLARE_PUBLIC_URL,
  } = env

  if (
    !CLOUDFLARE_ACCOUNT_ID ||
    !CLOUDFLARE_ACCESS_KEY_ID ||
    !CLOUDFLARE_SECRET_ACCESS_KEY ||
    !CLOUDFLARE_BUCKET ||
    !CLOUDFLARE_PUBLIC_URL
  ) {
    throw new AppError(
      'Cloudflare R2 não está configurado. Preencha as variáveis CLOUDFLARE_* no .env para usar a exportação de CSV.',
      503,
    )
  }

  return {
    accountId: CLOUDFLARE_ACCOUNT_ID,
    accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
    bucket: CLOUDFLARE_BUCKET,
    publicUrl: CLOUDFLARE_PUBLIC_URL,
  }
}

interface UploadParams {
  fileName: string
  contentType: string
  body: Readable | Buffer | string
}

export async function uploadToR2({ fileName, contentType, body }: UploadParams) {
  const config = getR2Config()

  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  const upload = new Upload({
    client: r2,
    params: {
      Bucket: config.bucket,
      Key: fileName,
      Body: body,
      ContentType: contentType,
    },
  })

  await upload.done()

  // Retorna a URL pública (via CDN configurada no R2)
  const publicUrl = new URL(fileName, config.publicUrl).toString()
  return { url: publicUrl, key: fileName }
}
