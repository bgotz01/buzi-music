import TrackForm from '../components/TrackForm'
import Link from 'next/link'

export const metadata = { title: 'Add Track — admin' }

export default function AdminUploadPage() {
    return (
        <div className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
            <div className="mb-10">
                <Link
                    href="/admin/tracks"
                    className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)]"
                >
                    ← Tracks
                </Link>
                <p className="mb-1 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">admin</p>
                <h1 className="text-3xl font-bold text-[var(--color-text)]">Add Track</h1>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 sm:p-8">
                <TrackForm />
            </div>
        </div>
    )
}
