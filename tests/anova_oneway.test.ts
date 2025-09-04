import { describe, it, expect } from 'vitest'
import { aprioriN, powerGivenN } from '../lib/calculators/anova_oneway'

describe('One-way ANOVA (f)', () => {
  it('a priori N for k=3, f=0.25, 80% power, alpha=0.05 ~ 159', () => {
    const res = aprioriN({ alpha: 0.05, power: 0.8, k: 3, f: 0.25 })
    expect(res.N).toBeGreaterThanOrEqual(158)
    expect(res.N).toBeLessThanOrEqual(160)
  })
  it('power increases with N', () => {
    const p1 = powerGivenN({ alpha: 0.05, N: 120, k: 3, f: 0.25 }).power
    const p2 = powerGivenN({ alpha: 0.05, N: 200, k: 3, f: 0.25 }).power
    expect(p2).toBeGreaterThan(p1)
  })
})

