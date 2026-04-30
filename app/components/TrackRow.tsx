'use client'

import { useAudio } from '@/app/context/AudioContext'
import type { Track } from '@/app/data/tracks'

export default function TrackRow({ track, index, queue }: { track: Track; index: number; queue?: Track[] }) {
    const { play, track: currentTrack, playing } = useAudio()

    const isActive = currentTrack?.id === track.id
    const isPlaying = isActive && playing

    const keyLabel = track.key ? `${track.key} ${track.keyMode ?? ''}`.trim() : '—'

    return (
        <div
            className={`group grid grid-cols-[2rem_1fr_auto] items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-[var(--color-bg-subtle)] sm:grid-cols-[2rem_1fr_8rem_5rem_5rem_auto] ${isActive ? 'bg-[var(--color-bg-subtle)]' : ''
                }`}
        >
            {/* Index / play button */}
            <button
                onClick={() => play(track, queue)}
                aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-accent)]"
            >
                {isPlaying ? (
                    <PauseIcon size={14} />
                ) : (
                    <>
                        <span className="text-sm tabular-nums group-hover:hidden">{index + 1}</span>
                        <span className="hidden group-hover:flex"><PlayIcon size={14} /></span>
                    </>
                )}
            </button>

            {/* Title + tags */}
            <div className="min-w-0">
                <p className={`truncate text-sm font-medium ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
                    {track.title}
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

            {/* Category */}
            <span className="hidden truncate text-sm text-[var(--color-text-subtle)] sm:block">
                {track.category}
            </span>

            {/* Key */}
            <span className="hidden text-sm tabular-nums text-[var(--color-text-subtle)] sm:block">
                {keyLabel}
            </span>

            {/* BPM */}
            <span className="hidden text-sm tabular-nums text-[var(--color-text-subtle)] sm:block">
                {track.bpm ? `${track.bpm} bpm` : '—'}
            </span>

            {/* Duration — pulled from audio context */}
            <DurationCell track={track} />
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
        <span className="text-sm tabular-nums text-[var(--color-text-subtle)]">
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
