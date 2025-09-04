import { describe, it, expect } from 'vitest'
import { aprioriN, posthocPower } from '../lib/calculators/two_proportions'

describe('Two proportions (unpooled)', () => {
  it('a priori N for p1=0.5, p2=0.6, 80% power, alpha=0.05', () => {
    const res = aprioriN({ alpha: 0.05, power: 0.8, p1: 0.5, p2: 0.6, tail: 'two-sided', allocationRatio: 1 })
    // Reference: ~385 per group
    expect(res.n1).toBeGreaterThanOrEqual(384)
    expect(res.n1).toBeLessThanOrEqual(386)
  })
  it('post hoc power increases with N', () => {
    const p1 = posthocPower({ alpha: 0.05, p1: 0.5, p2: 0.6, tail: 'two-sided', n1: 200, n2: 200 }).power
    const p2 = posthocPower({ alpha: 0.05, p1: 0.5, p2: 0.6, tail: 'two-sided', n1: 400, n2: 400 }).power
    expect(p2).toBeGreaterThan(p1)
  })
})

