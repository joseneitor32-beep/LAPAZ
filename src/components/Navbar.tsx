'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) return null

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-blue-600">Consulta Aptos</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/postulantes"
                className={clsx(
                  "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                  pathname === '/postulantes'
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Postulantes
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/import"
                  className={clsx(
                    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                    pathname === '/import'
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  Importar
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-500">
              {session.user.username} ({session.user.role})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
