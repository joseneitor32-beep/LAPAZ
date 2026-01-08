'use client'

import Navbar from '@/components/Navbar'
import { useState, useRef } from 'react'
import { Upload, FileUp, AlertCircle, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
      setStats(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setError('')
      setStats(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error en la importación')
      }

      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Importar Postulantes</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Area */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div
              className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-sm text-gray-600">
                Arrastra y suelta tu archivo Excel aquí, o
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                selecciona un archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
              {file && (
                <div className="mt-4 flex items-center text-sm text-gray-900 font-medium">
                  <FileUp className="mr-2 h-4 w-4 text-green-500" />
                  {file.name}
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={clsx(
                "mt-4 w-full rounded-md py-2 font-medium text-white",
                !file || loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {loading ? "Procesando..." : "Importar Datos"}
            </button>

            {error && (
              <div className="mt-4 flex items-center rounded-md bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
              </div>
            )}
          </div>

          {/* Stats Area */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Resultados</h2>
            {stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-xs text-gray-500">Total Leídos</div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.inserted}</div>
                    <div className="text-xs text-green-700">Insertados</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.updated}</div>
                    <div className="text-xs text-blue-700">Actualizados</div>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                    <div className="text-xs text-red-700">Errores</div>
                  </div>
                </div>

                {stats.errorDetails.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 text-sm font-medium text-red-700">Detalle de Errores (Primeros 10)</h3>
                    <div className="max-h-40 overflow-y-auto rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                      {stats.errorDetails.slice(0, 10).map((err: any, idx: number) => (
                        <div key={idx} className="mb-1 border-b border-red-100 pb-1 last:border-0">
                          Fila {err.row}: {JSON.stringify(err.error)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Los resultados aparecerán aquí
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
