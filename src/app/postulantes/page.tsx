'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, User, Shield, Users } from 'lucide-react'
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
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-red-500 uppercase tracking-wider">
            <Shield className="h-8 w-8" />
            Listado de Postulantes
          </h1>
        </div>

        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-700 bg-slate-900 pl-10 py-3 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Buscar por CI, Nombre, Unidad o Código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden overflow-hidden rounded-lg border border-gray-800 bg-slate-900 shadow shadow-red-900/10 md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-slate-950">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-500">N°</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-500">Unidad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-500">Grupo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-500">Código</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-500">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-500">C.I.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-slate-900">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                      <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                      No se encontraron resultados.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{item.nro || '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300 font-medium">{item.unidad}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={clsx(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          item.grupo?.includes('1') ? "bg-blue-900 text-blue-200" :
                          item.grupo?.includes('2') ? "bg-purple-900 text-purple-200" :
                          "bg-gray-800 text-gray-300"
                        )}>
                           {item.grupo || 'S/G'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-yellow-500">{item.codPreinsc}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">{item.nombrePostulante}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{item.ci}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="space-y-4 md:hidden">
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                </div>
            ) : data.length === 0 ? (
                <div className="rounded-lg bg-slate-900 p-6 text-center text-gray-400 border border-gray-800">
                    No se encontraron resultados.
                </div>
            ) : (
                data.map((item) => (
                    <div key={item.id} className="rounded-lg border border-gray-800 bg-slate-900 p-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-2">
                            <span className="font-mono text-sm text-yellow-500">{item.codPreinsc}</span>
                            <span className={clsx(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                item.grupo?.includes('1') ? "bg-blue-900 text-blue-200" :
                                item.grupo?.includes('2') ? "bg-purple-900 text-purple-200" :
                                "bg-gray-800 text-gray-300"
                            )}>
                                {item.grupo || 'S/G'}
                            </span>
                        </div>
                        <div className="mb-2">
                            <h3 className="font-medium text-white">{item.nombrePostulante}</h3>
                            <p className="text-xs text-gray-500">CI: {item.ci}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" /> {item.unidad}
                            </span>
                            <span>#{item.nro || '-'}</span>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
            <div className="hidden sm:block">
                <p className="text-sm text-gray-400">
                  Mostrando <span className="font-medium text-white">{(meta.page - 1) * meta.limit + 1}</span> a <span className="font-medium text-white">{Math.min(meta.page * meta.limit, meta.total)}</span> de <span className="font-medium text-white">{meta.total}</span> resultados
                </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end gap-2">
                <button
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-700 bg-slate-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                </button>
                <button
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page === meta.lastPage}
                    className="relative inline-flex items-center rounded-md border border-gray-700 bg-slate-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente <ChevronRight className="ml-1 h-4 w-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}
