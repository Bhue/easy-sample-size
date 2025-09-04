/** Paired means (within), Z-approximation using dz = mean_diff / sd_diff */
import { invNorm, normalCDF } from '../stats/distributions'
import type { Tail } from './t_independent'

export type PairedMeansInput = {
  alpha: number
  power?: number
  n?: number
  dz: number
  tail: Tail
}

export type PairedMeansResult = { n: number; power: number }

function zAlpha(alpha: number, tail: Tail) {
  return tail === 'two-sided' ? invNorm(1 - alpha / 2) : invNorm(1 - alpha)
}

export function aprioriN(input: PairedMeansInput): PairedMeansResult {
  const { alpha, power, dz, tail } = input
  if (power === undefined) throw new Error('power required')
  if (!(dz > 0)) throw new Error('dz must be > 0')
  const zA = zAlpha(alpha, tail)
  const zB = invNorm(power)
  const n = Math.ceil(((zA + zB) ** 2) / (dz * dz))
  const p = posthocPower({ alpha, dz, tail, n }).power
  return { n, power: p }
}

export function posthocPower(input: PairedMeansInput): PairedMeansResult {
  const { alpha, dz, tail } = input
  const n = input.n ?? 0
  if (n <= 1) throw new Error('n must be > 1')
  const zA = zAlpha(alpha, tail)
  const delta = Math.abs(dz) * Math.sqrt(n)
  const p = tail === 'two-sided'
    ? (normalCDF(-zA - delta) + (1 - normalCDF(zA - delta)))
    : (1 - normalCDF(zA - delta))
  return { n, power: p }
}

