---
title: "Statistical Uncertainty and Hypothesis Testing"
description: "Confidence intervals, significance tests, effect sizes, and the multiple-comparison problem that arises when many features or heads are screened at once."
order: 6
status: placeholder
prerequisites:
  - title: "Estimation and Maximum Likelihood"
    url: "/topics/estimation-and-maximum-likelihood/"
  - title: "Sampling and Monte Carlo Estimation"
    url: "/topics/sampling-and-monte-carlo/"
---

## Why this article exists

Interpretability results are usually differences in a metric measured on a finite set of prompts, and a large fraction of the field's contested claims are contested because that difference was not accompanied by an interval.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Sampling distributions**

- The distribution of a statistic across repeated samples
- Standard error distinguished from standard deviation, since this is the usual confusion
- Confidence intervals, and the correct statement of what they cover

**2. Testing**

- Null hypotheses, test statistics, and p-values, each defined precisely
- What a p-value is not, stated explicitly because the misreading is near-universal
- Type I and Type II error, and power

**3. Effect size**

- Reporting a difference with its interval rather than a significance verdict
- Standardized effect sizes, and when they help
- Why a significant result on 10,000 prompts can still be uninteresting

**4. Multiple comparisons**

- The problem, made concrete: screening 144 attention heads at $\alpha = 0.05$
- Bonferroni and Benjamini-Hochberg, with the tradeoff between them
- Pre-registration and held-out confirmation as the stronger fix

**5. Resampling methods**

- The bootstrap for an interval on any statistic
- Permutation tests for a null with no closed form
- Which to reach for when the metric is a custom interpretability score

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Put a bootstrap confidence interval on a patching effect measured over a prompt set
- Correct a head-screening result for multiple comparisons and say what survives
- Read a results table and identify what uncertainty is not being reported

## Sources to learn from

- Wasserman, *All of Statistics*, chapters 8 and 10-11 — The bootstrap, testing, and the statements you will want to be precise about.
- Efron & Hastie, *Computer Age Statistical Inference*, chapters 10-11 and 15 — The bootstrap and false discovery rates from the people who developed them. Freely available.
- Greenland et al., 'Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations' (2016) — A list of the misreadings. Read it once and return to it when writing a results section.
- Gelman & Loken, 'The Garden of Forking Paths' — Free. Why a result can be a false positive with no explicit multiple testing anywhere, because the analysis was chosen after seeing the data. Sweeping layers and reporting the best one is exactly this.
- Bowman & Dahl, 'What Will it Take to Fix Benchmarking in NLU?' (arXiv:2104.02145) — Optional. The field-specific version of why uncertainty reporting is not optional.

## Where the curriculum uses it

[Counterfactual Resampling](/topics/counterfactual-resampling/), [Distribution Shift and Held-Out Evaluation](/topics/distribution-shift-and-evaluation/).
