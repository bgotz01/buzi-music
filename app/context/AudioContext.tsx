'use client'

import {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    useEffect,
} from 'react'
import type { Track } from '@/app/data/tracks'

interface AudioState {
    track: Track | null
    playing: boolean
    progress: number
    currentTime: number
    duration: number
    play: (track: Track, queue?: Track[]) => void
    pause: () => void
    resume: () => void
    next: () => void
    seek: (pct: number) => void
    setVolume: (vol: number) => void
    volume: number
    hasNext: boolean
}

const AudioContext = createContext<AudioState | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [track, setTrack] = useState<Track | null>(null)
    const [queue, setQueue] = useState<Track[]>([])
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolumeState] = useState(1)

    // Keep a ref to queue so the 'ended' handler always sees the latest value
    const queueRef = useRef<Track[]>([])
    const trackRef = useRef<Track | null>(null)
    queueRef.current = queue
    trackRef.current = track

    const playTrack = useCallback((newTrack: Track) => {
        const audio = audioRef.current
        if (!audio) return
        audio.src = newTrack.audioSrc
        audio.currentTime = 0
        setTrack(newTrack)
        setProgress(0)
        setCurrentTime(0)
        setDuration(0)
        audio.play()
    }, [])

    // Create the single audio element once
    useEffect(() => {
        const audio = new Audio()
        audio.preload = 'metadata'
        audio.volume = 1

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
            setProgress((audio.currentTime / audio.duration) * 100 || 0)
        }
        const onLoadedMetadata = () => setDuration(audio.duration)
        const onEnded = () => {
            // Auto-advance to next track in queue
            const q = queueRef.current
            const current = trackRef.current
            const idx = q.findIndex((t) => t.id === current?.id)
            if (idx !== -1 && idx < q.length - 1) {
                playTrack(q[idx + 1])
            } else {
                setPlaying(false)
                setProgress(0)
                setCurrentTime(0)
            }
        }
        const onPlay = () => setPlaying(true)
        const onPause = () => setPlaying(false)

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('loadedmetadata', onLoadedMetadata)
        audio.addEventListener('ended', onEnded)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)

        audioRef.current = audio

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('loadedmetadata', onLoadedMetadata)
            audio.removeEventListener('ended', onEnded)
            audio.removeEventListener('play', onPlay)
            audio.removeEventListener('pause', onPause)
            audio.pause()
            audio.src = ''
            audioRef.current = null
        }
    }, [playTrack])

    const play = useCallback((newTrack: Track, newQueue?: Track[]) => {
        const audio = audioRef.current
        if (!audio) return

        // Update queue if provided
        if (newQueue) setQueue(newQueue)

        if (trackRef.current?.id === newTrack.id) {
            audio.paused ? audio.play() : audio.pause()
            return
        }

        playTrack(newTrack)
    }, [playTrack])

    const next = useCallback(() => {
        const q = queueRef.current
        const current = trackRef.current
        const idx = q.findIndex((t) => t.id === current?.id)
        if (idx !== -1 && idx < q.length - 1) {
            playTrack(q[idx + 1])
        }
    }, [playTrack])

    const pause = useCallback(() => audioRef.current?.pause(), [])
    const resume = useCallback(() => audioRef.current?.play(), [])

    const seek = useCallback((pct: number) => {
        const audio = audioRef.current
        if (!audio || !audio.duration) return
        audio.currentTime = (pct / 100) * audio.duration
        setProgress(pct)
    }, [])

    const setVolume = useCallback((vol: number) => {
        if (audioRef.current) audioRef.current.volume = vol
        setVolumeState(vol)
    }, [])

    const hasNext = (() => {
        const idx = queue.findIndex((t) => t.id === track?.id)
        return idx !== -1 && idx < queue.length - 1
    })()

    return (
        <AudioContext.Provider value={{ track, playing, progress, currentTime, duration, play, pause, resume, next, seek, setVolume, volume, hasNext }}>
            {children}
        </AudioContext.Provider>
    )
}

export function useAudio() {
    const ctx = useContext(AudioContext)
    if (!ctx) throw new Error('useAudio must be used within AudioProvider')
    return ctx
}
