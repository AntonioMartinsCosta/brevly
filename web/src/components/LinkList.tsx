import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DownloadSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'

import { LinkItem } from './LinkItem'
import { EmptyState } from './EmptyState'
import { Spinner } from './Spinner'
import { exportCsv, getApiErrorMessage, listLinks } from '@/lib/api'

export function LinkList() {
  const [isDownloading, setIsDownloading] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['links'],
    queryFn: listLinks,
  })

  const { mutateAsync: triggerExport, isPending: isExporting } = useMutation({
    mutationFn: exportCsv,
  })

  async function handleDownloadCsv() {
    try {
      setIsDownloading(true)
      const { reportUrl } = await triggerExport()

      // Faz o download do arquivo na CDN. Como o R2 está em outro origin,
      // criamos um <a download> apontando pra URL pública.
      const a = document.createElement('a')
      a.href = reportUrl
      a.download = ''
      a.target = '_blank'
      a.rel = 'noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast.success('Relatório gerado com sucesso!')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao gerar relatório'))
    } finally {
      setIsDownloading(false)
    }
  }

  const links = data?.links ?? []
  const hasLinks = links.length > 0
  const isBusy = isExporting || isDownloading

  return (
    <section className="card flex h-full flex-col">
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg text-gray-600">Meus links</h2>

        <button
          type="button"
          onClick={handleDownloadCsv}
          disabled={!hasLinks || isBusy}
          className="btn-secondary"
        >
          {isBusy ? <Spinner size={16} /> : <DownloadSimple size={16} />}
          <span>Baixar CSV</span>
        </button>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 border-t border-gray-200 py-12">
          <Spinner size={24} className="text-blue-base" />
          <p className="text-body-xs uppercase tracking-wide text-gray-500">
            Carregando links...
          </p>
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 border-t border-gray-200 py-12">
          <p className="text-body-sm text-danger">Não foi possível carregar os links.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-secondary"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !isError && !hasLinks && <EmptyState />}

      {!isLoading && !isError && hasLinks && (
        <ul className="flex-1 overflow-y-auto">
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </ul>
      )}
    </section>
  )
}
