/** Two proportions (unpooled Wald), allocation ratio k = n2/n1 */
import { invNorm, normalCDF } from '../stats/distributions'
import type { Tail } from './t_independent'

export type TwoPropsInput = {
  alpha: number
  power?: number
  n1?: number
  n2?: number
  p1: number
  p2: number
  tail: Tail
  allocationRatio?: number
}

export type TwoPropsResult = { n1: number; n2: number; total: number; power: number }

function zAlpha(alpha: number, tail: Tail) {
  return tail === 'two-sided' ? invNorm(1 - alpha / 2) : invNorm(1 - alpha)
}

function checkP(p: number) {
  if (!(p > 0 && p < 1)) throw new Error('probabilities must be in (0,1)')
}

export function aprioriN(input: TwoPropsInput): TwoPropsResult {
  const { alpha, power, p1, p2, tail } = input
  if (power === undefined) throw new Error('power required for a priori')
  checkP(p1); checkP(p2)
  const k = input.allocationRatio ?? 1
  if (!(k > 0)) throw new Error('allocation ratio must be > 0')
  const zA = zAlpha(alpha, tail)
  const zB = invNorm(power)
  const diff = Math.abs(p1 - p2)
  const v = (p1 * (1 - p1) + p2 * (1 - p2) / k)
  const n1 = Math.ceil(((zA + zB) ** 2) * v / (diff * diff))
  const n2 = Math.ceil(k * n1)
  const pow = posthocPower({ alpha, p1, p2, tail, n1, n2 }).power
  return { n1, n2, total: n1 + n2, power: pow }
}

export function posthocPower(input: TwoPropsInput): TwoPropsResult {
  const { alpha, p1, p2, tail } = input
  const n1 = input.n1 ?? 0
  const n2 = input.n2 ?? 0
  checkP(p1); checkP(p2)
  if (n1 <= 1 || n2 <= 1) throw new Error('n1 and n2 must be > 1')
  const zA = zAlpha(alpha, tail)
  const se = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2)
  const delta = Math.abs(p1 - p2) / se
  const p = tail === 'two-sided'
    ? (normalCDF(-zA - delta) + (1 - normalCDF(zA - delta)))
    : (1 - normalCDF(zA - delta))
  return { n1, n2, total: n1 + n2, power: p }
}

