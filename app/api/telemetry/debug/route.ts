import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const count = await prisma.event.count()
    const latest = await prisma.event.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    return NextResponse.json({ ok: true, count, latest })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}

