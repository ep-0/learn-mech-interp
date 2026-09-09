---
title: "Sampling and Monte Carlo Estimation"
description: "Drawing from a distribution, estimating expectations from finite samples, and how sampling noise scales with the number of draws."
order: 5
status: placeholder
prerequisites:
  - title: "Expectation, Variance, and Covariance"
    url: "/topics/expectation-variance-and-covariance/"
---

## Why this article exists

Decoding is sampling. Patching effects are averaged over a distribution of prompts. Counterfactual resampling estimates an effect by re-drawing continuations. Each of those is a Monte Carlo estimate with a variance worth knowing.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Drawing samples**

- Inverse transform sampling, and sampling a categorical distribution in practice
- Pseudorandomness, seeds, and reproducibility, which matters more here than usual
- Sampling with and without replacement

**2. Monte Carlo estimation**

- Estimating $E[f(X)]$ by an average, and its unbiasedness
- The standard error and the $1/\sqrt{n}$ rate, with a worked sample-size calculation
- Confidence intervals for a Monte Carlo estimate

**3. Variance reduction**

- Paired comparisons and common random numbers, and why they matter for clean-corrupted designs
- Control variates, briefly
- The practical rule: compare on the same prompts, not on independent draws

**4. Reshaping a categorical distribution**

- Temperature, and its effect on entropy
- Top-$k$ and top-$p$ truncation, and the distribution they actually sample from
- Why a truncated distribution is no longer the model's distribution, which matters for any claim about model behavior

**5. Importance sampling**

- Reweighting samples from one distribution to estimate under another
- The variance blow-up when the distributions differ too much
- Where it appears: rare-behavior elicitation and amplified sampling

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute how many samples are needed to resolve a given effect size
- Explain why paired prompts reduce variance more than doubling the sample count
- State precisely which distribution top-$p$ sampling draws from

## Sources to learn from

- Blitzstein & Hwang, *Introduction to Probability*, the simulation sections — Start here. Sampling mechanics with worked code.
- Owen, *Monte Carlo theory, methods and examples*, chapters 2 and 8-9 — The reference for Monte Carlo error and variance reduction. Freely available.
- Implement it: draw from a distribution by inverse transform, then by rejection, then estimate an integral and plot the error against $1/\sqrt{n}$ — An hour of code. The $\sqrt{n}$ rate is the single fact that governs how many samples any interpretability experiment needs, and seeing it emerge is worth more than reading the bound.
- Holtzman et al., 'The Curious Case of Neural Text Degeneration' (arXiv:1904.09751) — Where top-$p$ comes from, and the argument for why truncation is needed at all.
- Wasserman, *All of Statistics*, chapter 24 (simulation methods) — A compact statement of the bootstrap and Monte Carlo ideas you will reuse.

## Where the curriculum uses it

[Decoding Strategies](/topics/decoding-strategies/), [Statistical Uncertainty and Hypothesis Testing](/topics/hypothesis-testing-and-uncertainty/), [Supervised Learning, Generalization, and Overfitting](/topics/supervised-learning-and-generalization/).
