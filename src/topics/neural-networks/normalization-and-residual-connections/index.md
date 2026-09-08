---
title: "Normalization and Residual Connections"
description: "Why deep networks add skip connections and normalize activations, what BatchNorm, LayerNorm, and RMSNorm each compute, and what those choices cost in interpretability."
order: 5
status: placeholder
prerequisites:
  - title: "Training Deep Networks: SGD, Adam, and Schedules"
    url: "/topics/training-dynamics-and-optimizers/"
---

## Why this article exists

The residual stream is a skip connection read as a shared communication channel, and layer normalization is the one component that breaks the additive decomposition circuit analysis depends on.

## What this article will cover

- Residual connections, and why they make depth trainable
- The residual stream as an additive accumulator of component outputs
- BatchNorm, LayerNorm, and RMSNorm, and what each normalizes over
- Pre-norm versus post-norm placement
- Input-dependent rescaling, and the nonlinearity it smuggles into an otherwise linear path

## Where the curriculum uses it

[Layer Normalization](/topics/layer-normalization/).
