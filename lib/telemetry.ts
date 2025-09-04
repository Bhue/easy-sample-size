"use client"
/** Lightweight client telemetry with consent and webhook forwarding.
 * - Stores an anonymous session id in localStorage.
 * - Respects a user consent flag in localStorage (telemetryConsent = 'granted'|'denied').
 * - Posts JSON to /api/telemetry if consent granted.
 */

export type TelemetryEvent = {
  type: string
  page?: string
  slug?: string
  payload?: any
  ts?: number
  sessionId?: string
}

const SID_KEY = 'ess_session_id'
const CONSENT_KEY = 'ess_telemetry_consent'

function sid(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(SID_KEY)
  if (!id) {
    id = crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
    localStorage.setItem(SID_KEY, id)
  }
  return id
}

export function getConsent(): 'granted' | 'denied' | 'unset' {
  if (typeof window === 'undefined') return 'unset'
  return (localStorage.getItem(CONSENT_KEY) as any) ?? 'unset'
}

export function setConsent(val: 'granted' | 'denied') {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONSENT_KEY, val)
}

export async function logEvent(evt: TelemetryEvent) {
  if (typeof window === 'undefined') return
  const consent = getConsent()
  if (consent !== 'granted') return
  const body: TelemetryEvent = { ...evt, ts: Date.now(), sessionId: sid() }
  try {
    await fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    })
  } catch (e) {
    // swallow errors
  }
}

