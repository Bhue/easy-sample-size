"use client"
import React, { useEffect, useState } from 'react'
import { getConsent, setConsent } from '../lib/telemetry'

export function TelemetryConsent() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const c = getConsent()
    setVisible(c === 'unset')
  }, [])
  if (!visible) return null
  return (
    <div className="fixed bottom-4 right-4 max-w-md card shadow-lg">
      <div className="font-medium mb-1">Allow anonymous analytics?</div>
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">We collect anonymous inputs and selections to improve calculators. No personal identifiers are recorded. You can change this later by clearing site data.</div>
      <div className="flex gap-2 justify-end">
        <button className="btn" onClick={() => { setConsent('denied'); setVisible(false) }}>No, thanks</button>
        <button className="btn" onClick={() => { setConsent('granted'); setVisible(false) }}>Allow</button>
      </div>
    </div>
  )
}

