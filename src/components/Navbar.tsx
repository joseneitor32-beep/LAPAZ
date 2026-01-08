'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Sword, LogOut, Upload, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!session) return null

  return (
    <nav className="border-b border-red-900 bg-slate-900 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Sword className="h-8 w-8 text-red-600 mr-2" />
              <span className="text-xl font-bold tracking-wider text-white">ARES</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/postulantes"
                className={clsx(
                  "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                  pathname === '/postulantes'
                    ? "border-red-500 text-white"
                    : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
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
                      : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                  )}
                >
                  Importar
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <span className="mr-4 text-sm text-gray-400">
              {session.user.username} <span className="text-red-500">[{session.user.role}]</span>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 rounded-md bg-red-900/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx("sm:hidden", isOpen ? "block" : "hidden")}>
        <div className="space-y-1 pb-3 pt-2">
          <Link
            href="/postulantes"
            className={clsx(
              "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
              pathname === '/postulantes'
                ? "border-red-500 bg-slate-800 text-white"
                : "border-transparent text-gray-400 hover:border-gray-300 hover:bg-gray-800 hover:text-white"
            )}
            onClick={() => setIsOpen(false)}
          >
            Postulantes
          </Link>
          {session.user.role === 'ADMIN' && (
            <Link
              href="/import"
              className={clsx(
                "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                pathname === '/import'
                  ? "border-red-500 bg-slate-800 text-white"
                  : "border-transparent text-gray-400 hover:border-gray-300 hover:bg-gray-800 hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              Importar
            </Link>
          )}
        </div>
        <div className="border-t border-gray-800 pb-3 pt-4">
          <div className="flex items-center px-4">
            <div className="ml-3">
              <div className="text-base font-medium text-white">{session.user.username}</div>
              <div className="text-sm font-medium text-gray-500">{session.user.role}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
