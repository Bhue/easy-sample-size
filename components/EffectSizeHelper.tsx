"use client"
import React, { useState } from 'react'
import { dFromR, rFromD, f2FromR2, fFromEta2 } from '../lib/stats/effectSize'

export function EffectSizeHelper() {
  const [open, setOpen] = useState(false)
  const [d, setD] = useState('')
  const [r, setR] = useState('')
  const [eta2, setEta2] = useState('')
  const [R2, setR2] = useState('')
  return (
    <div>
      <button className="btn" onClick={() => setOpen(true)}>Effect Size Helper</button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="card max-w-xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Effect Size Helper</div>
              <button className="btn" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="label mb-1">d ↔ r</div>
                <div className="flex gap-2 mb-2">
                  <input className="input" placeholder="d" value={d} onChange={e => setD(e.target.value)} />
                  <button className="btn" onClick={() => {
                    const dv = parseFloat(d)
                    if (!isNaN(dv)) setR(rFromD(dv).toFixed(4))
                  }}>d→r</button>
                </div>
                <div className="flex gap-2">
                  <input className="input" placeholder="r" value={r} onChange={e => setR(e.target.value)} />
                  <button className="btn" onClick={() => {
                    const rv = parseFloat(r)
                    if (!isNaN(rv) && rv > -1 && rv < 1) setD(dFromR(rv).toFixed(4))
                  }}>r→d</button>
                </div>
              </div>
              <div>
                <div className="label mb-1">η² → f, R² → f²</div>
                <div className="flex gap-2 mb-2">
                  <input className="input" placeholder="η²" value={eta2} onChange={e => setEta2(e.target.value)} />
                  <button className="btn" onClick={() => {
                    const v = parseFloat(eta2)
                    if (!isNaN(v) && v > 0 && v < 1) alert(`f = ${fFromEta2(v).toFixed(4)}`)
                  }}>η²→f</button>
                </div>
                <div className="flex gap-2">
                  <input className="input" placeholder="R²" value={R2} onChange={e => setR2(e.target.value)} />
                  <button className="btn" onClick={() => {
                    const v = parseFloat(R2)
                    if (!isNaN(v) && v > 0 && v < 1) alert(`f² = ${f2FromR2(v).toFixed(4)}`)
                  }}>R²→f²</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

