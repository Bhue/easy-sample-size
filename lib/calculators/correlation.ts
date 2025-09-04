/** Correlation (test ρ = 0) using Fisher z transform */
import { invNorm, normalCDF } from '../stats/distributions'
import type { Tail } from './t_independent'

export type CorrInput = {
  alpha: number
  power?: number
  n?: number
  r: number // alternative correlation magnitude
  tail: Tail
}

export type CorrResult = { n: number; power: number }

function zAlpha(alpha: number, tail: Tail) {
  return tail === 'two-sided' ? invNorm(1 - alpha / 2) : invNorm(1 - alpha)
}

function fisherZ(r: number): number {
  if (!(r > -1 && r < 1)) throw new Error('r must be in (-1,1)')
  return 0.5 * Math.log((1 + r) / (1 - r))
}

export function aprioriN(input: CorrInput): CorrResult {
  const { alpha, power, r, tail } = input
  if (power === undefined) throw new Error('power required')
  const zA = zAlpha(alpha, tail)
  const zB = invNorm(power)
  const zr = Math.abs(fisherZ(r))
  const n = Math.ceil(((zA + zB) ** 2) / (zr * zr) + 3)
  const p = posthocPower({ alpha, r, tail, n }).power
  return { n, power: p }
}

export function posthocPower(input: CorrInput): CorrResult {
  const { alpha, r, tail } = input
  const n = input.n ?? 0
  if (n <= 3) throw new Error('n must be > 3')
  const zA = zAlpha(alpha, tail)
  const zr = Math.abs(fisherZ(r))
  const delta = zr * Math.sqrt(n - 3)
  const p = tail === 'two-sided'
    ? (normalCDF(-zA - delta) + (1 - normalCDF(zA - delta)))
    : (1 - normalCDF(zA - delta))
  return { n, power: p }
}

