---
title: "Tensors, Shapes, and Einsum Notation"
description: "Arrays with named axes, broadcasting rules, batched matrix products, and the index notation that makes multi-axis contractions readable."
order: 11
status: placeholder
prerequisites:
  - title: "Matrices as Linear Maps"
    url: "/topics/matrices-as-linear-maps/"
---

## Why this article exists

Interpretability code manipulates arrays with batch, position, head, and feature axes at once, and most implementation bugs are shape bugs. Index notation is how the papers and the libraries both express these contractions.

## What this article will cover

- Tensors as multi-axis arrays with named, meaningful axes
- Broadcasting rules and the errors they silently hide
- Contraction over an index, and matrix multiplication as its special case
- Einstein summation and `einsum` strings
- Batched and per-head operations, and the shape conventions used by TransformerLens

## Where the curriculum uses it

[PyTorch Tensors, Modules, and Hooks](/topics/pytorch-and-computation-graphs/).
