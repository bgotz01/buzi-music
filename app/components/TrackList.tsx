'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import TrackRow from './TrackRow'
import type { Track, Category } from '@/app/data/tracks'
import { useAudio } from '@/app/context/AudioContext'
import { useSearchParams } from 'next/navigation'

const CATEGORIES: Category[] = ['brazil phonk', 'reggaeton', 'house', 'pop', 'funk']

export default function TrackList({ tracks }: { tracks: Track[] }) {
    const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set())
    const [activeTags, setActiveTags] = useState<Set<string>>(new Set())
    const [search, setSearch] = useState('')
    const { play } = useAudio()
    const searchParams = useSearchParams()
    const didAutoPlay = useRef(false)

    // Collect all unique tags across all tracks, sorted alphabetically
    const allTags = useMemo(() => {
        const set = new Set<string>()
        tracks.forEach((t) => t.tags?.forEach((tag) => set.add(tag)))
        return [...set].sort()
    }, [tracks])

    // Highlight track from ?track= param on first load (no autoplay — browser blocks it)
    useEffect(() => {
        if (didAutoPlay.current) return
        const id = searchParams.get('track')
        if (!id) return
        const target = tracks.find((t) => t.id === id)
        if (!target) return
        didAutoPlay.current = true
        // Scroll the row into view after a short paint delay
        setTimeout(() => {
            document.getElementById(`track-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 150)
    }, [searchParams, tracks])

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

    function clearAll() {
        setActiveCategories(new Set())
        setActiveTags(new Set())
        setSearch('')
    }

    const filtered = tracks.filter((t) => {
        const catMatch = activeCategories.size === 0 || activeCategories.has(t.category)
        const tagMatch = activeTags.size === 0 || [...activeTags].every((tag) => t.tags?.includes(tag))
        const searchMatch = search.trim() === '' || t.title.toLowerCase().includes(search.trim().toLowerCase())
        return catMatch && tagMatch && searchMatch
    })

    const hasFilters = activeCategories.size > 0 || activeTags.size > 0 || search.trim() !== ''

    return (
        <div>
            {/* Search */}
            <div className="relative mb-6">
                <svg
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
                    width={14} height={14} viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tracks…"
                    aria-label="Search tracks"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-2 pl-9 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                    >
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Category toggles */}
            <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-subtle)]">Genre</p>
                <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Tag toggles — only shown if any tracks have tags */}
            {allTags.length > 0 && (
                <div className="mb-8">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-subtle)]">Tags</p>
                    <div className="flex flex-wrap gap-2">
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
                                onClick={clearAll}
                                className="rounded-full border border-transparent px-3 py-1 text-xs text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)]"
                            >
                                clear all
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Clear when no tags exist but categories are active */}
            {allTags.length === 0 && activeCategories.size > 0 && (
                <div className="mb-8">
                    <button
                        onClick={clearAll}
                        className="rounded-full border border-transparent px-4 py-1.5 text-sm text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)]"
                    >
                        clear
                    </button>
                </div>
            )}

            {/* Track list */}
            {filtered.length > 0 ? (
                <div>
                    <div className="mb-1 grid gap-4 px-4
                        grid-cols-[2rem_1fr_auto]
                        sm:grid-cols-[2rem_1fr_8rem_5rem_5rem_4rem_5rem]">
                        <span />
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)]">Title</span>
                        <span className="hidden text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)] sm:block">Category</span>
                        <span className="hidden text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)] sm:block">Key</span>
                        <span className="hidden text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)] sm:block">BPM</span>
                        <span className="hidden text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)] sm:block">Time</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)]">Share</span>
                    </div>
                    <div className="mb-2 border-t border-[var(--color-border)]" />
                    <div className="flex flex-col">
                        {filtered.map((track, i) => (
                            <TrackRow key={track.id} track={track} index={i} queue={filtered} linked={searchParams.get('track') === track.id} />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-[var(--color-text-subtle)]">
                    No tracks match the selected filters.
                </p>
            )}
        </div>
    )
}
