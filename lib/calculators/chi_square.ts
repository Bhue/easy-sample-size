/** Chi-square power using Cohen's w
 * - Goodness-of-fit: df = m-1
 * - RxC test: df = (r-1)(c-1)
 * Power via noncentral chi-square with λ = N w²
 */
import { chi2CDF, invNorm, ncx2CDF } from '../stats/distributions'

export type ChiGOFInput = { alpha: number; power?: number; N?: number; m: number; w: number }
export type ChiRxCInput = { alpha: number; power?: number; N?: number; r: number; c: number; w: number }

export type ChiResult = { N: number; df: number; power: number }

function critChi(alpha: number, df: number): number {
  // invert central chi-square via bisection
  let lo = 0, hi = df + 50
  const target = 1 - alpha
  const f = (x: number) => chi2CDF(x, df) - target
  while (f(hi) < 0) hi *= 2
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi)
    const val = f(mid)
    if (Math.abs(val) < 1e-8) return mid
    if (val < 0) lo = mid; else hi = mid
  }
  return 0.5 * (lo + hi)
}

export function powerGOF({ alpha, N = 0, m, w }: { alpha: number; N: number; m: number; w: number }): ChiResult {
  if (m < 2) throw new Error('m>=2')
  if (!(w > 0)) throw new Error('w>0')
  const df = m - 1
  const crit = critChi(alpha, df)
  const lambda = w * w * N
  const pow = 1 - ncx2CDF(crit, df, lambda)
  return { N, df, power: pow }
}

export function aprioriGOF(input: ChiGOFInput): ChiResult {
  const { alpha, power, m, w } = input
  if (power === undefined) throw new Error('power required')
  let N = Math.max(4, m * 5)
  while (powerGOF({ alpha, N, m, w }).power < power && N < 1e7) N = Math.ceil(N * 1.2)
  return powerGOF({ alpha, N, m, w })
}

export function powerRxC({ alpha, N, r, c, w }: { alpha: number; N: number; r: number; c: number; w: number }): ChiResult {
  const df = (r - 1) * (c - 1)
  if (df < 1) throw new Error('r,c must be >=2')
  const crit = critChi(alpha, df)
  const lambda = w * w * N
  const pow = 1 - ncx2CDF(crit, df, lambda)
  return { N, df, power: pow }
}

export function aprioriRxC(input: ChiRxCInput): ChiResult {
  const { alpha, power, r, c, w } = input
  if (power === undefined) throw new Error('power required')
  let N = Math.max(4, r * c * 5)
  while (powerRxC({ alpha, N, r, c, w }).power < power && N < 1e7) N = Math.ceil(N * 1.2)
  return powerRxC({ alpha, N, r, c, w })
}

