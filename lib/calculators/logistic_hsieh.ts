/** Logistic regression (single predictor) — TODO
 * Placeholder for Hsieh (1989, 1998) approximations.
 */

export type LogisticHsiehInput = {
  alpha: number
  power?: number
  n?: number
  OR: number // odds ratio for 1 SD change or binary predictor
  pEvent: number // baseline event proportion
  predictorType: 'binary' | 'continuous'
  propExposed?: number // if binary
  sdX?: number // if continuous
}

export type LogisticHsiehResult = { n?: number; power?: number; note: string }

export function aprioriN(_input: LogisticHsiehInput): LogisticHsiehResult {
  return { note: 'TODO: Implement Hsieh method. Use two-proportions when predictor is binary.' }
}

export function posthocPower(_input: LogisticHsiehInput): LogisticHsiehResult {
  return { note: 'TODO: Implement Hsieh method' }
}

