import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
    const password = process.env.ADMIN_PASSWORD
    if (!password) return NextResponse.next() // no password set → open (dev fallback)

    const cookie = req.cookies.get('admin_auth')?.value
    if (cookie === password) return NextResponse.next()

    // Redirect to login, preserving the intended destination
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('from', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
}

export const config = {
    // Protect all /admin routes except the login page itself
    matcher: ['/admin/((?!login).*)'],
}
