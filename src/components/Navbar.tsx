'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Sword, LogOut, Upload, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!session) return null

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/postulantes" className="flex flex-shrink-0 items-center gap-2 group">
              <div className="rounded-lg bg-red-900/20 p-1.5 ring-1 ring-red-900/50 transition-colors group-hover:bg-red-900/30">
                <Sword className="h-6 w-6 text-red-500" />
              </div>
              <span className="text-xl font-bold tracking-wider text-slate-100 group-hover:text-white transition-colors">ARES</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/postulantes"
                className={clsx(
                  "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                  pathname === '/postulantes'
                    ? "border-red-500 text-white"
                    : "border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300"
                )}
              >
                Postulantes
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/import"
                  className={clsx(
                    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                    pathname === '/import'
                      ? "border-red-500 text-white"
                      : "border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  )}
                >
                  Importar
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:gap-4">
            <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/50 px-4 py-1.5">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-slate-200 leading-none">
                  {session.user.username}
                </span>
              </div>
              <Badge variant={session.user.role === 'ADMIN' ? 'admin' : 'inspectoria'}>
                {session.user.role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-slate-400 hover:text-red-400 hover:bg-red-900/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={clsx(
          "md:hidden absolute w-full bg-slate-950 border-b border-slate-800 shadow-xl transition-all duration-300 ease-in-out origin-top",
          isOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
        )}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link
            href="/postulantes"
            className={clsx(
              "block rounded-md px-3 py-2 text-base font-medium transition-colors",
              pathname === '/postulantes'
                ? "bg-red-900/20 text-red-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
            onClick={() => setIsOpen(false)}
          >
            Postulantes
          </Link>
          {session.user.role === 'ADMIN' && (
            <Link
              href="/import"
              className={clsx(
                "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                pathname === '/import'
                  ? "bg-red-900/20 text-red-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              Importar
            </Link>
          )}
        </div>
        <div className="border-t border-slate-800 pb-3 pt-4 bg-slate-900/30">
          <div className="flex items-center px-4 mb-3 justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{session.user.username}</div>
                <div className="text-sm font-medium text-slate-500">{session.user.role}</div>
              </div>
            </div>
            <Badge variant={session.user.role === 'ADMIN' ? 'admin' : 'inspectoria'}>
                {session.user.role}
            </Badge>
          </div>
          <div className="mt-3 px-2">
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
