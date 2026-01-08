import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
      <h1 className="text-4xl font-bold mb-8">Sistema de Consulta de Aptos</h1>
      <Link 
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Ingresar al Sistema
      </Link>
    </main>
  )
}
