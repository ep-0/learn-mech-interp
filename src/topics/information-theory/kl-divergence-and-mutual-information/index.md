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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. KL divergence**

- $D_{KL}(p \| q) = \sum p \log (p/q)$, and its decomposition into cross-entropy minus entropy
- Non-negativity via Jensen's inequality, proved
- Asymmetry, with a worked example where the two directions differ sharply

**2. Forward versus reverse KL**

- Mass-covering and mode-seeking behavior, with pictures
- Which one a maximum-likelihood objective minimizes
- Why the choice matters when comparing an ablated model to a full one

**3. Mutual information**

- $I(X;Y)$ defined three equivalent ways, and the proof they agree
- The relationship to conditional entropy
- The data processing inequality, and what it forbids

**4. Estimation**

- Plug-in estimators and their bias in high dimension
- Why mutual information between activations and a label is hard to estimate honestly
- Variational bounds mentioned, with a warning about how they are used in probing papers

**5. Use in circuit evaluation**

- KL between the full model's output distribution and an ablated model's, as a faithfulness metric
- Why KL is a stricter test than agreement on the top-1 token
- The choice of direction, and what each one penalizes

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute a KL divergence between two small categorical distributions in both directions
- Explain what a faithfulness score reported as KL is actually measuring
- Say why an information-theoretic probing result needs its estimator scrutinized

## Sources to learn from

- Cover & Thomas, *Elements of Information Theory*, chapter 2 — Start here. KL, mutual information, and the data processing inequality, done properly.
- MacKay, *Information Theory, Inference, and Learning Algorithms*, chapters 2 and 8 — The intuitive development, with better exercises.
- Chris Olah, 'Visual Information Theory' — Read again for KL specifically, once entropy is solid.
- Pimentel et al., 'Information-Theoretic Probing for Linguistic Structure' (arXiv:2004.03061) — The argument that probing accuracy is an estimate of mutual information, and what follows from taking that seriously.

## Where the curriculum uses it

[Circuit Evaluation: Faithfulness, Completeness, and Minimality](/topics/circuit-evaluation/), [Logit Diff Amplification](/topics/logit-diff-amplification/), [Temporal Representations and Feature Extraction](/topics/temporal-feature-extraction/).
