/**
 * Two independent means (pooled SD), Z-approximation
 * A priori N and post hoc power
 *
 * References: Cohen (1988), Chow et al.
 */
import { invNorm, normalCDF } from '../stats/distributions'

export type Tail = 'two-sided' | 'one-sided'

export type TwoMeansInput = {
  alpha: number
  power?: number // for a-priori
  n1?: number
  n2?: number
  d: number // Cohen's d
  tail: Tail
  allocationRatio?: number // k = n2/n1
}

export type TwoMeansResult = {
  n1: number
  n2: number
  total: number
  power: number
}

function zAlpha(alpha: number, tail: Tail) {
  return tail === 'two-sided' ? invNorm(1 - alpha / 2) : invNorm(1 - alpha)
}

export function aprioriN(input: TwoMeansInput): TwoMeansResult {
  const { alpha, power, d, tail } = input
  if (power === undefined) throw new Error('power required for a priori')
  if (!(d > 0)) throw new Error('d must be > 0')
  const k = input.allocationRatio ?? 1
  if (!(k > 0)) throw new Error('allocation ratio must be > 0')
  const zA = zAlpha(alpha, tail)
  const zB = invNorm(power)
  const n1 = Math.ceil(((zA + zB) ** 2) * (1 + 1 / k) / (d * d))
  const n2 = Math.ceil(k * n1)
  const pow = posthocPower({ alpha, d, tail, n1, n2 }).power
  return { n1, n2, total: n1 + n2, power: pow }
}

export function posthocPower(input: TwoMeansInput): TwoMeansResult {
  const { alpha, d, tail } = input
  const n1 = input.n1 ?? 0
  const n2 = input.n2 ?? 0
  if (n1 <= 1 || n2 <= 1) throw new Error('n1 and n2 must be > 1')
  const zA = zAlpha(alpha, tail)
  const se = Math.sqrt(1 / n1 + 1 / n2)
  const delta = Math.abs(d) / se
  // two-sided rejection if |Z| > zA; power under N(δ,1)
  const p = tail === 'two-sided'
    ? (normalCDF(-zA - delta) + (1 - normalCDF(zA - delta)))
    : (1 - normalCDF(zA - delta))
  return { n1, n2, total: n1 + n2, power: p }
}

