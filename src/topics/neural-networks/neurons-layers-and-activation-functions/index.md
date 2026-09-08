---
title: "Neurons, Layers, and Activation Functions"
description: "The affine-then-nonlinear building block, what stacking it buys, and how ReLU, GELU, and their relatives differ."
order: 1
status: placeholder
prerequisites:
  - title: "Linear and Logistic Regression"
    url: "/topics/linear-and-logistic-regression/"
---

## Why this article exists

A transformer MLP is two of these layers, and the question of whether a single neuron means anything, which motivates superposition and sparse autoencoders, is a question about this building block.

## What this article will cover

- The affine map plus nonlinearity, and why the nonlinearity is required
- Layers, depth, width, and what composition adds
- ReLU, GELU, SiLU, and their gradients
- Universal approximation, and what it does and does not promise
- Neurons as basis directions, and the first hint that they are not privileged

## Where the curriculum uses it

[Backpropagation and Automatic Differentiation](/topics/backpropagation-and-autodiff/), [Embeddings and Distributed Representations](/topics/embeddings-and-distributed-representations/), [Softmax and the Cross-Entropy Loss](/topics/softmax-and-cross-entropy-loss/).
