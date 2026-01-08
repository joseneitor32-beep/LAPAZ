'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sword, Shield } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Credenciales inválidas')
        setIsLoading(false)
      } else {
        router.push('/postulantes')
        router.refresh()
      }
    } catch (err) {
      setError('Error de conexión')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border-2 border-red-900 bg-slate-900 shadow-2xl shadow-red-900/20">
        <div className="bg-gradient-to-r from-red-900 to-slate-900 p-6 text-center">
            <div className="mb-2 flex justify-center">
                <Sword className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-wider text-white uppercase">ARES</h1>
            <p className="text-red-200 text-sm">Sistema de Consulta de Aptos</p>
        </div>
        
        <div className="p-8">
            {error && (
            <div className="mb-6 rounded border border-red-500 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {error}
            </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Usuario</label>
                <div className="relative">
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-lg border border-gray-700 bg-slate-800 p-3 pl-4 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Ingrese su usuario"
                    required
                    />
                </div>
            </div>
            
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Contraseña</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-700 bg-slate-800 p-3 pl-4 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="••••••••"
                required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-lg bg-red-700 px-4 py-3 font-bold text-white shadow-lg transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Autenticando...
                    </div>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        INGRESAR <Shield className="h-4 w-4" />
                    </span>
                )}
                
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
            </form>
        </div>
        
        <div className="bg-slate-950 p-4 text-center text-xs text-gray-500 border-t border-slate-800">
            &copy; 2026 Sistema Ares. Acceso Restringido.
        </div>
      </div>
    </div>
  )
}
