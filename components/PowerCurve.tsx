"use client"
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export type PowerPoint = { x: number; power: number }

export function PowerCurve({ data, xLabel = 'N', yLabel = 'Power' }: { data: PowerPoint[]; xLabel?: string; yLabel?: string }) {
  return (
    <div className="card">
      <div className="font-semibold mb-2">Power Curve</div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
            <YAxis domain={[0, 1]} tickFormatter={(v) => v.toFixed(2)} label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(v: any) => (typeof v === 'number' ? v.toFixed(3) : v)} />
            <Line type="monotone" dataKey="power" stroke="#2563eb" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

