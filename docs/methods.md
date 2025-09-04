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

- One proportion vs p0: Normal (Wald) test: n = ceil(((zα + zβ)^2) p(1−p) / (p−p0)^2).
- Chi-square (GOF, RxC): Noncentral chi-square with λ = N w²; df = m−1 (GOF) or (r−1)(c−1) (RxC). Power = 1 − F_ncχ²(χ²crit; df, λ).
- Multiple regression (global R²): Noncentral F with df1 = p, df2 = N−p−1, λ = f²(N−p−1), where f² = R²/(1−R²).
- Poisson regression (rate ratio): Normal approx on log(RR); var(log RR) ≈ 1/E1 + 1/E2 with E_i expected events; solve for n.
- Equivalence / Non-inferiority (two means): TOST using z-approx with standardized margin d0 = Δ/σ; equal-variance two-sample setup, allocation ratio k.

Assumptions and limitations:

- The z-approximations for t-tests and proportions are accurate for planning and match textbook references within ±1 subject in typical ranges. For very small samples or extreme effects, exact/noncentral-distribution methods may be preferred.
- ANOVA power uses a convergent Poisson-mixture for the noncentral F distribution; df and λ are based on Cohen’s f definition.
- Log-rank uses the asymptotic approximation; survival accrual/follow-up modeling is simplified by using a user-specified overall event fraction.
- Logistic regression (Hsieh) is stubbed and will be added using the published approximations; for a binary predictor, the two-proportions calculator is a reasonable proxy.
