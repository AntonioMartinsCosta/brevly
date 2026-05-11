import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

import { TextField } from './TextField'
import { Spinner } from './Spinner'
import { createLink, type Link, getApiErrorMessage } from '@/lib/api'

const SHORT_URL_REGEX = /^[a-zA-Z0-9_-]+$/

const formSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'Informe uma url válida')
    .url('Informe uma url válida'),
  shortUrl: z
    .string()
    .min(1, 'Informe uma url minúscula e sem espaço/caractere especial')
    .regex(
      SHORT_URL_REGEX,
      'Informe uma url minúscula e sem espaço/caractere especial',
    ),
})

type FormData = z.infer<typeof formSchema>

export function CreateLinkForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  })

  const { mutateAsync } = useMutation({
    mutationFn: createLink,
    onSuccess: (created: Link) => {
      // Atualização otimista do cache: prepende o novo link
      queryClient.setQueryData<{ links: Link[]; total: number }>(
        ['links'],
        (old) => {
          if (!old) return old
          return {
            ...old,
            links: [created, ...old.links],
            total: old.total + 1,
          }
        },
      )
      // Invalida pra ficar 100% sincronizado
      queryClient.invalidateQueries({ queryKey: ['links'] })

      toast.success('Link criado com sucesso!')
      reset()
    },
  })

  async function onSubmit(values: FormData) {
    try {
      await mutateAsync(values)
    } catch (err) {
      // 409 = shortUrl já existe → marca o erro no campo
      if (err instanceof AxiosError && err.response?.status === 409) {
        setError('shortUrl', { message: 'Essa URL encurtada já existe' })
        return
      }
      toast.error(getApiErrorMessage(err, 'Erro ao criar link'))
    }
  }

  return (
    <section className="card">
      <h2 className="mb-6 text-lg text-gray-600">Novo link</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <TextField
          label="Link original"
          placeholder="www.exemplo.com.br"
          error={errors.originalUrl?.message}
          autoComplete="off"
          {...register('originalUrl')}
        />

        <TextField
          label="Link encurtado"
          prefix="brev.ly/"
          error={errors.shortUrl?.message}
          autoComplete="off"
          {...register('shortUrl')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary mt-2"
        >
          {isSubmitting ? <Spinner size={20} /> : 'Salvar link'}
        </button>
      </form>
    </section>
  )
}
