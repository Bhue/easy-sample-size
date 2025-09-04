"use client"
import React, { useMemo, useState } from 'react'

type Recommendation = { label: string; slug?: string; note?: string }

type Node = {
  id: string
  question?: string
  yes?: string
  no?: string
  results?: Recommendation[]
}

const NODES: Record<string, Node> = {
  start: {
    id: 'start',
    question: 'Is your outcome variable continuous (numeric)?',
    yes: 'cont_branch',
    no: 'noncont_branch',
  },
  cont_branch: {
    id: 'cont_branch',
    question: 'Are you comparing groups/conditions (not correlation)?',
    yes: 'cont_groups',
    no: 'cont_assoc',
  },
  cont_assoc: {
    id: 'cont_assoc',
    question: 'Are you testing association between two continuous variables?',
    yes: 'corr_leaf',
    no: 'reg_leaf',
  },
  corr_leaf: {
    id: 'corr_leaf',
    results: [
      { label: 'Correlation (Pearson r)', slug: 'correlation' },
      { label: 'Simple linear regression (equivalent test)', note: 'Use Correlation calculator; regression t-test is equivalent.' },
    ],
  },
  reg_leaf: {
    id: 'reg_leaf',
    results: [
      { label: 'Multiple linear regression (global R²)', slug: 'regression-global', note: 'Global F-test for p predictors via f².' },
    ],
  },
  cont_groups: {
    id: 'cont_groups',
    question: 'How many groups/conditions are you comparing? (Two groups?)',
    yes: 'two_groups',
    no: 'more_groups',
  },
  two_groups: {
    id: 'two_groups',
    question: 'Are the measurements paired/repeated on the same subjects?',
    yes: 'paired_leaf',
    no: 'independent_leaf',
  },
  paired_leaf: {
    id: 'paired_leaf',
    results: [
      { label: 'Paired means (within-subject)', slug: 'paired-means' },
      { label: 'Equivalence/Non-inferiority — two means (paired as proxy)', slug: 'equiv-means', note: 'Use TOST if testing equivalence/NI of mean difference.' },
    ],
  },
  independent_leaf: {
    id: 'independent_leaf',
    results: [
      { label: 'Two independent means (pooled SD)', slug: 'two-means' },
      { label: 'Cluster design adjustment (if clustered)', slug: 'cluster-deff', note: 'Apply DEFF if clusters/ICC exist.' },
      { label: 'Equivalence/Non-inferiority — two means (TOST)', slug: 'equiv-means' },
    ],
  },
  more_groups: {
    id: 'more_groups',
    question: 'Is there only one factor (one-way) with k>2 groups?',
    yes: 'anova_leaf',
    no: 'rm_or_two_way',
  },
  anova_leaf: {
    id: 'anova_leaf',
    results: [
      { label: 'One-way ANOVA (fixed k)', slug: 'anova-oneway' },
    ],
  },
  rm_or_two_way: {
    id: 'rm_or_two_way',
    results: [
      { label: 'Two-way ANOVA (main/interaction) — TODO', note: 'Balanced cells assumption; not yet implemented.' },
      { label: 'Repeated-measures ANOVA — TODO', note: 'Within factors, ε and ρ inputs; not yet implemented.' },
      { label: 'ANCOVA — TODO', note: 'One factor + covariates; not yet implemented.' },
    ],
  },
  noncont_branch: {
    id: 'noncont_branch',
    question: 'Is your outcome binary (yes/no, success/failure)?',
    yes: 'binary_branch',
    no: 'counts_time_branch',
  },
  binary_branch: {
    id: 'binary_branch',
    question: 'Are you comparing two groups?',
    yes: 'two_props_pairing',
    no: 'one_prop_or_gof',
  },
  two_props_pairing: {
    id: 'two_props_pairing',
    question: 'Are the observations paired (e.g., pre/post on same subjects)?',
    yes: 'mcnemar_leaf',
    no: 'two_props_leaf',
  },
  two_props_leaf: {
    id: 'two_props_leaf',
    results: [
      { label: 'Two proportions (unpooled)', slug: 'two-proportions' },
      { label: 'Equivalence/NI — proportions — TODO', note: 'Risk diff/ratio/OR; not yet implemented.' },
      { label: 'Logistic regression (single predictor) — TODO', note: 'Hsieh approximation; not yet implemented.' },
    ],
  },
  mcnemar_leaf: {
    id: 'mcnemar_leaf',
    results: [
      { label: 'Paired proportions (McNemar) — TODO', note: 'To be implemented.' },
    ],
  },
  one_prop_or_gof: {
    id: 'one_prop_or_gof',
    question: 'Is it a single proportion vs a fixed p0?',
    yes: 'one_prop_leaf',
    no: 'gof_or_rxc',
  },
  one_prop_leaf: {
    id: 'one_prop_leaf',
    results: [
      { label: 'One proportion vs p0', slug: 'one-proportion' },
    ],
  },
  gof_or_rxc: {
    id: 'gof_or_rxc',
    question: 'Is it a multinomial goodness-of-fit (one categorical variable)?',
    yes: 'gof_leaf',
    no: 'rxc_leaf',
  },
  gof_leaf: {
    id: 'gof_leaf',
    results: [
      { label: 'Chi-square Goodness-of-fit (w)', slug: 'chi-gof' },
    ],
  },
  rxc_leaf: {
    id: 'rxc_leaf',
    results: [
      { label: 'Chi-square RxC (w)', slug: 'chi-rxc' },
    ],
  },
  counts_time_branch: {
    id: 'counts_time_branch',
    question: 'Are you analyzing event counts/rates or time-to-event?',
    yes: 'counts_or_survival',
    no: 'other_branch',
  },
  counts_or_survival: {
    id: 'counts_or_survival',
    question: 'Is the endpoint time-to-event with censoring?',
    yes: 'survival_leaf',
    no: 'poisson_leaf',
  },
  survival_leaf: {
    id: 'survival_leaf',
    results: [
      { label: 'Survival (two-arm log-rank)', slug: 'logrank' },
    ],
  },
  poisson_leaf: {
    id: 'poisson_leaf',
    results: [
      { label: 'Poisson regression (rate ratio)', slug: 'poisson', note: 'Use exposure offsets if needed.' },
    ],
  },
  other_branch: {
    id: 'other_branch',
    results: [
      { label: 'Reliability: ICC — TODO', note: 'Two-way random/mixed; power/precision.' },
      { label: 'Agreement: Cohen’s kappa — TODO', note: 'Power for kappa with prevalence/bias.' },
    ],
  },
}

