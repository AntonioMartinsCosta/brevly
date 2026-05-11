function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`)
  }
  return value
}

export const env = {
  FRONTEND_URL: required(import.meta.env.VITE_FRONTEND_URL, 'VITE_FRONTEND_URL'),
  BACKEND_URL: required(import.meta.env.VITE_BACKEND_URL, 'VITE_BACKEND_URL'),
}
