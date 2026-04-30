export type Category = 'brazil phonk' | 'reggaeton' | 'house' | 'pop' | 'funk'

export type MusicalKey =
    | 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb'
    | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#'
    | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'

export type KeyMode = 'major' | 'minor'

export interface Track {
    id: string
    title: string
    category: Category
    bpm?: number
    key?: MusicalKey
    keyMode?: KeyMode
    /** Path to image in /public, or an external URL */
    thumbnail?: string
    /** Direct audio URL — Supabase Storage, self-hosted, etc. */
    audioSrc: string
    duration?: number   // seconds, detected from audio metadata
    tags?: string[]
    createdAt: string   // ISO date string
}
