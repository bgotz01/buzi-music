import TrackList from '@/app/components/TrackList'
import type { Track } from '@/app/data/tracks'
import tracksData from '@/data/tracks.json'

export const metadata = {
    title: 'Music — buzi',
    description: 'Listen to beats and tracks by buzi.',
}

export default function MusicPage() {
    const tracks = tracksData as Track[]

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">

            <div className="mb-12">
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
                    listen
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
                    Music
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)]">
                    Beats, tracks, and experiments. Hit play.
                </p>
            </div>

            {tracks.length > 0 ? (
                <TrackList tracks={tracks} />
            ) : (
                <p className="text-[var(--color-text-subtle)]">
                    No tracks yet — add some at{' '}
                    <a href="/upload" className="text-[var(--color-accent)] underline underline-offset-2">
                        /upload
                    </a>
                    .
                </p>
            )}

        </div>
    )
}
