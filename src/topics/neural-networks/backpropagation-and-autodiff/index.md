---
title: "Backpropagation and Automatic Differentiation"
description: "Computation graphs, reverse-mode differentiation, and how a framework turns a forward pass into gradients for every parameter."
order: 3
status: placeholder
prerequisites:
  - title: "Neurons, Layers, and Activation Functions"
    url: "/topics/neurons-layers-and-activation-functions/"
  - title: "Jacobians and Hessians"
    url: "/topics/jacobians-and-hessians/"
---

## Why this article exists

Attribution patching, integrated-gradient circuit discovery, and every hook-based intervention library are built directly on the computation graph, so the mechanics of reverse-mode differentiation are load-bearing rather than incidental.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Computation graphs**

- The forward pass recorded as a DAG of primitive operations
- Intermediate values retained for the backward pass, and the memory this costs
- A small graph worked by hand, forward and backward

**2. Reverse mode**

- Propagating $\partial L / \partial \cdot$ backwards as repeated vector-Jacobian products
- Why one backward pass yields the gradient with respect to every node
- The cost comparison with forward mode, and when each wins

**3. What frameworks actually do**

- Tape-based autodiff, and how `requires_grad` decides what is recorded
- `detach`, `no_grad`, and stop-gradients, with the effect of each
- Straight-through estimators for non-differentiable operations

**4. Gradients with respect to activations**

- The distinction from gradients with respect to parameters
- Why interpretability wants the former, and how to get it in practice
- This is the quantity every gradient-based attribution method uses

**5. Checking gradients**

- Finite-difference verification, and the step size that makes it meaningful
- Common bugs: in-place operations, and hooks that fire at the wrong point

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Hand-compute a backward pass through a small graph and verify it numerically
- Explain what quantity attribution patching multiplies together and where each factor comes from
- Say precisely what a straight-through estimator substitutes for a missing gradient

## Sources to learn from

- Karpathy, 'The spelled-out intro to neural networks and backpropagation' (micrograd) — Start here. Build reverse-mode autodiff from nothing. Two hours, and it removes all mystery.
- Baydin et al., 'Automatic Differentiation in Machine Learning: a Survey' (arXiv:1502.05767) — The modes, the terminology, and the misconceptions the field carries.
- Goodfellow et al., *Deep Learning*, sections 6.5 — Backpropagation stated with computation graphs.
- The PyTorch autograd mechanics documentation — How the tape, hooks, and `no_grad` actually behave, which matters for writing interventions.

## Where the curriculum uses it

[Attribution Patching and Path Patching](/topics/attribution-patching/), [Autoencoders and Reconstruction Objectives](/topics/autoencoders/), [PyTorch Tensors, Modules, and Hooks](/topics/pytorch-and-computation-graphs/), [Sequence Models Before Transformers](/topics/sequence-models-before-transformers/), [Training Deep Networks: SGD, Adam, and Schedules](/topics/training-dynamics-and-optimizers/).
