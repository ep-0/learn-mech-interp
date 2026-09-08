---
title: "Distribution Shift and Held-Out Evaluation"
description: "What breaks when test data is drawn differently from training data, the kinds of shift worth naming, and evaluation designs that detect it."
order: 4
status: placeholder
prerequisites:
  - title: "Supervised Learning, Generalization, and Overfitting"
    url: "/topics/supervised-learning-and-generalization/"
  - title: "Statistical Uncertainty and Hypothesis Testing"
    url: "/topics/hypothesis-testing-and-uncertainty/"
---

## Why this article exists

Probes trained on curated contrast pairs are deployed on real traffic, and monitors validated on known behaviors are asked about unknown ones. The gap between those settings is distribution shift, and it is the main reason promising probes disappoint.

## What this article will cover

- Covariate shift, label shift, and concept drift
- In-distribution versus out-of-distribution generalization
- Spurious correlations and shortcut features
- Held-out designs: unseen datasets, unseen model organisms, unseen behaviors
- Detecting shift, and reporting results that survive it

## Where the curriculum uses it

[Activation Oracles](/topics/activation-oracles/), [Probes in Production](/topics/probes-in-production/).
