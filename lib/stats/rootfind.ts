export type RootResult = { root: number; iters: number; converged: boolean }

export function bisection(fn: (x: number) => number, a: number, b: number, tol = 1e-7, maxIters = 200): RootResult {
  let fa = fn(a)
  let fb = fn(b)
  if (isNaN(fa) || isNaN(fb)) throw new Error('bisection: NaN function value')
  if (fa === 0) return { root: a, iters: 0, converged: true }
  if (fb === 0) return { root: b, iters: 0, converged: true }
  if (fa * fb > 0) throw new Error('bisection: f(a) and f(b) must have opposite signs')
  let iters = 0
  while (iters < maxIters) {
    const c = 0.5 * (a + b)
    const fc = fn(c)
    if (Math.abs(fc) < tol || 0.5 * (b - a) < tol) {
      return { root: c, iters, converged: true }
    }
    if (fa * fc < 0) {
      b = c; fb = fc
    } else {
      a = c; fa = fc
    }
    iters++
  }
  return { root: 0.5 * (a + b), iters, converged: false }
}

