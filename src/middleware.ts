import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Protect /import UI
    if (
      req.nextUrl.pathname.startsWith("/import") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/postulantes", req.url))
    }
    
    // Protect /api/import Endpoint
    if (
      req.nextUrl.pathname.startsWith("/api/import") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { 'content-type': 'application/json' } })
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { matcher: ["/import", "/postulantes", "/api/import"] }
