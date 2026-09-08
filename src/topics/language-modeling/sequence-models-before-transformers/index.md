---
title: "Sequence Models Before Transformers"
description: "N-gram models, recurrent networks, and early attention, and the specific limitations that the transformer architecture was designed to remove."
order: 3
status: placeholder
prerequisites:
  - title: "Language Modeling and Next-Token Prediction"
    url: "/topics/language-modeling-and-next-token-prediction/"
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"
---

## Why this article exists

Attention is easier to understand as an answer to a problem than as a formula, and the problem is the fixed-size bottleneck that recurrent encoders forced information through.

## What this article will cover

- N-gram models, smoothing, and their context limits
- Recurrent networks, hidden state, and backpropagation through time
- Vanishing gradients, LSTMs, and long-range dependence
- Encoder-decoder models and the fixed-vector bottleneck
- Additive attention as the fix, and what carried over into self-attention
