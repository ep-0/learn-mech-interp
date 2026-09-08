---
title: "KL Divergence and Mutual Information"
description: "Measuring how far one distribution sits from another, why the measure is asymmetric, and mutual information as the shared content of two variables."
order: 2
status: placeholder
prerequisites:
  - title: "Entropy, Cross-Entropy, and Perplexity"
    url: "/topics/entropy-and-cross-entropy/"
  - title: "Conditional Probability, Independence, and Bayes' Rule"
    url: "/topics/conditional-probability-and-bayes/"
---

## Why this article exists

Circuit faithfulness is often measured as the KL divergence between a full model's output and an ablated one, and probing results are sometimes framed as bounds on the information an activation carries about a label.

## What this article will cover

- KL divergence, its non-negativity, and its asymmetry
- Forward and reverse KL, and the different failures each tolerates
- Cross-entropy decomposed into entropy plus KL
- Mutual information, and its relation to conditional entropy
- Estimating these quantities from samples, and why that is hard

## Where the curriculum uses it

[Circuit Evaluation: Faithfulness, Completeness, and Minimality](/topics/circuit-evaluation/), [Logit Diff Amplification](/topics/logit-diff-amplification/), [Temporal Representations and Feature Extraction](/topics/temporal-feature-extraction/).
