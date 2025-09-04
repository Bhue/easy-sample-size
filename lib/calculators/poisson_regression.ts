/** Poisson regression (rate ratio) using normal approx on log(RR)
 * Variance of log(RR) ≈ 1/E1 + 1/E2, where E_i are expected event counts per arm.
 * For equal exposure per subject and equal n per arm, E_i = n * exposure * rate_i
 */
import { invNorm, normalCDF } from '../stats/distributions'

export type PoissonInput = {
  alpha: number
  power?: number
  n1?: number
  n2?: number
  exposure1: number
  exposure2: number
  rate1: number // baseline rate per exposure unit
  rate2: number // alternative rate per exposure unit
  allocationRatio?: number // k = n2/n1
}

export type PoissonResult = { n1: number; n2: number; total: number; power: number }

export function aprioriN(input: PoissonInput): PoissonResult {
  const { alpha, power, exposure1, exposure2, rate1, rate2 } = input
  if (power === undefined) throw new Error('power required')
  if (!(rate1 > 0 && rate2 > 0 && exposure1 > 0 && exposure2 > 0)) throw new Error('rates and exposures must be > 0')
  const k = input.allocationRatio ?? 1
  const zA = invNorm(1 - alpha / 2)
  const zB = invNorm(power)
  const RR = rate2 / rate1
  const d = Math.abs(Math.log(RR))
  // variance = 1/E1 + 1/E2 with E1 = n1*exp1*rate1, E2 = n2*exp2*rate2 = k*n1*exp2*rate2
  // Solve d / sqrt(1/(n1*exp1*rate1) + 1/(k*n1*exp2*rate2)) = zA + zB
  const A = 1 / (exposure1 * rate1) + 1 / (k * exposure2 * rate2)
  const n1 = Math.ceil(((zA + zB) ** 2) * A / (d * d))
  const n2 = Math.ceil(k * n1)
  const pow = posthocPower({ alpha, n1, n2, exposure1, exposure2, rate1, rate2 }).power
  return { n1, n2, total: n1 + n2, power: pow }
}

export function posthocPower(input: PoissonInput): PoissonResult {
  const { alpha, n1 = 0, n2 = 0, exposure1, exposure2, rate1, rate2 } = input
  if (n1 <= 0 || n2 <= 0) throw new Error('n1,n2>0')
  const RR = rate2 / rate1
  const d = Math.abs(Math.log(RR))
  const varLogRR = 1 / (n1 * exposure1 * rate1) + 1 / (n2 * exposure2 * rate2)
  const se = Math.sqrt(varLogRR)
  const zA = invNorm(1 - alpha / 2)
  const delta = d / se
  const power = normalCDF(-zA - delta) + (1 - normalCDF(zA - delta))
  return { n1, n2, total: n1 + n2, power }
}

