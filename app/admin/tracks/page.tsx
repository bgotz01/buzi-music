import TracksManager from './TracksManager'
import type { Track } from '@/app/data/tracks'
import tracksData from '@/data/tracks.json'
import Link from 'next/link'

export const metadata = { title: 'Manage Tracks — admin' }

export default function AdminTracksPage() {
    const tracks = tracksData as Track[]

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <p className="mb-1 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">admin</p>
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">Tracks</h1>
                </div>
                <Link
                    href="/admin/upload"
                    className="flex h-9 items-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                    + Add track
                </Link>
            </div>

            <TracksManager initial={tracks} />
        </div>
    )
}
