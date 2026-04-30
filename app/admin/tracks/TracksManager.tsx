'use client'

import { useMemo, useState } from 'react'
import TrackForm from '../components/TrackForm'
import type { Track, Category } from '@/app/data/tracks'

const CATEGORIES: Category[] = ['brazil phonk', 'reggaeton', 'house', 'pop', 'funk']

export default function TracksManager({ initial }: { initial: Track[] }) {
    const [tracks, setTracks] = useState<Track[]>(initial)
    const [editing, setEditing] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    // Filters
    const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set())
    const [activeTags, setActiveTags] = useState<Set<string>>(new Set())

    const allTags = useMemo(
        () => [...new Set(tracks.flatMap((t) => t.tags ?? []))].sort(),
        [tracks],
    )

    function toggleCategory(cat: Category) {
        setActiveCategories((prev) => {
            const next = new Set(prev)
            next.has(cat) ? next.delete(cat) : next.add(cat)
            return next
        })
    }

    function toggleTag(tag: string) {
        setActiveTags((prev) => {
            const next = new Set(prev)
            next.has(tag) ? next.delete(tag) : next.add(tag)
            return next
        })
    }

    function clearFilters() {
        setActiveCategories(new Set())
        setActiveTags(new Set())
    }

    const hasFilters = activeCategories.size > 0 || activeTags.size > 0

    const filtered = useMemo(() => {
        return tracks.filter((t) => {
            const catMatch = activeCategories.size === 0 || activeCategories.has(t.category)
            const tagMatch = activeTags.size === 0 || [...activeTags].every((tag) => t.tags?.includes(tag))
            return catMatch && tagMatch
        })
    }, [tracks, activeCategories, activeTags])

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
        <div>
            {/* Category filters */}
            <div className="mb-3 flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                    const on = activeCategories.has(cat)
                    return (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            aria-pressed={on}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${on
                                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                                : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                                }`}
                        >
                            {cat}
                        </button>
                    )
                })}
            </div>

            {/* Tag filters */}
            {allTags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                        const on = activeTags.has(tag)
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                aria-pressed={on}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${on
                                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                                    : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-subtle)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-muted)]'
                                    }`}
                            >
                                {tag}
                            </button>
                        )
                    })}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="rounded-full border border-transparent px-3 py-1 text-xs text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)]"
                        >
                            clear all
                        </button>
                    )}
                </div>
            )}

            {/* No-tag clear button */}
            {allTags.length === 0 && hasFilters && (
                <div className="mb-6">
                    <button
                        onClick={clearFilters}
                        className="rounded-full border border-transparent px-3 py-1 text-xs text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)]"
                    >
                        clear
                    </button>
                </div>
            )}

            {/* Track list */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <p className="text-sm text-[var(--color-text-subtle)]">
                        {hasFilters ? 'No tracks match the selected filters.' : 'No tracks yet.'}
                    </p>
                )}

                {filtered.map((track) => (
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
                                {track.tags && track.tags.length > 0 && (
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                        {track.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md bg-[var(--color-accent)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-accent)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
                                    allTags={allTags}
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
        </div>
    )
}
