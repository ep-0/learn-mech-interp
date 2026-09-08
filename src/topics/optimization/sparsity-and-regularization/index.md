---
title: "Sparsity, L1, and Regularization"
description: "Penalties added to an objective, why the L1 norm produces exact zeros where L2 does not, and the sparsity-fidelity tradeoff a penalty coefficient controls."
order: 3
status: placeholder
prerequisites:
  - title: "Optimization and Gradient Descent"
    url: "/topics/optimization-and-gradient-descent/"
  - title: "Dot Products, Norms, and Angles"
    url: "/topics/dot-products-norms-and-angles/"
---

## Why this article exists

A sparse autoencoder is a reconstruction objective plus a sparsity penalty, and almost every design question about SAEs, including which variant to use, is a question about how that penalty behaves.

## What this article will cover

- Regularization as a penalty on the objective, and as a constraint
- L2 shrinkage versus L1 sparsity, and the geometric reason for the difference
- The L0 count, its intractability, and L1 as a relaxation
- Soft thresholding, proximal steps, and shrinkage of small coefficients
- The sparsity-fidelity frontier traded off by the penalty coefficient

## Where the curriculum uses it

[Sparse Coding and Dictionary Learning](/topics/sparse-coding-and-dictionary-learning/), [Training Models to Be Interpretable](/topics/weight-sparse-training/).
