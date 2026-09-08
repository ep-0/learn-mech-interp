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

## What this article will cover

- Computation graphs and the forward pass as a record
- Reverse-mode differentiation as repeated vector-Jacobian products
- Why reverse mode is cheap for scalar outputs and forward mode is not
- Stop-gradients, detached tensors, and straight-through estimators
- Gradients with respect to activations rather than parameters, which is what attribution uses

## Where the curriculum uses it

[Attribution Patching and Path Patching](/topics/attribution-patching/), [Autoencoders and Reconstruction Objectives](/topics/autoencoders/), [PyTorch Tensors, Modules, and Hooks](/topics/pytorch-and-computation-graphs/), [Sequence Models Before Transformers](/topics/sequence-models-before-transformers/), [Training Deep Networks: SGD, Adam, and Schedules](/topics/training-dynamics-and-optimizers/).
