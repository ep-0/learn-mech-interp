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

## What this article will cover

- Sampling from discrete and continuous distributions
- Monte Carlo estimation of an expectation, and its $1/\sqrt{n}$ error
- Variance reduction: common random numbers, paired comparisons, control variates
- Temperature, truncation, and how they reshape a categorical distribution
- Importance sampling and reweighting between distributions

## Where the curriculum uses it

[Decoding Strategies](/topics/decoding-strategies/), [Statistical Uncertainty and Hypothesis Testing](/topics/hypothesis-testing-and-uncertainty/), [Supervised Learning, Generalization, and Overfitting](/topics/supervised-learning-and-generalization/).
