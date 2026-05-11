import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { Logo } from '@/components/Logo'
import { Spinner } from '@/components/Spinner'
import { getLink, incrementAccess } from '@/lib/api'

type Status = 'loading' | 'redirecting' | 'not-found'

export function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const [status, setStatus] = useState<Status>('loading')
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  // Garante que o efeito execute apenas uma vez (StrictMode dispara duas vezes em dev)
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (!shortUrl || hasRunRef.current) return
    hasRunRef.current = true

    async function run() {
      try {
        // 1. Busca o link
        const link = await getLink(shortUrl!)

        // 2. Incrementa acessos (não bloqueia o redirecionamento se falhar)
        incrementAccess(shortUrl!).catch(() => {
          /* silently fail */
        })

        // 3. Atualiza UI e dispara o redirect
        setOriginalUrl(link.originalUrl)
        setStatus('redirecting')

        // Pequeno delay para o usuário ver a mensagem
        setTimeout(() => {
          window.location.href = link.originalUrl
        }, 1200)
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          setStatus('not-found')
          return
        }
        setStatus('not-found')
      }
    }

    run()
  }, [shortUrl])

  if (status === 'not-found') {
    return <Navigate to="/url/not-found" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="card flex w-full max-w-[580px] flex-col items-center gap-6 text-center">
        <Logo iconOnly />

        <div className="flex flex-col items-center gap-2">
          <Spinner size={32} className="text-blue-base" />
          <h1 className="text-xl text-gray-600">Redirecionando...</h1>
        </div>

        <p className="text-body-md text-gray-500">
          O link será aberto automaticamente em alguns instantes.
          <br />
          Não foi redirecionado?{' '}
          {originalUrl ? (
            <a
              href={originalUrl}
              className="text-blue-base underline transition-colors hover:text-blue-dark"
            >
              Acesse aqui
            </a>
          ) : (
            <span className="text-gray-400">Aguarde...</span>
          )}
        </p>
      </div>
    </div>
  )
}