export function DecisionWizard() {
  const [stack, setStack] = useState<string[]>(['start'])
  const current = stack[stack.length - 1]
  const node = NODES[current]

  const reset = () => setStack(['start'])
  const go = (dir: 'yes' | 'no') => {
    const next = node[dir]
    if (!next) return
    setStack(s => [...s, next])
  }
  const back = () => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
  }

  const breadcrumbs = useMemo(() => stack.map(id => NODES[id].question).filter(Boolean), [stack])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Test Selection Wizard</h2>
        <div className="flex gap-2">
          <button className="btn" onClick={back} aria-disabled={stack.length===1}>Back</button>
          <button className="btn" onClick={reset}>Restart</button>
        </div>
      </div>
      {node.question && (
        <div className="card">
          <div className="text-sm text-slate-500 mb-2">Answer a few yes/no questions:</div>
          <div className="text-lg font-medium mb-3">{node.question}</div>
          <div className="flex gap-3">
            <button className="btn" onClick={() => go('yes')}>Yes</button>
            <button className="btn" onClick={() => go('no')}>No</button>
          </div>
        </div>
      )}
      {node.results && (
        <div className="card">
          <div className="font-medium mb-2">Recommended test(s)</div>
          <ul className="grid gap-2">
            {node.results.map((r, i) => (
              <li key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.label}</div>
                  {r.note && <div className="text-sm text-slate-500">{r.note}</div>}
                </div>
                {r.slug && (
                  <a className="btn" href={`/calculators/${r.slug}`}>Open</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {breadcrumbs.length > 0 && (
        <div className="text-xs text-slate-500">Progress: {breadcrumbs.join(' › ')}</div>
      )}
    </div>
  )
}

