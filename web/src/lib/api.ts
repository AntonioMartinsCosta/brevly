import axios, { AxiosError } from 'axios'
import { env } from './env'

export const api = axios.create({
  baseURL: env.BACKEND_URL,
})

// ====================== Tipos ======================
export interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export interface ListLinksResponse {
  links: Link[]
  total: number
  page: number
  pageSize: number
}

export interface CreateLinkInput {
  originalUrl: string
  shortUrl: string
}

export interface ApiError {
  message: string
  issues?: unknown
}

// ====================== Helpers ======================
export function getApiErrorMessage(error: unknown, fallback = 'Erro inesperado'): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}

// ====================== Funções de API ======================
export async function listLinks(): Promise<ListLinksResponse> {
  const { data } = await api.get<ListLinksResponse>('/links', {
    params: { page: 1, pageSize: 100 },
  })
  return data
}

export async function createLink(input: CreateLinkInput): Promise<Link> {
  const { data } = await api.post<Link>('/links', input)
  return data
}

export async function deleteLink(shortUrl: string): Promise<void> {
  await api.delete(`/links/${shortUrl}`)
}

export async function getLink(shortUrl: string): Promise<Link> {
  const { data } = await api.get<Link>(`/links/${shortUrl}`)
  return data
}

export async function incrementAccess(shortUrl: string): Promise<Link> {
  const { data } = await api.patch<Link>(`/links/${shortUrl}/access`)
  return data
}

export async function exportCsv(): Promise<{ reportUrl: string }> {
  const { data } = await api.post<{ reportUrl: string }>('/links/exports')
  return data
}
