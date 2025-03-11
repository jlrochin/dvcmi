import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/auth-diagnostico", "/test-login"]
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Si no hay sesión y la ruta no es pública, redirigir a /login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay sesión y la ruta es /login, redirigir a /dashboard
  if (session && req.nextUrl.pathname.startsWith("/login")) {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

