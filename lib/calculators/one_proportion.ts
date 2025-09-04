/** One proportion vs p0 (normal approximation, no continuity correction) */
import { invNorm, normalCDF } from '../stats/distributions'
import type { Tail } from './t_independent'

export type OnePropInput = {
  alpha: number
  power?: number
  n?: number
  p: number // alternative proportion
  p0: number // null proportion
  tail: Tail
}

export type OnePropResult = { n: number; power: number }

function zAlpha(alpha: number, tail: Tail) {
  return tail === 'two-sided' ? invNorm(1 - alpha / 2) : invNorm(1 - alpha)
}

function checkP(p: number) { if (!(p > 0 && p < 1)) throw new Error('p in (0,1)') }

export function aprioriN(input: OnePropInput): OnePropResult {
  const { alpha, power, p, p0, tail } = input
  if (power === undefined) throw new Error('power required')
  checkP(p); checkP(p0)
  const zA = zAlpha(alpha, tail)
  const zB = invNorm(power)
  const diff = Math.abs(p - p0)
  const v = p * (1 - p)
  const n = Math.ceil(((zA + zB) ** 2) * v / (diff * diff))
  const pow = posthocPower({ alpha, p, p0, tail, n }).power
  return { n, power: pow }
}

export function posthocPower(input: OnePropInput): OnePropResult {
  const { alpha, p, p0, tail } = input
  const n = input.n ?? 0
  checkP(p); checkP(p0)
  if (n <= 1) throw new Error('n>1')
  const zA = zAlpha(alpha, tail)
  const se = Math.sqrt(p * (1 - p) / n)
  const delta = Math.abs(p - p0) / se
  const power = tail === 'two-sided'
    ? (normalCDF(-zA - delta) + (1 - normalCDF(zA - delta)))
    : (1 - normalCDF(zA - delta))
  return { n, power }
}

