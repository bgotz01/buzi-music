'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
    const router = useRouter()
    const params = useSearchParams()
    const from = params.get('from') ?? '/admin'

    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })

        if (res.ok) {
            router.push(from)
            router.refresh()
        } else {
            setError('Wrong password.')
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-sm px-4 py-24">
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">admin</p>
                <h1 className="text-3xl font-bold text-[var(--color-text)]">Sign in</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex h-10 w-full items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
                >
                    {loading ? 'Checking…' : 'Enter'}
                </button>
            </form>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}
