'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, User, Shield, Users, Filter, X } from 'lucide-react'
import clsx from 'clsx'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'

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

  // Helper function to format Group display
  const getGroupBadgeVariant = (grupo: string | null) => {
    if (!grupo) return 'singrupo';
    const grupoUpper = grupo.toUpperCase();
    if (grupoUpper.includes('1') || grupoUpper === 'UNO') return 'grupo1';
    if (grupoUpper.includes('2') || grupoUpper === 'DOS') return 'grupo2';
    return 'outline';
  }

  const getGroupLabel = (grupo: string | null) => {
    if (!grupo) return 'SIN GRUPO';
    const grupoUpper = grupo.toUpperCase();
    if (grupoUpper.includes('1') || grupoUpper === 'UNO') return 'GRUPO UNO';
    if (grupoUpper.includes('2') || grupoUpper === 'DOS') return 'GRUPO DOS';
    return grupo;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="uppercase">Listado de Postulantes</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Gestión y consulta de personal habilitado
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="px-3 py-1 text-sm bg-slate-900 border-slate-800">
                Total: <span className="ml-1 text-slate-100 font-bold">{meta.total}</span>
             </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-20 z-30 bg-slate-950/95 backdrop-blur py-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:py-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <Input
                type="text"
                className="pl-10 h-11 bg-slate-900/80 border-slate-800 focus:border-red-900/50"
                placeholder="Buscar por CI, Nombre, Unidad o Código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Future Filters could go here */}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block rounded-lg border border-slate-800 bg-slate-900/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-4 w-16">N°</th>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Nombre Completo</th>
                  <th className="px-6 py-4">C.I.</th>
                  <th className="px-6 py-4">Unidad</th>
                  <th className="px-6 py-4">Grupo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center gap-2 text-slate-400">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        Cargando datos...
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No se encontraron resultados para tu búsqueda.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.nro || '-'}</td>
                      <td className="px-6 py-4 font-mono text-yellow-500 font-medium tracking-wide">{item.codPreinsc}</td>
                      <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition-colors">{item.nombrePostulante}</td>
                      <td className="px-6 py-4 text-slate-400">{item.ci}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Users className="h-3 w-3 text-slate-500" />
                          {item.unidad}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getGroupBadgeVariant(item.grupo)}>
                           {getGroupLabel(item.grupo)}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
            {loading ? (
                <div className="py-12 text-center">
                    <div className="flex justify-center items-center gap-2 text-slate-400">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        Cargando...
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
                    No se encontraron resultados.
                </div>
            ) : (
                data.map((item) => (
                    <Card key={item.id} className="bg-slate-900/60 border-slate-800 overflow-hidden">
                        <CardContent className="p-5 space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-100 line-clamp-2 leading-tight">
                                        {item.nombrePostulante}
                                    </h3>
                                    <p className="text-sm text-slate-400 flex items-center gap-2">
                                        <span className="font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">CI: {item.ci}</span>
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="font-mono text-sm text-yellow-500 font-medium bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                        {item.codPreinsc}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="pt-3 border-t border-slate-800/50 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium text-slate-300">{item.unidad}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500">#{item.nro || '-'}</span>
                                </div>
                                <Badge variant={getGroupBadgeVariant(item.grupo)} className="text-[10px] px-2 h-6">
                                    {getGroupLabel(item.grupo)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            <div className="hidden sm:block">
                <p className="text-sm text-slate-400">
                  Mostrando <span className="font-medium text-slate-200">{(meta.page - 1) * meta.limit + 1}</span> a <span className="font-medium text-slate-200">{Math.min(meta.page * meta.limit, meta.total)}</span> de <span className="font-medium text-slate-200">{meta.total}</span>
                </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="h-9"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page === meta.lastPage}
                    className="h-9"
                >
                    Siguiente <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
