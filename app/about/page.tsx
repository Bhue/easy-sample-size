export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">About</h1>
      <p>Easy Sample Size replicates and extends G*Power-style power and sample-size calculators, implemented fully client-side with transparent formulas and modern UX.</p>
      <div className="card">
        <div className="font-semibold mb-2">Methods & References</div>
        <ul className="list-disc pl-5 text-sm">
          <li>Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences.</li>
          <li>Faul, F., Erdfelder, E., Buchner, A., & Lang, A.-G. (2009). G*Power 3.</li>
          <li>Chow, S.-C., Shao, J., & Wang, H. Sample Size Calculations in Clinical Research.</li>
          <li>Lachin, J. M. (2011). Biostatistical Methods.</li>
          <li>Fleiss, J. L., Levin, B., & Paik, M. C. (2003). Statistical Methods for Rates and Proportions.</li>
          <li>Schoenfeld, D. A. (1981). The asymptotic properties of the logrank test.</li>
          <li>Hsieh, F. Y. (1989, 1998). Sample size tables for logistic regression. (TODO for logistic module)</li>
        </ul>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">See docs/methods.md for formulas and assumptions.</p>
    </div>
  )
}

