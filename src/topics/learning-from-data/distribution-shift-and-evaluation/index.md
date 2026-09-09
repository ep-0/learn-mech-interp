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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Kinds of shift**

- Covariate shift, label shift, and concept drift, each with a definition and an example
- Which ones a held-out split from the same dataset would catch, and which it would not

**2. Spurious correlations**

- Shortcut features, with a worked example from probing
- Why the easiest signal is often not the intended one
- Detecting a shortcut: ablate it, or find data where it decouples

**3. Evaluation designs**

- Held-out datasets, held-out model organisms, held-out behaviors, in increasing order of strength
- Why generalization to a new behavior is the claim safety work needs
- Preregistration and blind analysis as defenses against tuning on the test set

**4. Detecting shift in deployment**

- Monitoring score distributions rather than accuracy, since labels are absent
- Threshold drift, and recalibration policies
- The operational cost of a probe that degrades quietly

**5. What this predicts about interpretability results**

- Probes that transfer across datasets but not across model organisms
- The recurring pattern: strong in-distribution, weak on the case that motivated the work

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Classify a given evaluation as in-distribution, out-of-distribution, or held-out-behavior
- Design a held-out test that would falsify a monitoring claim
- Explain why in-distribution probe accuracy is weak evidence for deployment performance

## Sources to learn from

- Quiñonero-Candela et al., *Dataset Shift in Machine Learning*, chapters 1-3 — Start here. The taxonomy, stated carefully.
- Geirhos et al., 'Shortcut Learning in Deep Neural Networks' (arXiv:2004.07780) — The clearest account of why models learn the wrong thing and how evaluations miss it.
- Koh et al., 'WILDS: A Benchmark of in-the-Wild Distribution Shifts' (arXiv:2012.07421) — Read the introduction for the range of shifts that occur in practice.
- Hubinger et al., 'Sleeper Agents' (arXiv:2401.05566), and the probe-based follow-ups — A concrete case where the held-out-behavior distinction decides what the result means.

## Where the curriculum uses it

[Activation Oracles](/topics/activation-oracles/), [Probes in Production](/topics/probes-in-production/).
