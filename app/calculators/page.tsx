import Link from 'next/link'

const calculators = [
  { slug: 'two-means', name: 'Two Independent Means (t)' },
  { slug: 'paired-means', name: 'Paired Means' },
  { slug: 'two-proportions', name: 'Two Proportions' },
  { slug: 'correlation', name: 'Correlation (Pearson r)' },
  { slug: 'anova-oneway', name: 'One-way ANOVA (f)' },
  { slug: 'logrank', name: 'Log-rank Survival' },
  { slug: 'cluster-deff', name: 'Cluster (DEFF/ICC)' },
  { slug: 'logistic-hsieh', name: 'Logistic Regression (Hsieh) — TODO' },
]

export default function CalculatorsIndex() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Calculators</h1>
      <ul className="grid md:grid-cols-2 gap-3">
        {calculators.map(c => (
          <li key={c.slug} className="card">
            <Link href={`/calculators/${c.slug}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

