/** Cluster randomized trials: Design effect and adjusted sample size */

export type ClusterInput = {
  nIndivPerArm: number // required individuals per arm (from base calc)
  m: number // average cluster size
  ICC: number // intracluster correlation
  CV?: number // coefficient of variation of cluster size (optional)
}

export type ClusterResult = {
  DEFF: number
  nAdjPerArm: number
  clustersPerArm: number
  effectiveNPerArm: number
}

export function adjustForClustering(input: ClusterInput): ClusterResult {
  const { nIndivPerArm, m, ICC } = input
  if (!(m > 0) || !(ICC >= 0)) throw new Error('m>0 and ICC>=0 required')
  const CV2 = (input.CV ?? 0) ** 2
  const DEFF = 1 + (m - 1) * ICC * (1 + CV2)
  const nAdj = Math.ceil(nIndivPerArm * DEFF)
  const clusters = Math.ceil(nAdj / m)
  const effective = Math.round(nAdj / DEFF)
  return { DEFF, nAdjPerArm: nAdj, clustersPerArm: clusters, effectiveNPerArm: effective }
}

