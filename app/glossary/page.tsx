export default function GlossaryPage() {
  const items = [
    ['α (alpha)', 'Type I error rate; false positive probability.'],
    ['Power (1−β)', 'Probability to detect a true effect of the specified size.'],
    ['Cohen’s d', 'Standardized mean difference: (μ1−μ2)/σ.'],
    ['Cohen’s f', 'ANOVA effect size: f = sqrt(η²/(1−η²)).'],
    ['f²', 'Regression effect size: f² = R²/(1−R²).'],
    ['r', 'Correlation coefficient between −1 and 1.'],
    ['OR, RR', 'Odds ratio and risk ratio for binary outcomes.'],
    ['ICC', 'Intracluster correlation; within-cluster similarity.'],
    ['DEFF', 'Design effect: variance inflation from clustering.'],
    ['ε', 'Nonsphericity correction (GG/HF) in repeated measures.'],
    ['ρ', 'Correlation among repeated/paired measures.'],
  ]
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Glossary</h1>
      <div className="card divide-y divide-slate-200 dark:divide-slate-800">
        {items.map(([term, def]) => (
          <div key={term} className="py-2">
            <div className="font-medium">{term}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{def}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

