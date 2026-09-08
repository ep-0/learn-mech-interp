---
title: "Entropy, Cross-Entropy, and Perplexity"
description: "Information content as surprise, entropy as its expectation, and the cross-entropy loss and perplexity that language modeling reports."
order: 1
status: placeholder
prerequisites:
  - title: "Expectation, Variance, and Covariance"
    url: "/topics/expectation-variance-and-covariance/"
---

## Why this article exists

Cross-entropy is the loss every language model is trained on, and perplexity is how its quality is quoted. Interpretability results are frequently reported as a change in that loss, so the units matter.

## What this article will cover

- Surprisal, and why information is measured in $-\log p$
- Entropy as expected surprisal, and its maximum for a given support
- Cross-entropy between a model and a data distribution
- Perplexity, bits per token, and converting between them
- Conditional entropy and the entropy of a sequence model

## Where the curriculum uses it

[KL Divergence and Mutual Information](/topics/kl-divergence-and-mutual-information/), [Softmax and the Cross-Entropy Loss](/topics/softmax-and-cross-entropy-loss/).
