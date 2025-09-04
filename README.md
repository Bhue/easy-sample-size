# Easy Sample Size

Client-side, production-ready power and sample-size calculators (G*Power-style) built with Next.js + TypeScript + Tailwind.

Features:

- Two means (a priori N, post hoc power), paired means, two proportions, correlation, one-way ANOVA (noncentral F), log-rank survival, cluster DEFF.
- Effect size helper, power curves, simple export buttons.
- Modular design to add calculators fast.

## Install

1) Node.js ≥ 18
2) Install deps:

   npm install

3) Run dev:

   npm run dev

4) Tests:

   npm test

## Validation Examples

- Two means: d=0.5, α=0.05 two-sided, power=0.8 → n1≈63, n2≈63 (z-approx; G*Power t-test gives 64 each). Achieved power ~0.802 with 63 each.
- Two proportions: p1=0.50, p2=0.60, α=0.05 two-sided, power=0.8 → n≈385 per group.
- Correlation: |r|=0.30, α=0.05 two-sided, power=0.8 → n≈85.
- One-way ANOVA: k=3, f=0.25, α=0.05, power=0.8 → N≈159 total (matches standard references/G*Power).
- Log-rank: HR=0.7, α=0.05 two-sided, power=0.8, equal allocation, event fraction e=0.6 → events≈247, total N≈412 (about half per arm).

See docs/methods.md for formulas and assumptions.

