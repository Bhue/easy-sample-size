export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-2xl font-semibold mb-2">Easy Sample Size</h1>
        <p className="text-slate-600 dark:text-slate-300">Production-ready, client-side power and sample-size calculators. A G*Power-style experience with modern UX, effect-size helpers, power curves, and exportable reports.</p>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        <a href="/calculators" className="card">
          <h2 className="font-semibold mb-1">Calculators</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Browse tests: t, proportions, ANOVA, correlation, survival, and more.</p>
        </a>
        <a href="/glossary" className="card">
          <h2 className="font-semibold mb-1">Glossary</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Key terms: α, power, effect sizes (d, f, f², r), OR, RR, ICC.</p>
        </a>
        <a href="/about" className="card">
          <h2 className="font-semibold mb-1">About</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Methods, references, and limitations.</p>
        </a>
      </section>
    </div>
  )
}

