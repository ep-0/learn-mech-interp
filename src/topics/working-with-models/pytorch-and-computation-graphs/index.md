---
title: "PyTorch Tensors, Modules, and Hooks"
description: "The tensor and module abstractions interpretability tooling is built on, and the forward and backward hooks that make reading and editing activations possible."
order: 1
status: placeholder
prerequisites:
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"
  - title: "Tensors, Shapes, and Einsum Notation"
    url: "/topics/tensors-and-einsum-notation/"
---

## Why this article exists

TransformerLens, nnsight, and SAE Lens are all wrappers over the same hook mechanism, and knowing what a hook is makes the difference between using those libraries and being able to check what they did.

## What this article will cover

- Tensors, devices, dtypes, and the shape conventions used for transformers
- Modules, parameters, buffers, and the module tree
- Forward hooks, backward hooks, and where they fire
- no_grad, inference mode, and when gradients are still needed
- Caching activations, editing them in place, and the memory cost of both

## Where the curriculum uses it

[ARENA: Hands-On Technical Training](/topics/arena/), [TransformerLens](/topics/transformerlens/).
