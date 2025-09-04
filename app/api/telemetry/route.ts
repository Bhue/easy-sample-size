import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    // Basic allowlist of fields; drop anything unexpected
    const payload = {
      type: String(data?.type || ''),
      page: data?.page ? String(data.page) : undefined,
      slug: data?.slug ? String(data.slug) : undefined,
      payload: data?.payload ?? undefined,
      ts: Number(data?.ts || Date.now()),
      sessionId: data?.sessionId ? String(data.sessionId) : undefined,
      ua: req.headers.get('user-agent') || undefined,
    }

    // Persist to database
    await prisma.event.create({
      data: {
        ts: BigInt(payload.ts),
        type: payload.type,
        slug: payload.slug,
        page: payload.page,
        sessionId: payload.sessionId,
        ua: payload.ua,
        payload: payload.payload,
      },
    })

    const webhook = process.env.TELEMETRY_WEBHOOK_URL
    if (webhook) {
      // Forward to webhook as JSON; ignore response status
      await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
