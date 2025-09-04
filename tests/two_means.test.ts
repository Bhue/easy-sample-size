import { describe, it, expect } from 'vitest'
import { aprioriN, posthocPower } from '../lib/calculators/t_independent'

describe('Two independent means (pooled SD)', () => {
  it('a priori N matches z-approx reference (d=0.5, 80% power, alpha=0.05 two-sided)', () => {
    const res = aprioriN({ alpha: 0.05, power: 0.8, d: 0.5, tail: 'two-sided', allocationRatio: 1 })
    // Z formula gives ~63 per group; allow ±1
    expect(res.n1).toBeGreaterThanOrEqual(62)
    expect(res.n1).toBeLessThanOrEqual(64)
  })
  it('post hoc power increases with N', () => {
    const p1 = posthocPower({ alpha: 0.05, d: 0.5, tail: 'two-sided', n1: 40, n2: 40 }).power
    const p2 = posthocPower({ alpha: 0.05, d: 0.5, tail: 'two-sided', n1: 80, n2: 80 }).power
    expect(p2).toBeGreaterThan(p1)
  })
})

