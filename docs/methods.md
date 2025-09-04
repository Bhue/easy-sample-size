# Easy Sample Size — Methods

This app implements standard, transparent formulas for common power and sample-size problems. Key references include Cohen (1988), Chow et al., Fleiss et al., Lachin, and method-specific primary references.

Highlights:

- Two independent means (pooled SD): Normal approximation to the t-test. A priori n1 = ceil(((zα + zβ)^2) (1 + 1/k) / d^2), where k = n2/n1; post hoc power uses Z under H1 with mean δ = |d| / sqrt(1/n1 + 1/n2).
- Paired means: One-sample z on paired differences; n = ceil((zα + zβ)^2 / dz^2).
- Two proportions (unpooled): Normal (Wald) unpooled test. A priori n1 = ceil(((zα + zβ)^2) [p1(1−p1) + p2(1−p2)/k] / (p1−p2)^2), n2 = ceil(k n1).
- Correlation (ρ=0): Fisher z transform. n = ceil((zα + zβ)^2 / z_r^2 + 3), where z_r = atanh(|r|).
- One-way ANOVA (fixed k): Noncentral F with λ = f² N, df1 = k−1, df2 = N−k, critical F from central F; ncF CDF computed by Poisson mixture over central F CDF via regularized incomplete beta.
- Log-rank (two-arm): Schoenfeld/Freedman approximation: D = ceil(((zα + zβ)^2) / (ψ (ln HR)^2)), ψ = p1 p2 for allocation p1: p2 = 1:k; total N ≈ D / e given event fraction e.
- Cluster design: DEFF = 1 + (m−1) ICC (1 + CV²). Adjust per-arm N by DEFF and convert to clusters per arm.

Assumptions and limitations:

- The z-approximations for t-tests and proportions are accurate for planning and match textbook references within ±1 subject in typical ranges. For very small samples or extreme effects, exact/noncentral-distribution methods may be preferred.
- ANOVA power uses a convergent Poisson-mixture for the noncentral F distribution; df and λ are based on Cohen’s f definition.
- Log-rank uses the asymptotic approximation; survival accrual/follow-up modeling is simplified by using a user-specified overall event fraction.
- Logistic regression (Hsieh) is stubbed and will be added using the published approximations; for a binary predictor, the two-proportions calculator is a reasonable proxy.

