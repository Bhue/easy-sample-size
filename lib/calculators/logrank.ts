/** Log-rank two-arm study (Schoenfeld/Freedman approximation)
 * N is implied from required number of events D and event fraction e.
 *
 * References: Schoenfeld (1981); Freedman (1982); Lachin (2011).
 */
import { invNorm } from '../stats/distributions'

export type LogRankInput = {
  alpha: number
  power?: number
  HR: number // hazard ratio (group2/group1)
  allocationRatio?: number // k = n2/n1
  eventFraction?: number // overall proportion of subjects with event during study (0-1)
}

export type LogRankResult = {
  events: number
  totalN?: number
  n1?: number
  n2?: number
}

export function eventsRequired(input: LogRankInput): LogRankResult {
  const { alpha, power, HR } = input
  if (power === undefined) throw new Error('power required')
  if (!(HR > 0)) throw new Error('HR must be > 0')
  const k = input.allocationRatio ?? 1
  const p1 = 1 / (1 + k)
  const p2 = k / (1 + k)
  const psi = p1 * p2
  const zA = invNorm(1 - alpha / 2)
  const zB = invNorm(power)
  const logHR = Math.log(HR)
  const D = Math.ceil(((zA + zB) ** 2) / (psi * logHR * logHR))
  const e = input.eventFraction
  if (e && e > 0 && e <= 1) {
    const totalN = Math.ceil(D / e)
    const n1 = Math.ceil(totalN * p1)
    const n2 = totalN - n1
    return { events: D, totalN, n1, n2 }
  }
  return { events: D }
}

