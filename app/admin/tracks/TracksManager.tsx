'use client'

import { useState } from 'react'
import TrackForm from '../components/TrackForm'
import type { Track } from '@/app/data/tracks'

export default function TracksManager({ initial }: { initial: Track[] }) {
    const [tracks, setTracks] = useState<Track[]>(initial)
    const [editing, setEditing] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    async function refresh() {
        const res = await fetch('/api/tracks')
        const data = await res.json()
        setTracks(data)
    }

    async function handleDelete(id: string) {
        setDeleting(id)
        await fetch('/api/tracks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        await refresh()
        setDeleting(null)
    }

    return (
        <div className="space-y-3">
            {tracks.length === 0 && (
                <p className="text-sm text-[var(--color-text-subtle)]">No tracks yet.</p>
            )}

            {tracks.map((track) => (
                <div
                    key={track.id}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
                >
                    {/* Row */}
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[var(--color-text)]">{track.title}</p>
                            <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">
                                {track.category}
                                {track.bpm ? ` · ${track.bpm} bpm` : ''}
                                {track.key ? ` · ${track.key} ${track.keyMode ?? ''}`.trimEnd() : ''}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                onClick={() => setEditing(editing === track.id ? null : track.id)}
                                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                            >
                                {editing === track.id ? 'Cancel' : 'Edit'}
                            </button>
                            <button
                                onClick={() => handleDelete(track.id)}
                                disabled={deleting === track.id}
                                className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-500/30 hover:bg-red-500/5 disabled:opacity-40"
                            >
                                {deleting === track.id ? '…' : 'Delete'}
                            </button>
                        </div>
                    </div>

                    {/* Inline edit form */}
                    {editing === track.id && (
                        <div className="border-t border-[var(--color-border)] px-4 py-4">
                            <TrackForm
                                track={track}
                                onSuccess={() => {
                                    setEditing(null)
                                    refresh()
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
