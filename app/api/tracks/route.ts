import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Track } from '@/app/data/tracks'

export async function GET() {
    const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map snake_case DB columns → camelCase Track type
    const tracks: Track[] = (data ?? []).map(dbToTrack)
    return NextResponse.json(tracks)
}

export async function POST(req: Request) {
    const body = await req.json()
    const { title, category, bpm, key, keyMode, thumbnail, audioSrc, duration, tags } = body

    const validCategories = ['brazil phonk', 'reggaeton', 'house', 'pop', 'funk']
    if (!title || !audioSrc || !category || !validCategories.includes(category)) {
        return NextResponse.json(
            { error: 'title, category (brazil phonk | reggaeton | house | pop | funk), and audioSrc are required' },
            { status: 400 },
        )
    }

    const { data, error } = await supabase
        .from('tracks')
        .insert({
            title: String(title).trim(),
            category,
            bpm: bpm ? Number(bpm) : null,
            key: key || null,
            key_mode: keyMode || null,
            thumbnail: thumbnail ? String(thumbnail).trim() : null,
            audio_src: String(audioSrc).trim(),
            duration: duration ? Number(duration) : null,
            tags: Array.isArray(tags) ? tags : null,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(dbToTrack(data), { status: 201 })
}

export async function DELETE(req: Request) {
    const { id } = await req.json()
    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase.from('tracks').delete().eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('tracks')
        .update({
            ...(updates.title !== undefined && { title: String(updates.title).trim() }),
            ...(updates.category !== undefined && { category: updates.category }),
            ...(updates.bpm !== undefined && { bpm: updates.bpm ? Number(updates.bpm) : null }),
            ...(updates.key !== undefined && { key: updates.key || null }),
            ...(updates.keyMode !== undefined && { key_mode: updates.keyMode || null }),
            ...(updates.thumbnail !== undefined && { thumbnail: updates.thumbnail || null }),
            ...(updates.audioSrc !== undefined && { audio_src: String(updates.audioSrc).trim() }),
            ...(updates.duration !== undefined && { duration: updates.duration ? Number(updates.duration) : null }),
            ...(updates.tags !== undefined && { tags: Array.isArray(updates.tags) ? updates.tags : null }),
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(dbToTrack(data))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToTrack(row: any): Track {
    return {
        id: row.id,
        title: row.title,
        category: row.category,
        bpm: row.bpm ?? undefined,
        key: row.key ?? undefined,
        keyMode: row.key_mode ?? undefined,
        thumbnail: row.thumbnail ?? undefined,
        audioSrc: row.audio_src,
        duration: row.duration ?? undefined,
        tags: row.tags ?? undefined,
        createdAt: row.created_at,
    }
}
