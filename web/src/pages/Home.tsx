import { Logo } from '@/components/Logo'
import { CreateLinkForm } from '@/components/CreateLinkForm'
import { LinkList } from '@/components/LinkList'

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto flex w-full max-w-[980px] flex-col gap-8 px-4 py-6 md:py-12">
        <header>
          <Logo />
        </header>

        {/* Mobile: 1 coluna empilhada. Desktop: 2 colunas (form fixo, lista flexível) */}
        <div className="grid gap-4 md:grid-cols-[380px_1fr] md:gap-5 md:items-start">
          <CreateLinkForm />
          <LinkList />
        </div>
      </main>
    </div>
  )
}
