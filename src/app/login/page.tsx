'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sword, Shield, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'

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
    // FIX: min-h-[100svh] ensures it fits mobile screen exactly without address bar issues
    // FIX: px-4 ensures padding on small screens
    <div className="flex min-h-[100svh] w-full items-center justify-center p-4 bg-slate-950">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 shadow-2xl shadow-black/50 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-slate-900 p-4 ring-1 ring-slate-800 shadow-inner">
              <Sword className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-widest text-slate-100 font-bold uppercase">ARES</CardTitle>
            <CardDescription className="text-slate-400">
              Sistema de Consulta de Aptos
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-400 border border-red-900/50 text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300">
                  Usuario
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  required
                  disabled={isLoading}
                  className="bg-slate-950/50 border-slate-800 focus:border-red-900/50 focus:ring-red-900/20 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300">
                  Contraseña
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="bg-slate-950/50 border-slate-800 focus:border-red-900/50 focus:ring-red-900/20 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-6 transition-all duration-300 shadow-lg shadow-red-900/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  INGRESAR <Shield className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-slate-800/50 p-6">
          <p className="text-xs text-slate-500">
            &copy; 2026 Sistema Ares. Acceso Restringido.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
