import { describe, it, expect } from 'vitest'
import { eventsRequired } from '../lib/calculators/logrank'

describe('Log-rank (two-arm)', () => {
  it('HR=0.7, alpha=0.05, power=0.8, equal arms, e=0.6', () => {
    const res = eventsRequired({ alpha: 0.05, power: 0.8, HR: 0.7, allocationRatio: 1, eventFraction: 0.6 })
    expect(res.events).toBeGreaterThanOrEqual(245)
    expect(res.events).toBeLessThanOrEqual(248)
    expect(res.totalN).toBeGreaterThanOrEqual(408)
    expect(res.totalN).toBeLessThanOrEqual(414)
  })
})

