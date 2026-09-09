---
title: "Counterfactuals and Confounding"
description: "Counterfactual questions about what would have happened, the confounders that break naive comparisons, and the design choices that control for them."
order: 3
status: placeholder
prerequisites:
  - title: "Causal Graphs and Interventions"
    url: "/topics/causal-graphs-and-interventions/"
---

## Why this article exists

A clean-corrupted prompt pair is a counterfactual design, and most of the ways a patching experiment can mislead are the standard failure modes of counterfactual comparison: a corrupted input that changes more than one thing at a time.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Counterfactuals**

- The third rung: what would have happened to this unit had the treatment differed
- Abduction, action, prediction as the computational recipe in an SCM
- Why counterfactuals need more than the interventional distribution

**2. Confounding**

- A common cause producing association without causation, with the graph
- The backdoor criterion, and adjustment
- Simpson's paradox worked numerically

**3. Designing a comparison**

- Matching, and holding everything but the treatment fixed
- Minimal pairs as the interpretability version of a controlled experiment
- How much a corrupted prompt should differ, and why 'as little as possible' is the rule

**4. Failure modes in patching designs**

- A corrupted prompt that changes token length, position, or several attributes at once
- Off-distribution activations produced by patching, and why the model's behavior there may not generalize
- Gaussian noising versus symmetric token replacement, and the argument against the former

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Critique a clean-corrupted prompt pair and name what it fails to hold fixed
- Explain the off-distribution objection to activation patching precisely
- Design a minimal pair for a given behavioral claim

## Sources to learn from

- Pearl, Glymour & Jewell, *Causal Inference in Statistics: A Primer*, chapter 4 — Counterfactuals with worked computations, which is rarer than it should be.
- Brady Neal, *Introduction to Causal Inference*, the lectures on confounding and identification — Free video. The backdoor criterion is considerably easier watched than read.
- Hernán & Robins, *Causal Inference: What If*, parts I-II — The applied-science treatment of confounding and design. Freely available.
- Zhang & Nanda, 'Towards Best Practices of Activation Patching' (arXiv:2309.16042) — The corruption-design failure modes, empirically demonstrated.
- Heimersheim & Nanda, 'How to use and interpret activation patching' (arXiv:2404.15255) — A practical companion covering the same design questions.

## Where the curriculum uses it

[The Causal Abstraction Framework](/topics/causal-abstraction/).
