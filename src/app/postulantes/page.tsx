'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, FileDown } from 'lucide-react'
import clsx from 'clsx'

export default function PostulantesPage() {
  const [data, setData] = useState<any[]>([])
  const [meta, setMeta] = useState<any>({ page: 1, limit: 20, total: 0, lastPage: 1 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchData(1, debouncedSearch)
  }, [debouncedSearch])

  const fetchData = async (page: number, searchTerm: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/postulantes?page=${page}&search=${encodeURIComponent(searchTerm)}`)
      if (!res.ok) throw new Error('Error fetching data')
      const result = await res.json()
      setData(result.data)
      setMeta(result.meta)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.lastPage) {
      fetchData(newPage, debouncedSearch)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900">Listado de Postulantes</h1>
          <div className="flex items-center space-x-2">
             {/* Optional: CSV Export button could go here */}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 py-2 border"
              placeholder="Buscar por CI, Nombre, Unidad o Código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">N°</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Unidad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">C.I.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron resultados.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.nro || '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{item.unidad}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{item.codPreinsc}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.nombrePostulante}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.ci}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> a <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> de <span className="font-medium">{meta.total}</span> resultados
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page === meta.lastPage}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
