"use client"
import React from 'react'

export function ExportButtons({ onExportCSV }: { onExportCSV?: () => void }) {
  return (
    <div className="flex gap-2">
      <button className="btn" onClick={onExportCSV}>Export CSV</button>
      <button className="btn" onClick={() => window.print()}>Export PDF (Print)</button>
      <button className="btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>Share URL</button>
      <button className="btn" onClick={() => window.location.assign(window.location.pathname)}>Reset</button>
    </div>
  )
}

