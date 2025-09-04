/** One-way fixed-effect ANOVA (k groups) using Cohen's f and noncentral F */
import { fCDF, invNorm, ncfCDF } from '../stats/distributions'
import { bisection } from '../stats/rootfind'

export type ANOVAInput = {
  alpha: number
  power?: number
  N?: number // total sample size
  k: number // groups
  f: number // Cohen's f
}

export type ANOVAResult = { N: number; df1: number; df2: number; power: number }

export function powerGivenN(input: ANOVAInput): ANOVAResult {
  const { alpha, N = 0, k, f } = input
  if (k < 2) throw new Error('k must be >= 2')
  if (N <= k) throw new Error('N must be > k')
  if (!(f > 0)) throw new Error('f must be > 0')
  const df1 = k - 1
  const df2 = N - k
  const Fcrit = invFCritical(1 - alpha, df1, df2)
  const lambda = f * f * N
  const cdf = ncfCDF(Fcrit, df1, df2, lambda)
  const power = 1 - cdf
  return { N, df1, df2, power }
}

export function aprioriN(input: ANOVAInput): ANOVAResult {
  const { alpha, power, k, f } = input
  if (power === undefined) throw new Error('power required')
  const minN = Math.max(k + 2, 4)
  const target = power
  const fn = (N: number) => powerGivenN({ alpha, N: Math.round(N), k, f }).power - target
  // Find an upper bound
  let a = minN
  let b = Math.max(20, minN + 10)
  while (fn(b) < 0 && b < 100000) b *= 2
  const res = bisection(fn, a, b, 1e-6, 200)
  const Nint = Math.max(minN, Math.ceil(res.root))
  const out = powerGivenN({ alpha, N: Nint, k, f })
  return out
}

function invFCritical(p: number, df1: number, df2: number): number {
  // Invert central F CDF via simple bisection over a wide bracket.
  const fn = (x: number) => fCDF(x, df1, df2) - p
  let lo = 0
  let hi = 1
  while (fn(hi) < 0) hi *= 2
  const res = bisection(fn, lo, hi, 1e-8, 200)
  return res.root
}

