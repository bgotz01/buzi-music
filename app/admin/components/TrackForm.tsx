'use client'

import { useState, useEffect, useRef } from 'react'
import type { Category, MusicalKey, KeyMode, Track } from '@/app/data/tracks'

const CATEGORIES: Category[] = ['brazil phonk', 'reggaeton', 'house', 'pop', 'funk']
const KEYS: MusicalKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const KEY_MODES: KeyMode[] = ['major', 'minor']

type FormState = {
    title: string
    category: Category
    bpm: string
    key: MusicalKey | ''
    keyMode: KeyMode
    audioSrc: string
    tags: string[]
}

function trackToForm(track?: Track): FormState {
    return {
        title: track?.title ?? '',
        category: track?.category ?? 'brazil phonk',
        bpm: track?.bpm?.toString() ?? '',
        key: track?.key ?? '',
        keyMode: track?.keyMode ?? 'minor',
        audioSrc: track?.audioSrc ?? '',
        tags: track?.tags ?? [],
    }
}

interface Props {
    track?: Track
    allTags?: string[]
    onSuccess?: () => void
}

export default function TrackForm({ track, allTags = [], onSuccess }: Props) {
    const isEdit = !!track
    const [form, setForm] = useState<FormState>(trackToForm(track))
    const [duration, setDuration] = useState<number | undefined>(track?.duration)
    const [durationStatus, setDurationStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState('')

    // Tag autocomplete state
    const [tagInput, setTagInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const tagInputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    const suggestions = tagInput.trim()
        ? allTags.filter(
            (t) =>
                t.toLowerCase().startsWith(tagInput.trim().toLowerCase()) &&
                !form.tags.map((x) => x.toLowerCase()).includes(t.toLowerCase()),
        )
        : []

    function addTag(tag: string) {
        const trimmed = tag.trim()
        if (!trimmed) return
        if (form.tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) return
        setForm((f) => ({ ...f, tags: [...f.tags, trimmed] }))
        setTagInput('')
        setShowSuggestions(false)
    }

    function removeTag(tag: string) {
        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
    }

    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            if (suggestions.length > 0) {
                addTag(suggestions[0])
            } else {
                addTag(tagInput)
            }
        } else if (e.key === 'Backspace' && tagInput === '' && form.tags.length > 0) {
            removeTag(form.tags[form.tags.length - 1])
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
        }
    }

    // Close suggestions on outside click
    useEffect(() => {
        function onMouseDown(e: MouseEvent) {
            if (
                !tagInputRef.current?.contains(e.target as Node) &&
                !suggestionsRef.current?.contains(e.target as Node)
            ) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', onMouseDown)
        return () => document.removeEventListener('mousedown', onMouseDown)
    }, [])

    function set(field: keyof FormState, value: string) {
        setForm((f) => ({ ...f, [field]: value }))
    }

    function detectDuration(url: string) {
        if (!url) return
        setDurationStatus('loading')
        setDuration(undefined)
        const audio = new Audio()
        audio.preload = 'metadata'
        audio.onloadedmetadata = () => {
            const secs = Math.round(audio.duration)
            setDuration(secs)
            setDurationStatus('done')
        }
        audio.onerror = () => setDurationStatus('error')
        audio.src = url
    }

    // Auto-detect on mount if editing a track that has no duration yet
    useEffect(() => {
        if (isEdit && !track.duration && track.audioSrc) {
            detectDuration(track.audioSrc)
        } else if (isEdit && track.duration) {
            setDurationStatus('done')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleAudioUrlChange(url: string) {
        set('audioSrc', url)
        detectDuration(url)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('loading')
        setError('')

        const payload = {
            ...(isEdit ? { id: track!.id } : {}),
            ...form,
            bpm: form.bpm ? Number(form.bpm) : undefined,
            key: form.key || undefined,
            duration: duration ?? undefined,
            tags: form.tags.length > 0 ? form.tags : undefined,
        }

        try {
            const res = await fetch('/api/tracks', {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error ?? 'Something went wrong')
            }

            setStatus('success')
            if (!isEdit) setForm(trackToForm())
            setTimeout(() => setStatus('idle'), 2500)
            onSuccess?.()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            setStatus('error')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <Field label="Title" required>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Midnight Loop"
                    required
                    className={inputCls}
                />
            </Field>

            <Field label="Category" required>
                <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value as Category)}
                    className={inputCls}
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                </select>
            </Field>

            <div className="grid grid-cols-3 gap-4">
                <Field label="BPM">
                    <input
                        type="number"
                        value={form.bpm}
                        onChange={(e) => set('bpm', e.target.value)}
                        placeholder="140"
                        min={40}
                        max={300}
                        className={inputCls}
                    />
                </Field>

                <Field label="Key">
                    <select
                        value={form.key}
                        onChange={(e) => set('key', e.target.value as MusicalKey | '')}
                        className={inputCls}
                    >
                        <option value="">—</option>
                        {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                </Field>

                <Field label="Mode">
                    <select
                        value={form.keyMode}
                        onChange={(e) => set('keyMode', e.target.value as KeyMode)}
                        className={inputCls}
                    >
                        {KEY_MODES.map((m) => (
                            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Audio URL" required hint="Paste the public Supabase Storage URL for the .mp3 file">
                <input
                    type="url"
                    value={form.audioSrc}
                    onChange={(e) => handleAudioUrlChange(e.target.value)}
                    placeholder="https://xxx.supabase.co/storage/v1/object/public/audio/track.mp3"
                    required
                    className={inputCls}
                />
                {durationStatus === 'loading' && (
                    <p className="text-xs text-[var(--color-text-subtle)]">Detecting duration…</p>
                )}
                {durationStatus === 'done' && duration && (
                    <p className="text-xs text-[var(--color-accent)]">✓ Duration detected: {fmt(duration)}</p>
                )}
                {durationStatus === 'error' && (
                    <p className="text-xs text-red-500">Could not detect duration — check the URL</p>
                )}
            </Field>

            <Field label="Tags" hint="Type a tag and press Enter or comma to add">
                <div className="relative">
                    {/* Chips + input */}
                    <div
                        className="flex min-h-[38px] flex-wrap gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2 py-1.5 transition-colors focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20"
                        onClick={() => tagInputRef.current?.focus()}
                    >
                        {form.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 rounded-md bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
                                    className="leading-none opacity-60 hover:opacity-100"
                                    aria-label={`Remove tag ${tag}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        <input
                            ref={tagInputRef}
                            type="text"
                            value={tagInput}
                            onChange={(e) => {
                                setTagInput(e.target.value)
                                setShowSuggestions(true)
                            }}
                            onKeyDown={handleTagKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder={form.tags.length === 0 ? 'world cup, guitar…' : ''}
                            className="min-w-[120px] flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
                        />
                    </div>

                    {/* Suggestions dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-lg"
                        >
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onMouseDown={(e) => { e.preventDefault(); addTag(s) }}
                                    className="w-full px-3 py-2 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Field>

            {status === 'error' && (
                <p role="alert" className="text-sm text-red-500">{error}</p>
            )}

            <button
                type="submit"
                disabled={status === 'loading'}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
            >
                {status === 'loading' ? 'Saving…' : status === 'success' ? '✓ Saved' : isEdit ? 'Save Changes' : 'Add Track'}
            </button>

        </form>
    )
}

function fmt(secs: number) {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text)]">
                {label}
                {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-[var(--color-text-subtle)]">{hint}</p>}
        </div>
    )
}

export const inputCls =
    'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20'
