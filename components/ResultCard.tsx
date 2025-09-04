import React from 'react'

export function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="font-semibold mb-2">{title}</div>
      <div className="grid gap-2">{children}</div>
    </div>
  )
}

