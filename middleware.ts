import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se está tentando acessar área admin (exceto login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Verificar se o usuário está autenticado e é admin
    const token = await getToken({ req: request })
    
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}
