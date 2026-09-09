---
title: "Tensors, Shapes, and Einsum Notation"
description: "Arrays with named axes, broadcasting rules, batched matrix products, and the index notation that makes multi-axis contractions readable."
order: 11
status: placeholder
prerequisites:
  - title: "Matrices as Linear Maps"
    url: "/topics/matrices-as-linear-maps/"
  - title: "Arrays and Numerical Python"
    url: "/topics/arrays-and-numerical-python/"
---

## Why this article exists

Interpretability code manipulates arrays with batch, position, head, and feature axes at once, and most implementation bugs are shape bugs. Index notation is how the papers and the libraries both express these contractions.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Arrays with meaningful axes**

- The standard transformer activation shape `[batch, position, d_model]`, and where `head` gets inserted
- Why naming axes beats remembering their order
- Reshape, view, transpose, and permute, and which of them move memory

**2. Broadcasting**

- The alignment rules, stated exactly
- A worked example that broadcasts silently and produces a wrong-but-valid result
- Defensive habits: assert shapes, or use a named-tensor library

**3. Contraction**

- Summing over a shared index as the general operation
- Matrix multiplication, batched matmul, and dot products as special cases
- Einstein summation convention, and reading an `einsum` string aloud

**4. The shapes this curriculum uses**

- $W_Q, W_K, W_V \in \mathbb{R}^{d_{\text{model}} \times d_{\text{head}}}$ per head, and $W_O$ back
- TransformerLens conventions for `W_in` and `W_out`
- SAE encoder and decoder shapes, previewed

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Write an `einsum` for a per-head attention computation and predict the output shape
- Spot a broadcasting bug by reading shapes rather than by running the code
- Translate between a paper's index notation and working array code

## Sources to learn from

- Tim Rocktäschel, 'Einsum is All You Need' — The standard short introduction to `einsum`, with worked examples.
- Alexander Rush, 'Tensor Considered Harmful' and the `einops` documentation — The argument for named axes, plus the library most interpretability code now uses.
- The `einops` tutorial notebooks, parts 1-2 — Free and runnable. Work them rather than reading them: shape errors are learned by making them, and this is the cheapest place to make them.
- The PyTorch broadcasting semantics documentation — Short, exact, and worth reading once rather than inferring from behavior.
- Neel Nanda's TransformerLens documentation, the section on activation and weight shapes — The specific conventions you will be reading and writing against.

## Where the curriculum uses it

[PyTorch Tensors, Modules, and Hooks](/topics/pytorch-and-computation-graphs/).
