import { Link as LinkIcon } from '@phosphor-icons/react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border-t border-gray-200 py-12">
      <LinkIcon size={32} className="text-gray-400" />
      <p className="text-body-xs uppercase tracking-wide text-gray-500">
        Ainda não existem links cadastrados
      </p>
    </div>
  )
}
