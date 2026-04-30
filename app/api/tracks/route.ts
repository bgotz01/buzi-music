import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { Track } from '@/app/data/tracks'

const DATA_PATH = join(process.cwd(), 'data', 'tracks.json')

function readTracks(): Track[] {
    try {
        return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
    } catch {
        return []
    }
}

function writeTracks(tracks: Track[]) {
    writeFileSync(DATA_PATH, JSON.stringify(tracks, null, 2), 'utf-8')
}

export async function GET() {
    return NextResponse.json(readTracks())
}

export async function POST(req: Request) {
    const body = await req.json()

    const { title, category, bpm, key, keyMode, thumbnail, audioSrc, duration, tags } = body

    const validCategories = ['brazil phonk', 'reggaeton', 'house', 'pop', 'funk']
    if (!title || !audioSrc || !category || !validCategories.includes(category)) {
        return NextResponse.json(
            { error: 'title, category (brazil phonk | reggaeton | house | pop | funk), and audioSrc are required' },
            { status: 400 }
        )
    }

    const track: Track = {
        id: crypto.randomUUID(),
        title: String(title).trim(),
        category,
        bpm: bpm ? Number(bpm) : undefined,
        key: key || undefined,
        keyMode: keyMode || undefined,
        thumbnail: thumbnail ? String(thumbnail).trim() : undefined,
        audioSrc: String(audioSrc).trim(),
        duration: duration ? Number(duration) : undefined,
        tags: Array.isArray(tags) ? tags : undefined,
        createdAt: new Date().toISOString(),
    }

    const tracks = readTracks()
    tracks.unshift(track)   // newest first
    writeTracks(tracks)

    return NextResponse.json(track, { status: 201 })
}

export async function DELETE(req: Request) {
    const { id } = await req.json()
    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const tracks = readTracks().filter((t) => t.id !== id)
    writeTracks(tracks)

    return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const tracks = readTracks()
    const idx = tracks.findIndex((t) => t.id === id)

    if (idx === -1) {
        return NextResponse.json({ error: 'track not found' }, { status: 404 })
    }

    tracks[idx] = {
        ...tracks[idx],
        ...updates,
        bpm: updates.bpm ? Number(updates.bpm) : tracks[idx].bpm,
        key: updates.key || tracks[idx].key,
        id, // never overwrite id
        createdAt: tracks[idx].createdAt, // never overwrite createdAt
    }

    writeTracks(tracks)

    return NextResponse.json(tracks[idx])
}
