import TrackList from '@/app/components/TrackList'
import type { Track } from '@/app/data/tracks'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

export const metadata = {
    title: 'Music — buzi',
    description: 'Listen to beats and tracks by buzi.',
}

export const dynamic = 'force-dynamic'

async function getTracks(): Promise<Track[]> {
    const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        bpm: row.bpm ?? undefined,
        key: row.key ?? undefined,
        keyMode: row.key_mode ?? undefined,
        thumbnail: row.thumbnail ?? undefined,
        audioSrc: row.audio_src,
        duration: row.duration ?? undefined,
        tags: row.tags ?? undefined,
        createdAt: row.created_at,
    }))
}

export default async function MusicPage() {
    const tracks = await getTracks()

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
                <Suspense>
                    <TrackList tracks={tracks} />
                </Suspense>
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
