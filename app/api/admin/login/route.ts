import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || password !== adminPassword) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_auth', adminPassword, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    })

    return res
}
