'use client'

import { useState, useEffect } from 'react'
import { useAudio } from '@/app/context/AudioContext'
import type { Track } from '@/app/data/tracks'

export default function TrackRow({ track, index, queue, linked }: { track: Track; index: number; queue?: Track[]; linked?: boolean }) {
    const { play, track: currentTrack, playing } = useAudio()
    const [copied, setCopied] = useState(false)
    const [showLinkedBadge, setShowLinkedBadge] = useState(!!linked)

    const isActive = currentTrack?.id === track.id
    const isPlaying = isActive && playing
    const isLinkedIdle = linked && !isActive

    const keyLabel = track.key ? `${track.key} ${track.keyMode ?? ''}`.trim() : '—'

    // Fade out the "shared" badge after 4 s
    useEffect(() => {
        if (!linked) return
        const t = setTimeout(() => setShowLinkedBadge(false), 4000)
        return () => clearTimeout(t)
    }, [linked])

    function handleShare() {
        const url = `${window.location.origin}/music?track=${track.id}`
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    function fmt(secs: number) {
        if (!secs || isNaN(secs)) return ''
        const m = Math.floor(secs / 60)
        const s = Math.floor(secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    return (
        <div
            id={`track-${track.id}`}
            className={`group relative grid items-center gap-4 rounded-xl px-4 py-3 transition-all
                grid-cols-[2rem_1fr_auto]
                sm:grid-cols-[2rem_1fr_8rem_5rem_5rem_4rem_5rem]
                ${isActive
                    ? 'bg-[var(--color-bg-subtle)]'
                    : isLinkedIdle
                        ? 'bg-[var(--color-accent)]/[0.07]'
                        : 'hover:bg-[var(--color-bg-subtle)]'
                }`}
        >
            {/* Left accent bar for linked track */}
            {isLinkedIdle && (
                <span className="pointer-events-none absolute inset-y-2 left-0 w-[3px] rounded-full bg-[var(--color-accent)]" />
            )}

            {/* Col 1 — Play / pause button */}
            <button
                onClick={() => play(track, queue)}
                aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150
                    ${isActive
                        ? 'bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/30'
                        : isLinkedIdle
                            ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white hover:shadow-md hover:shadow-[var(--color-accent)]/30'
                            : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:text-white hover:shadow-md hover:shadow-[var(--color-accent)]/30'
                    }`}
            >
                {isPlaying ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
            </button>

            {/* Col 2 — Title + tags + mobile meta */}
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`truncate text-sm font-medium ${isActive || isLinkedIdle ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
                        {track.title}
                    </p>
                    {showLinkedBadge && (
                        <span className="shrink-0 rounded-md border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                            shared
                        </span>
                    )}
                </div>

                {/* Mobile-only subtitle: category · key · bpm · duration */}
                <p className="mt-0.5 text-xs text-[var(--color-text-subtle)] sm:hidden">
                    {[
                        track.category,
                        keyLabel !== '—' ? keyLabel : null,
                        track.bpm ? `${track.bpm} bpm` : null,
                        track.duration ? fmt(track.duration) : null,
                    ].filter(Boolean).join(' · ')}
                </p>

                {track.tags && track.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                        {track.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-md bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-xs text-[var(--color-text-subtle)]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Col 3 — Category (desktop only) */}
            <span className="hidden truncate text-sm text-[var(--color-text-subtle)] sm:block">
                {track.category}
            </span>

            {/* Col 4 — Key (desktop only) */}
            <span className="hidden text-sm tabular-nums text-[var(--color-text-subtle)] sm:block">
                {keyLabel}
            </span>

            {/* Col 5 — BPM (desktop only) */}
            <span className="hidden text-sm tabular-nums text-[var(--color-text-subtle)] sm:block">
                {track.bpm ? `${track.bpm} bpm` : '—'}
            </span>

            {/* Col 6 — Duration (desktop only) */}
            <DurationCell track={track} />

            {/* Col 7 — Share (always visible) */}
            <button
                onClick={handleShare}
                aria-label={copied ? 'Link copied' : `Copy link to ${track.title}`}
                className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium transition-all ${copied
                    ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : isLinkedIdle
                        ? 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20'
                        : 'border-[var(--color-border)] text-[var(--color-text-subtle)] sm:border-transparent sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:border-[var(--color-border)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5'
                    }`}
            >
                {copied ? (
                    <>
                        <CheckIcon size={11} />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <LinkIcon size={11} />
                        <span>Share</span>
                    </>
                )}
            </button>
        </div>
    )
}

// Duration cell — uses stored value, falls back to live duration when active
function DurationCell({ track }: { track: Track }) {
    const { track: currentTrack, duration: liveDuration } = useAudio()
    const isActive = currentTrack?.id === track.id

    function fmt(secs: number) {
        if (!secs || isNaN(secs)) return '—'
        const m = Math.floor(secs / 60)
        const s = Math.floor(secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const secs = isActive ? liveDuration : track.duration
    return (
        <span className="hidden text-sm tabular-nums text-[var(--color-text-subtle)] sm:block">
            {fmt(secs ?? 0)}
        </span>
    )
}

function PlayIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    )
}

function PauseIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    )
}

function LinkIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    )
}

function CheckIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
