---
title: "Language Modeling and Next-Token Prediction"
description: "Factoring the probability of a sequence into next-token conditionals, the training objective that follows, and what the resulting model is and is not."
order: 1
status: placeholder
prerequisites:
  - title: "Softmax and the Cross-Entropy Loss"
    url: "/topics/softmax-and-cross-entropy-loss/"
---

## Why this article exists

Everything the curriculum interprets is a next-token predictor, and a surprising number of confusions about model behavior dissolve once the objective it was actually trained on is clear.

## What this article will cover

- The autoregressive factorization of sequence probability
- Teacher forcing and the training objective
- Causal masking, and why a decoder cannot see the future
- Perplexity and loss as measures of model quality
- Masked versus causal language modeling

## Where the curriculum uses it

[Pretraining, Fine-Tuning, and RLHF](/topics/pretraining-finetuning-and-rlhf/), [Sequence Models Before Transformers](/topics/sequence-models-before-transformers/), [Tokenization and Subword Vocabularies](/topics/tokenization/).
