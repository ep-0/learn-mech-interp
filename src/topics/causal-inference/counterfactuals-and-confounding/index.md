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

## What this article will cover

- Counterfactuals as queries about an alternative world
- Confounding, and the comparisons it invalidates
- Matching, control, and holding everything else fixed
- Why a minimal-pair design is the interpretability analogue of a controlled experiment
- Common failure modes: distribution shift under corruption, and off-manifold inputs

## Where the curriculum uses it

[The Causal Abstraction Framework](/topics/causal-abstraction/).
