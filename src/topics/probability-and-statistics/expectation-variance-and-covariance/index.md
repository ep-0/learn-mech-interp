---
title: "Expectation, Variance, and Covariance"
description: "Averages as integrals against a distribution, the spread around them, and covariance as the second-moment measure of joint variation."
order: 2
status: placeholder
prerequisites:
  - title: "Random Variables and Distributions"
    url: "/topics/random-variables-and-distributions/"
---

## Why this article exists

Steering vectors are differences of expectations. Probe training minimizes an expected loss. Layer normalization subtracts a mean and divides by a standard deviation. These moments are the arithmetic underneath.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Expectation**

- Definition for discrete and continuous cases, as a sum and as an integral
- Linearity, including for dependent variables, which is the property people forget
- The law of the unconscious statistician, and why it saves work

**2. Variance and standard deviation**

- Definition, the computational form $E[X^2] - E[X]^2$, and units
- Variance of a sum, and where the covariance term comes from
- Standardization, and its role in layer normalization

**3. Covariance and correlation**

- Covariance as a second moment, and its sign as co-movement
- Pearson correlation as covariance normalized, bounded in $[-1, 1]$
- The standard counterexample: zero correlation with strong dependence

**4. Limit theorems**

- The law of large numbers, and what it licenses about sample means
- The central limit theorem, stated with its conditions
- The $1/\sqrt{n}$ rate, which sets the cost of every empirical estimate in this field

**5. Where these appear in interpretability**

- A steering vector as a difference of two conditional expectations
- Layer normalization as an empirical standardization across the feature axis
- Activation statistics collected over a dataset, and the sampling error in them

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Derive the variance of a sum of correlated variables
- Explain what a contrastive steering vector estimates, in the language of expectations
- Estimate how many prompts are needed to pin down a mean activation difference to a given precision

## Sources to learn from

- Blitzstein & Hwang, *Introduction to Probability*, chapters 4 and 6-7 — Expectation, variance, covariance, and the limit theorems, with unusually good exercises.
- Wasserman, *All of Statistics*, chapters 3-5 — Compact statements and the inequalities you will want to cite.
- Murphy, *Probabilistic Machine Learning: An Introduction*, sections 2.2-2.4 and 3.2 — Moments in ML notation, including the multivariate case.
- Rimsky et al., 'Steering Llama 2 via Contrastive Activation Addition' (arXiv:2312.06681) — Read the method section only, to see a difference of expectations used as a tool.

## Where the curriculum uses it

[Covariance Matrices and Whitening](/topics/covariance-matrices-and-whitening/), [Entropy, Cross-Entropy, and Perplexity](/topics/entropy-and-cross-entropy/), [Estimation and Maximum Likelihood](/topics/estimation-and-maximum-likelihood/), [Sampling and Monte Carlo Estimation](/topics/sampling-and-monte-carlo/).
