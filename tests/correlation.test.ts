import { describe, it, expect } from 'vitest'
import { aprioriN, posthocPower } from '../lib/calculators/correlation'

describe('Correlation (rho=0)', () => {
  it('a priori N for r=0.3, 80% power, alpha=0.05', () => {
    const res = aprioriN({ alpha: 0.05, power: 0.8, r: 0.3, tail: 'two-sided' })
    expect(res.n).toBeGreaterThanOrEqual(84)
    expect(res.n).toBeLessThanOrEqual(86)
  })
  it('post hoc power increases with N', () => {
    const p1 = posthocPower({ alpha: 0.05, r: 0.3, tail: 'two-sided', n: 60 }).power
    const p2 = posthocPower({ alpha: 0.05, r: 0.3, tail: 'two-sided', n: 120 }).power
    expect(p2).toBeGreaterThan(p1)
  })
})

