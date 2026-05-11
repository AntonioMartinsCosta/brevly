import { useState } from 'react'
import { Copy, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Spinner } from './Spinner'
import { deleteLink, type Link, getApiErrorMessage } from '@/lib/api'
import { env } from '@/lib/env'

interface LinkItemProps {
  link: Link
}

export function LinkItem({ link }: LinkItemProps) {
  const queryClient = useQueryClient()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const fullShortUrl = `${env.FRONTEND_URL.replace(/\/$/, '')}/${link.shortUrl}`
  const displayShortUrl = `brev.ly/${link.shortUrl}`

  const { mutate: removeLink, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLink(link.shortUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      toast.success('Link removido')
      setConfirmingDelete(false)
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Erro ao remover'))
    },
  })

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullShortUrl)
      toast.success('Link copiado para a área de transferência')
    } catch {
      toast.error('Não foi possível copiar')
    }
  }

  function handleDeleteClick() {
    if (confirmingDelete) {
      removeLink()
    } else {
      setConfirmingDelete(true)
      // Auto-cancela a confirmação após 3s
      setTimeout(() => setConfirmingDelete(false), 3000)
    }
  }

  return (
    <li
      className="flex items-center justify-between gap-4 border-t border-gray-200 py-4
                 first:border-t-0 first:pt-0 animate-fade-in"
    >
      <div className="min-w-0 flex-1">
        <a
          href={fullShortUrl}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-md text-blue-base transition-colors
                     hover:text-blue-dark focus:outline-none focus:underline"
          title={displayShortUrl}
        >
          {displayShortUrl}
        </a>
        <p
          className="truncate text-body-sm text-gray-500"
          title={link.originalUrl}
        >
          {link.originalUrl}
        </p>
      </div>

      <span className="flex-shrink-0 text-body-sm text-gray-500">
        {link.accessCount} {link.accessCount === 1 ? 'acesso' : 'acessos'}
      </span>

      <div className="flex flex-shrink-0 items-center gap-1">
        <button
          type="button"
          className="icon-btn"
          onClick={handleCopy}
          aria-label="Copiar link"
          title="Copiar link"
          disabled={isDeleting}
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          className={`icon-btn ${
            confirmingDelete ? 'border-danger text-danger' : ''
          }`}
          onClick={handleDeleteClick}
          aria-label={confirmingDelete ? 'Confirmar exclusão' : 'Excluir link'}
          title={confirmingDelete ? 'Clique para confirmar' : 'Excluir'}
          disabled={isDeleting}
        >
          {isDeleting ? <Spinner size={16} /> : <Trash size={16} />}
        </button>
      </div>
    </li>
  )
}
