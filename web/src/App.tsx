import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Home } from '@/pages/Home'
import { Redirect } from '@/pages/Redirect'
import { NotFound } from '@/pages/NotFound'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Rota explícita do 404 (URL canônica) */}
        <Route path="/url/not-found" element={<NotFound />} />
        {/* Redirect dinâmico — captura qualquer /:shortUrl */}
        <Route path="/:shortUrl" element={<Redirect />} />
        {/* Catch-all para rotas inexistentes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
