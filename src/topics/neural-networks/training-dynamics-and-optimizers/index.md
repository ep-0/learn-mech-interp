---
title: "Training Deep Networks: SGD, Adam, and Schedules"
description: "Minibatch stochastic gradient descent, momentum and adaptive methods, learning-rate schedules, and the failure modes that show up at scale."
order: 4
status: placeholder
prerequisites:
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"
  - title: "Supervised Learning, Generalization, and Overfitting"
    url: "/topics/supervised-learning-and-generalization/"
---

## Why this article exists

Phase changes during training, the emergence of induction heads, and the differences between a base model and its fine-tune are all statements about a training trajectory, not just a final weight vector.

## What this article will cover

- Minibatch SGD, batch size, and gradient noise
- Momentum, Adam, and what adaptive scaling changes
- Learning-rate schedules, warmup, and decay
- Initialization, exploding and vanishing gradients, and clipping
- Training curves, phase changes, and checkpoints as objects of study

## Where the curriculum uses it

[Normalization and Residual Connections](/topics/normalization-and-residual-connections/), [Pretraining, Fine-Tuning, and RLHF](/topics/pretraining-finetuning-and-rlhf/).
