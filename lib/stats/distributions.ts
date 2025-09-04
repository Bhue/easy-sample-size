/**
 * Statistical distributions and utilities.
 *
 * - Normal CDF and inverse (Acklam approximation)
 * - Gamma functions (Lanczos), regularized incomplete gamma
 * - Beta functions, regularized incomplete beta via continued fraction
 * - Central F CDF via incomplete beta
 * - Noncentral F CDF via Poisson mixture of central F
 *
 * References:
 * - Abramowitz & Stegun (1964)
 * - AS241 (Wichura) idea; we use Acklam's approximation for invNorm.
 * - Lentz’s algorithm for continued fractions (betacf)
 * - Johnson, Kotz, Balakrishnan (Continuous Univariate Distributions)
 */

export function erf(x: number): number {
  // Abramowitz-Stegun 7.1.26 approximation
  const sign = Math.sign(x)
  x = Math.abs(x)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * x)
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return sign * y
}

export function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2))
}

export function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

// Acklam's inverse normal approximation
export function invNorm(p: number): number {
  if (p <= 0 || p >= 1) {
    if (p === 0) return -Infinity
    if (p === 1) return Infinity
    throw new Error('invNorm: p must be in (0,1)')
  }
  const a = [
    -3.969683028665376e+01,
    2.209460984245205e+02,
    -2.759285104469687e+02,
    1.383577518672690e+02,
    -3.066479806614716e+01,
    2.506628277459239e+00,
  ]
  const b = [
    -5.447609879822406e+01,
    1.615858368580409e+02,
    -1.556989798598866e+02,
    6.680131188771972e+01,
    -1.328068155288572e+01,
  ]
  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
    4.374664141464968e+00,
    2.938163982698783e+00,
  ]
  const d = [
    7.784695709041462e-03,
    3.224671290700398e-01,
    2.445134137142996e+00,
    3.754408661907416e+00,
  ]

  const plow = 0.02425
  const phigh = 1 - plow
  let q: number, r: number
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p))
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  if (phigh < p) {
    q = Math.sqrt(-2 * Math.log(1 - p))
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  q = p - 0.5
  r = q * q
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
}

// Lanczos approximation for log-gamma
export function gammaln(z: number): number {
  const g = 7
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ]
  if (z < 0.5) {
    // Reflection formula
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - gammaln(1 - z)
  }
  z -= 1
  let x = p[0]
  for (let i = 1; i < p.length; i++) x += p[i] / (z + i)
  const t = z + g + 0.5
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
}

export function beta(a: number, b: number): number {
  return Math.exp(gammaln(a) + gammaln(b) - gammaln(a + b))
}

// Continued fraction for regularized incomplete beta
function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200
  const EPS = 3e-14
  const FPMIN = 1e-300
  let qab = a + b
  let qap = a + 1
  let qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < FPMIN) d = FPMIN
  d = 1 / d
  let h = d
  for (let m = 1, m2 = 2; m <= MAXIT; m++, m2 += 2) {
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    h *= d * c
    aa = -((a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < EPS) break
  }
  return h
}

export function regIncompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bt = Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x))
  let result: number
  if (x < (a + 1) / (a + b + 2)) {
    result = (bt * betacf(a, b, x)) / a
  } else {
    result = 1 - (bt * betacf(b, a, 1 - x)) / b
  }
  return result
}

// Regularized lower incomplete gamma P(a,x) using series or continued fraction
export function regIncompleteGamma(a: number, x: number): number {
  if (x <= 0) return 0
  if (x < a + 1) {
    // series representation
    let ap = a
    let sum = 1 / a
    let del = sum
    for (let n = 1; n <= 200; n++) {
      ap += 1
      del *= x / ap
      sum += del
      if (Math.abs(del) < Math.abs(sum) * 1e-14) break
    }
    return sum * Math.exp(-x + a * Math.log(x) - gammaln(a))
  } else {
    // continued fraction (Lentz)
    const MAXIT = 200
    const EPS = 1e-14
    const FPMIN = 1e-300
    let b0 = x + 1 - a
    let c = 1 / FPMIN
    let d = 1 / b0
    let h = d
    for (let i = 1; i <= MAXIT; i++) {
      const an = -i * (i - a)
      b0 += 2
      d = an * d + b0
      if (Math.abs(d) < FPMIN) d = FPMIN
      c = b0 + an / c
      if (Math.abs(c) < FPMIN) c = FPMIN
      d = 1 / d
      const del = d * c
      h *= del
      if (Math.abs(del - 1) < EPS) break
    }
    const Q = Math.exp(-x + a * Math.log(x) - gammaln(a)) * h
    return 1 - Q
  }
}

export function chi2CDF(x: number, k: number): number {
  if (x <= 0) return 0
  return regIncompleteGamma(k / 2, x / 2)
}

export function ncx2CDF(x: number, k: number, lambda: number): number {
  // Poisson mixture of central chi-square
  const half = lambda / 2
  let sum = 0
  let term = Math.exp(-half)
  for (let i = 0; i < 5000; i++) {
    sum += term * chi2CDF(x, k + 2 * i)
    term *= half / (i + 1)
    if (term < 1e-12) break
  }
  return sum
}

export function fCDF(F: number, df1: number, df2: number): number {
  if (F <= 0) return 0
  const x = (df1 * F) / (df1 * F + df2)
  return regIncompleteBeta(x, df1 / 2, df2 / 2)
}

export function ncfCDF(F: number, df1: number, df2: number, lambda: number): number {
  // Poisson mixture of central F
  const maxTerms = 2000
  const eps = 1e-10
  const half = lambda / 2
  let sum = 0
  let term = Math.exp(-half)
  let i = 0
  while (i < maxTerms) {
    const cdf = fCDF(F, df1 + 2 * i, df2)
    sum += term * cdf
    // next Poisson weight
    i++
    term *= half / i
    if (term < eps) break
  }
  return sum
}
