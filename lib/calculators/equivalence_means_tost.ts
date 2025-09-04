/** Equivalence / Non-inferiority for two independent means (TOST)
 * Z-approximation with standardized margin d0 = Δ/σ (user supplies d0)
 * Equal-variance, allocation ratio k = n2/n1
 */
import { invNorm, normalCDF } from '../stats/distributions'

export type TOSTInput = {
  alpha: number // usually split across two one-sided tests: use alpha as is
  power?: number
  n1?: number
  n2?: number
  d0: number // standardized margin Δ/σ (positive)
  trueDiffD?: number // true standardized diff; default 0 for equivalence
  allocationRatio?: number
  type: 'equivalence' | 'noninferiority'
}

export type TOSTResult = { n1: number; n2: number; total: number; power: number }

function calcPower(n1: number, n2: number, alpha: number, d0: number, trueD: number, type: 'equivalence' | 'noninferiority'): number {
  const se = Math.sqrt(1 / n1 + 1 / n2)
  const zA = invNorm(1 - alpha)
  if (type === 'noninferiority') {
    // H0: μ1 - μ2 <= -d0 vs H1: > -d0 (assume positive margin direction)
    const z = (trueD + d0) / se
    return 1 - normalCDF(zA - z)
  } else {
    // Equivalence: TOST with margins ±d0; power = P(reject both one-sided)
    const z1 = (trueD + d0) / se
    const z2 = (d0 - trueD) / se
    const p1 = 1 - normalCDF(zA - z1)
    const p2 = 1 - normalCDF(zA - z2)
    return Math.min(p1, p2) // conservative approximation
  }
}

export function aprioriN(input: TOSTInput): TOSTResult {
  const { alpha, power, d0, allocationRatio = 1, type } = input
  if (power === undefined) throw new Error('power required')
  if (!(d0 > 0)) throw new Error('d0>0')
  const trueD = input.trueDiffD ?? 0
  // Start from z formula around (zA+zB)^2 * (1+1/k) / d0^2
  const zA = invNorm(1 - alpha)
  const zB = invNorm(power)
  const n1Start = Math.ceil(((zA + zB) ** 2) * (1 + 1 / allocationRatio) / (d0 * d0))
  let n1 = Math.max(4, n1Start)
  let n2 = Math.ceil(allocationRatio * n1)
  let pow = calcPower(n1, n2, alpha, d0, trueD, type)
  while (pow < power && n1 + n2 < 1e7) {
    n1 += 1
    n2 = Math.ceil(allocationRatio * n1)
    pow = calcPower(n1, n2, alpha, d0, trueD, type)
  }
  return { n1, n2, total: n1 + n2, power: pow }
}

export function posthocPower(input: TOSTInput): TOSTResult {
  const { alpha, n1 = 0, n2 = 0, d0, type } = input
  const trueD = input.trueDiffD ?? 0
  if (n1 <= 0 || n2 <= 0) throw new Error('n1,n2>0')
  const power = calcPower(n1, n2, alpha, d0, trueD, type)
  return { n1, n2, total: n1 + n2, power }
}

