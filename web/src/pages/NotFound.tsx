import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="card flex w-full max-w-[580px] flex-col items-center gap-6 text-center">
        <Logo iconOnly />

        <div className="flex flex-col gap-3">
          <h1 className="text-xl text-gray-600">Link não encontrado</h1>
          <p className="text-body-md text-gray-500">
            O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
            <br />
            Saiba mais em{' '}
            <Link
              to="/"
              className="text-blue-base underline transition-colors hover:text-blue-dark"
            >
              brev.ly
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
