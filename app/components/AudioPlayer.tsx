'use client'

import { useAudio } from '@/app/context/AudioContext'

export default function AudioPlayer() {
    const { track, playing, progress, currentTime, duration, pause, resume, next, seek, setVolume, volume, hasNext } = useAudio()

    if (!track) return null

    function fmt(secs: number) {
        if (!secs || isNaN(secs)) return '0:00'
        const m = Math.floor(secs / 60)
        const s = Math.floor(secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            {/* Thin progress bar at very top of player */}
            <div className="relative h-0.5 w-full bg-[var(--color-border)]">
                <div
                    className="absolute inset-y-0 left-0 bg-[var(--color-accent)] transition-none"
                    style={{ width: `${progress}%` }}
                />
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={progress}
                    onChange={(e) => seek(Number(e.target.value))}
                    aria-label="Seek"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
            </div>

            <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">

                {/* Track info */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--color-text)]">
                        {track.title}
                    </p>
                    <p className="truncate text-xs text-[var(--color-text-subtle)]">
                        {track.category}
                        {track.key ? ` · ${track.key} ${track.keyMode ?? ''}`.trimEnd() : ''}
                        {track.bpm ? ` · ${track.bpm} bpm` : ''}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <span className="hidden text-xs tabular-nums text-[var(--color-text-subtle)] sm:block">
                        {fmt(currentTime)}
                    </span>

                    <button
                        onClick={playing ? pause : resume}
                        aria-label={playing ? 'Pause' : 'Play'}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>

                    <button
                        onClick={next}
                        disabled={!hasNext}
                        aria-label="Next track"
                        className="text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)] disabled:opacity-30"
                    >
                        <NextIcon />
                    </button>

                    <span className="hidden text-xs tabular-nums text-[var(--color-text-subtle)] sm:block">
                        {fmt(duration)}
                    </span>
                </div>

                {/* Volume */}
                <div className="hidden items-center gap-2 sm:flex">
                    <VolumeIcon muted={volume === 0} />
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        aria-label="Volume"
                        className="w-20 cursor-pointer accent-[var(--color-accent)]"
                    />
                </div>

            </div>
        </div>
    )
}

function PlayIcon() {
    return (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    )
}

function PauseIcon() {
    return (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    )
}

function VolumeIcon({ muted }: { muted: boolean }) {
    return muted ? (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-subtle)]" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
    ) : (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-subtle)]" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
    )
}

function NextIcon() {
    return (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 15,12 5,21" />
            <rect x="17" y="3" width="2.5" height="18" rx="1" />
        </svg>
    )
}
