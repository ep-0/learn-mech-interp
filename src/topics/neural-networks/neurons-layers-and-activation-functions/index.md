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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The building block**

- $\mathbf{h} = f(\mathbf{x}W + \mathbf{b})$, with shapes stated
- Why the nonlinearity is required: without it, depth collapses to a single matrix
- A worked two-layer example computed by hand

**2. Activation functions**

- ReLU, GELU, SiLU, sigmoid, tanh: definitions, shapes, and gradients
- Dead units, saturation, and the practical reasons GELU displaced ReLU in transformers
- Gated variants (GLU, SwiGLU) as used in current models

**3. Depth and width**

- What composition buys, with the piecewise-linear region-counting argument for ReLU networks
- Universal approximation, stated precisely and then deflated: it says nothing about learnability
- Parameter counts in a transformer MLP block

**4. Neurons as a basis**

- The elementwise nonlinearity makes the neuron basis privileged
- Polysemantic neurons, introduced as an empirical observation
- The question this sets up: if a neuron is not a feature, what is

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute a forward pass through a two-layer MLP by hand and check the shapes
- Explain why the activation function is what makes the neuron basis special
- State what universal approximation does and does not promise

## Sources to learn from

- Karpathy, 'Neural Networks: Zero to Hero', videos 1-3 — Build the thing from scratch. This is the fastest route to a working mental model.
- Goodfellow et al., *Deep Learning*, chapter 6 — Feedforward networks, activation functions, and the approximation results.
- Prince, *Understanding Deep Learning*, chapters 3-4 — Shallow then deep networks, built up carefully and with the exercises to make it stick. Free, and the best current first textbook.
- Bishop & Bishop, *Deep Learning: Foundations and Concepts*, chapters 6-7 — A modern textbook treatment, more current than PRML on architecture.
- Elhage et al., 'Toy Models of Superposition', the polysemanticity sections — Read for the empirical claim that neurons are not features. It motivates the rest of the curriculum.

## Where the curriculum uses it

[Backpropagation and Automatic Differentiation](/topics/backpropagation-and-autodiff/), [Embeddings and Distributed Representations](/topics/embeddings-and-distributed-representations/), [Softmax and the Cross-Entropy Loss](/topics/softmax-and-cross-entropy-loss/).
