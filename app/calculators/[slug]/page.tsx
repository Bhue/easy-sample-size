"use client"
import { useMemo, useState } from 'react'
import { EffectSizeHelper } from '../../../components/EffectSizeHelper'
import { ResultCard } from '../../../components/ResultCard'
import { PowerCurve } from '../../../components/PowerCurve'
import { ExportButtons } from '../../../components/ExportButtons'
import * as twoMeans from '../../../lib/calculators/t_independent'
import * as pairedMeans from '../../../lib/calculators/t_paired'
import * as twoProps from '../../../lib/calculators/two_proportions'
import * as corr from '../../../lib/calculators/correlation'
import * as anova from '../../../lib/calculators/anova_oneway'
import * as logrank from '../../../lib/calculators/logrank'
import * as cluster from '../../../lib/calculators/cluster_deff'
import * as oneprop from '../../../lib/calculators/one_proportion'
import * as chisq from '../../../lib/calculators/chi_square'
import * as regGlobal from '../../../lib/calculators/regression_global'
import * as poisson from '../../../lib/calculators/poisson_regression'
import * as tost from '../../../lib/calculators/equivalence_means_tost'

type Props = { params: { slug: string } }

export default function CalculatorPage({ params }: Props) {
  const { slug } = params
  switch (slug) {
    case 'two-means':
      return <TwoMeansCalc />
    case 'paired-means':
      return <PairedMeansCalc />
    case 'two-proportions':
      return <TwoPropsCalc />
    case 'correlation':
      return <CorrelationCalc />
    case 'anova-oneway':
      return <ANOVACalc />
    case 'logrank':
      return <LogrankCalc />
    case 'cluster-deff':
      return <ClusterCalc />
    case 'logistic-hsieh':
      return <div className="space-y-4"><h1 className="text-2xl font-semibold">Logistic Regression (Hsieh)</h1><p>TODO: Implementation in progress. For a binary predictor, you can approximate with the Two Proportions calculator using the exposed vs unexposed groups.</p></div>
    case 'one-proportion':
      return <OnePropCalc />
    case 'chi-gof':
      return <ChiGOFCalc />
    case 'chi-rxc':
      return <ChiRxCCalc />
    case 'regression-global':
      return <RegGlobalCalc />
    case 'poisson':
      return <PoissonCalc />
    case 'equiv-means':
      return <EquivMeansCalc />
    default:
      return <div>Unknown calculator</div>
  }
}

function Field({ label, value, set, step = 'any' }: { label: string; value: string; set: (v: string) => void; step?: string }) {
  return (
    <label className="grid gap-1">
      <span className="label">{label}</span>
      <input className="input" value={value} onChange={e => set(e.target.value)} step={step} />
    </label>
  )
}

function TwoMeansCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [d, setD] = useState('0.5')
  const [k, setK] = useState('1')
  const [tail, setTail] = useState<'two-sided' | 'one-sided'>('two-sided')
  const result = useMemo(() => {
    try {
      return twoMeans.aprioriN({ alpha: +alpha, power: +power, d: +d, tail, allocationRatio: +k })
    } catch {
      return undefined
    }
  }, [alpha, power, d, k, tail])
  const curve = useMemo(() => {
    const pts = [] as { x: number; power: number }[]
    for (let n = 10; n <= 300; n += 10) {
      try {
        const p = twoMeans.posthocPower({ alpha: +alpha, d: +d, tail, n1: n, n2: Math.round(n * +k) }).power
        pts.push({ x: n + Math.round(n * +k), power: p })
      } catch { /* ignore */ }
    }
    return pts
  }, [alpha, d, tail, k])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Two Independent Means (pooled SD)</h1>
        <EffectSizeHelper />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Cohen's d" value={d} set={setD} />
            <Field label="Allocation ratio k = n2/n1" value={k} set={setK} />
            <label className="grid gap-1">
              <span className="label">Tail</span>
              <select className="input" value={tail} onChange={e => setTail(e.target.value as any)}>
                <option value="two-sided">Two-sided</option>
                <option value="one-sided">One-sided</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>n1 = <strong>{result?.n1 ?? '-'}</strong></div>
            <div>n2 = <strong>{result?.n2 ?? '-'}</strong></div>
            <div>Total = <strong>{result?.total ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <PowerCurve data={curve} xLabel="Total N" />
      <ExportButtons />
    </div>
  )
}

function PairedMeansCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [dz, setDz] = useState('0.5')
  const [tail, setTail] = useState<'two-sided' | 'one-sided'>('two-sided')
  const result = useMemo(() => {
    try { return pairedMeans.aprioriN({ alpha: +alpha, power: +power, dz: +dz, tail }) } catch { return undefined }
  }, [alpha, power, dz, tail])
  const curve = useMemo(() => {
    const pts = [] as { x: number; power: number }[]
    for (let n = 10; n <= 300; n += 5) {
      try { pts.push({ x: n, power: pairedMeans.posthocPower({ alpha: +alpha, dz: +dz, tail, n }).power }) } catch {}
    }
    return pts
  }, [alpha, dz, tail])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Paired Means</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Cohen's d (paired, dz)" value={dz} set={setDz} />
            <label className="grid gap-1">
              <span className="label">Tail</span>
              <select className="input" value={tail} onChange={e => setTail(e.target.value as any)}>
                <option value="two-sided">Two-sided</option>
                <option value="one-sided">One-sided</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>n = <strong>{result?.n ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <PowerCurve data={curve} xLabel="N" />
      <ExportButtons />
    </div>
  )
}

function TwoPropsCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [p1, setP1] = useState('0.5')
  const [p2, setP2] = useState('0.6')
  const [k, setK] = useState('1')
  const [tail, setTail] = useState<'two-sided' | 'one-sided'>('two-sided')
  const result = useMemo(() => {
    try { return twoProps.aprioriN({ alpha: +alpha, power: +power, p1: +p1, p2: +p2, tail, allocationRatio: +k }) } catch { return undefined }
  }, [alpha, power, p1, p2, tail, k])
  const curve = useMemo(() => {
    const pts = [] as { x: number; power: number }[]
    for (let n = 50; n <= 1000; n += 25) {
      try {
        const n2 = Math.round(n * +k)
        const p = twoProps.posthocPower({ alpha: +alpha, p1: +p1, p2: +p2, tail, n1: n, n2 }).power
        pts.push({ x: n + n2, power: p })
      } catch {}
    }
    return pts
  }, [alpha, p1, p2, tail, k])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Two Proportions (unpooled)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="p1" value={p1} set={setP1} />
            <Field label="p2" value={p2} set={setP2} />
            <Field label="Allocation ratio k = n2/n1" value={k} set={setK} />
            <label className="grid gap-1">
              <span className="label">Tail</span>
              <select className="input" value={tail} onChange={e => setTail(e.target.value as any)}>
                <option value="two-sided">Two-sided</option>
                <option value="one-sided">One-sided</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>n1 = <strong>{result?.n1 ?? '-'}</strong></div>
            <div>n2 = <strong>{result?.n2 ?? '-'}</strong></div>
            <div>Total = <strong>{result?.total ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <PowerCurve data={curve} xLabel="Total N" />
      <ExportButtons />
    </div>
  )
}

function CorrelationCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [r, setR] = useState('0.3')
  const [tail, setTail] = useState<'two-sided' | 'one-sided'>('two-sided')
  const result = useMemo(() => {
    try { return corr.aprioriN({ alpha: +alpha, power: +power, r: +r, tail }) } catch { return undefined }
  }, [alpha, power, r, tail])
  const curve = useMemo(() => {
    const pts = [] as { x: number; power: number }[]
    for (let n = 10; n <= 300; n += 5) {
      try { pts.push({ x: n, power: corr.posthocPower({ alpha: +alpha, r: +r, tail, n }).power }) } catch {}
    }
    return pts
  }, [alpha, r, tail])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Correlation (Pearson r)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="|r|" value={r} set={setR} />
            <label className="grid gap-1">
              <span className="label">Tail</span>
              <select className="input" value={tail} onChange={e => setTail(e.target.value as any)}>
                <option value="two-sided">Two-sided</option>
                <option value="one-sided">One-sided</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>n = <strong>{result?.n ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <PowerCurve data={curve} xLabel="N" />
      <ExportButtons />
    </div>
  )
}

function ANOVACalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [k, setK] = useState('3')
  const [f, setF] = useState('0.25')
  const result = useMemo(() => {
    try { return anova.aprioriN({ alpha: +alpha, power: +power, k: +k, f: +f }) } catch { return undefined }
  }, [alpha, power, k, f])
  const curve = useMemo(() => {
    const pts = [] as { x: number; power: number }[]
    for (let N = +k * 2; N <= 400; N += 5) {
      try { pts.push({ x: N, power: anova.powerGivenN({ alpha: +alpha, N, k: +k, f: +f }).power }) } catch {}
    }
    return pts
  }, [alpha, k, f])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">One-way ANOVA (fixed k)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Groups k" value={k} set={setK} />
            <Field label="Cohen's f" value={f} set={setF} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>Total N = <strong>{result?.N ?? '-'}</strong></div>
            <div>df1 = {result?.df1 ?? '-'}, df2 = {result?.df2 ?? '-'}</div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <PowerCurve data={curve} xLabel="Total N" />
      <ExportButtons />
    </div>
  )
}

function LogrankCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [HR, setHR] = useState('0.7')
  const [k, setK] = useState('1')
  const [e, setE] = useState('0.6')
  const result = useMemo(() => {
    try { return logrank.eventsRequired({ alpha: +alpha, power: +power, HR: +HR, allocationRatio: +k, eventFraction: +e }) } catch { return undefined }
  }, [alpha, power, HR, k, e])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Log-rank (two-arm)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Hazard ratio (HR)" value={HR} set={setHR} />
            <Field label="Allocation ratio k = n2/n1" value={k} set={setK} />
            <Field label="Event fraction e" value={e} set={setE} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>Required events D = <strong>{result?.events ?? '-'}</strong></div>
            {result?.totalN && (
              <>
                <div>Total N ≈ <strong>{result.totalN}</strong></div>
                <div>n1 ≈ <strong>{result.n1}</strong>, n2 ≈ <strong>{result.n2}</strong></div>
              </>
            )}
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}

