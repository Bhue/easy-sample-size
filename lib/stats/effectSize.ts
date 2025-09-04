/** Effect size conversions and helpers */

export function dFromMeans(mean1: number, mean2: number, sdPooled: number): number {
  if (sdPooled <= 0) throw new Error('sdPooled must be > 0')
  return (mean1 - mean2) / sdPooled
}

export function fFromEta2(eta2: number): number {
  if (eta2 <= 0 || eta2 >= 1) throw new Error('eta^2 must be in (0,1)')
  return Math.sqrt(eta2 / (1 - eta2))
}

export function fFromPartialEta2(partialEta2: number): number {
  return fFromEta2(partialEta2) // identical under fixed-factor one-way ANOVA
}

export function f2FromR2(R2: number): number {
  if (R2 <= 0 || R2 >= 1) throw new Error('R^2 must be in (0,1)')
  return R2 / (1 - R2)
}

export function rFromD(d: number): number {
  return d / Math.sqrt(d * d + 4)
}

export function dFromR(r: number): number {
  return (2 * r) / Math.sqrt(1 - r * r)
}

export function fisherZ(r: number): number {
  if (r <= -1 || r >= 1) throw new Error('r must be in (-1,1)')
  return 0.5 * Math.log((1 + r) / (1 - r))
}

