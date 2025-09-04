/** Multiple linear regression: Global R² test equivalent to f² = R²/(1−R²)
 * F-test with df1=p (predictors tested), df2=N−p−1, noncentral λ = f² (N − p − 1)
 */
import { fCDF } from '../stats/distributions'
import { bisection } from '../stats/rootfind'

export type RegGlobalInput = { alpha: number; power?: number; N?: number; p: number; f2: number }
export type RegGlobalResult = { N: number; df1: number; df2: number; power: number }

function ncfCDF_viaMixture(F: number, df1: number, df2: number, lambda: number): number {
  // Use the Poisson mixture from distributions.ts via fCDF; inline to avoid circular import
  const half = lambda / 2
  let sum = 0
  let term = Math.exp(-half)
  for (let i = 0; i < 5000; i++) {
    sum += term * fCDF(F, df1 + 2 * i, df2)
    term *= half / (i + 1)
    if (term < 1e-12) break
  }
  return sum
}

function invFCrit(p: number, df1: number, df2: number): number {
  const fn = (x: number) => fCDF(x, df1, df2) - p
  let lo = 0, hi = 1
  while (fn(hi) < 0) hi *= 2
  return bisection(fn, lo, hi, 1e-8, 200).root
}

export function powerGivenN(input: RegGlobalInput): RegGlobalResult {
  const { alpha, N = 0, p, f2 } = input
  if (p < 1) throw new Error('p>=1')
  if (N <= p + 1) throw new Error('N must exceed p+1')
  const df1 = p
  const df2 = N - p - 1
  const Fcrit = invFCrit(1 - alpha, df1, df2)
  const lambda = f2 * (N - p - 1)
  const power = 1 - ncfCDF_viaMixture(Fcrit, df1, df2, lambda)
  return { N, df1, df2, power }
}

export function aprioriN(input: RegGlobalInput): RegGlobalResult {
  const { alpha, power, p, f2 } = input
  if (power === undefined) throw new Error('power required')
  let N = Math.max(p + 3, 10)
  const target = power
  const fn = (n: number) => powerGivenN({ alpha, N: Math.round(n), p, f2 }).power - target
  let a = N
  let b = Math.max(50, a + 10)
  while (fn(b) < 0 && b < 1e6) b *= 2
  const res = bisection(fn, a, b, 1e-6, 200)
  const Ni = Math.ceil(res.root)
  return powerGivenN({ alpha, N: Ni, p, f2 })
}