function ClusterCalc() {
  const [nIndiv, setNIndiv] = useState('100')
  const [m, setM] = useState('20')
  const [ICC, setICC] = useState('0.02')
  const [CV, setCV] = useState('0')
  const result = useMemo(() => {
    try { return cluster.adjustForClustering({ nIndivPerArm: +nIndiv, m: +m, ICC: +ICC, CV: +CV }) } catch { return undefined }
  }, [nIndiv, m, ICC, CV])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cluster design (DEFF, ICC)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Required individuals per arm (from base calc)" value={nIndiv} set={setNIndiv} />
            <Field label="Average cluster size m" value={m} set={setM} />
            <Field label="ICC" value={ICC} set={setICC} />
            <Field label="CV of cluster size (optional)" value={CV} set={setCV} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>DEFF = <strong>{result ? result?.DEFF.toFixed(3) : '-'}</strong></div>
            <div>Adjusted n per arm = <strong>{result?.nAdjPerArm ?? '-'}</strong></div>
            <div>Clusters per arm = <strong>{result?.clustersPerArm ?? '-'}</strong></div>
            <div>Effective n per arm ≈ <strong>{result?.effectiveNPerArm ?? '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}

function OnePropCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [p, setP] = useState('0.6')
  const [p0, setP0] = useState('0.5')
  const [tail, setTail] = useState<'two-sided' | 'one-sided'>('two-sided')
  const result = useMemo(() => { try { return oneprop.aprioriN({ alpha: +alpha, power: +power, p: +p, p0: +p0, tail }) } catch { return undefined } }, [alpha, power, p, p0, tail])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">One Proportion vs p0</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="p (alt)" value={p} set={setP} />
            <Field label="p0 (null)" value={p0} set={setP0} />
            <label className="grid gap-1">
              <span className="label">Tail</span>
              <select className="input" value={tail} onChange={e => setTail(e.target.value as any)}>
                <option value="two-sided">Two-sided</option>
                <option value="one-sided">One-sided</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>n = <strong>{result?.n ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}

function ChiGOFCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [m, setM] = useState('4')
  const [w, setW] = useState('0.2')
  const result = useMemo(() => { try { return chisq.aprioriGOF({ alpha: +alpha, power: +power, m: +m, w: +w }) } catch { return undefined } }, [alpha, power, m, w])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Chi-square Goodness-of-fit</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Categories m" value={m} set={setM} />
            <Field label="Effect size w" value={w} set={setW} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>Total N = <strong>{result?.N ?? '-'}</strong></div>
            <div>df = <strong>{result?.df ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}

function ChiRxCCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [r, setR] = useState('2')
  const [c, setC] = useState('2')
  const [w, setW] = useState('0.2')
  const result = useMemo(() => { try { return chisq.aprioriRxC({ alpha: +alpha, power: +power, r: +r, c: +c, w: +w }) } catch { return undefined } }, [alpha, power, r, c, w])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Chi-square RxC</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Rows r" value={r} set={setR} />
            <Field label="Cols c" value={c} set={setC} />
            <Field label="Effect size w" value={w} set={setW} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>Total N = <strong>{result?.N ?? '-'}</strong></div>
            <div>df = <strong>{result?.df ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}

function RegGlobalCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [p, setP] = useState('3')
  const [f2, setF2] = useState('0.15')
  const result = useMemo(() => { try { return regGlobal.aprioriN({ alpha: +alpha, power: +power, p: +p, f2: +f2 }) } catch { return undefined } }, [alpha, power, p, f2])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Multiple Regression (global R²)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="# Predictors p" value={p} set={setP} />
            <Field label="f²" value={f2} set={setF2} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>Total N = <strong>{result?.N ?? '-'}</strong></div>
            <div>df1 = {result?.df1 ?? '-'}, df2 = {result?.df2 ?? '-'}</div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}

function PoissonCalc() {
  const [alpha, setAlpha] = useState('0.05')
  const [power, setPower] = useState('0.8')
  const [exp1, setExp1] = useState('1')
  const [exp2, setExp2] = useState('1')
  const [rate1, setRate1] = useState('0.5')
  const [rate2, setRate2] = useState('0.35')
  const [k, setK] = useState('1')
  const result = useMemo(() => { try { return poisson.aprioriN({ alpha: +alpha, power: +power, exposure1: +exp1, exposure2: +exp2, rate1: +rate1, rate2: +rate2, allocationRatio: +k }) } catch { return undefined } }, [alpha, power, exp1, exp2, rate1, rate2, k])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Poisson Regression (rate ratio)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Exposure arm 1" value={exp1} set={setExp1} />
            <Field label="Exposure arm 2" value={exp2} set={setExp2} />
            <Field label="Rate arm 1" value={rate1} set={setRate1} />
            <Field label="Rate arm 2" value={rate2} set={setRate2} />
            <Field label="Allocation ratio k = n2/n1" value={k} set={setK} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>n1 = <strong>{result?.n1 ?? '-'}</strong></div>
            <div>n2 = <strong>{result?.n2 ?? '-'}</strong></div>
            <div>Total = <strong>{result?.total ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}

function EquivMeansCalc() {
  const [alpha, setAlpha] = useState('0.025')
  const [power, setPower] = useState('0.8')
  const [d0, setD0] = useState('0.5')
  const [k, setK] = useState('1')
  const result = useMemo(() => { try { return tost.aprioriN({ alpha: +alpha, power: +power, d0: +d0, allocationRatio: +k, type: 'equivalence' }) } catch { return undefined } }, [alpha, power, d0, k])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Equivalence — Two Means (TOST)</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="α (one-sided for each TOST)" value={alpha} set={setAlpha} />
            <Field label="Power (1-β)" value={power} set={setPower} />
            <Field label="Margin d0 = Δ/σ" value={d0} set={setD0} />
            <Field label="Allocation ratio k = n2/n1" value={k} set={setK} />
          </div>
        </div>
        <div>
          <ResultCard title="Results">
            <div>n1 = <strong>{result?.n1 ?? '-'}</strong></div>
            <div>n2 = <strong>{result?.n2 ?? '-'}</strong></div>
            <div>Total = <strong>{result?.total ?? '-'}</strong></div>
            <div>Achieved power ≈ <strong>{result ? result.power.toFixed(3) : '-'}</strong></div>
          </ResultCard>
        </div>
      </div>
      <ExportButtons />
    </div>
  )
}
