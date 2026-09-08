---
title: "Softmax and the Cross-Entropy Loss"
description: "Turning a vector of scores into a distribution, why differences of logits are the meaningful quantity, and the loss that pairs with it."
order: 2
status: placeholder
prerequisites:
  - title: "Neurons, Layers, and Activation Functions"
    url: "/topics/neurons-layers-and-activation-functions/"
  - title: "Entropy, Cross-Entropy, and Perplexity"
    url: "/topics/entropy-and-cross-entropy/"
---

## Why this article exists

Attention weights are a softmax over scores and next-token predictions are a softmax over logits. The shift-invariance of that function is why the curriculum measures logit differences rather than logits.

## What this article will cover

- The softmax function, temperature, and its shift invariance
- Logits as unnormalized log-probabilities
- Cross-entropy loss and its gradient, which is elegantly simple
- Logit differences as the invariant quantity, and logit-difference metrics
- Saturation, and why a confident softmax has vanishing gradients

## Where the curriculum uses it

[Language Modeling and Next-Token Prediction](/topics/language-modeling-and-next-token-prediction/).
