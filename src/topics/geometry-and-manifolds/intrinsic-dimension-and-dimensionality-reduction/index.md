---
title: "Intrinsic Dimension and Dimensionality Reduction"
description: "Estimating how many dimensions a dataset actually occupies, and the linear and nonlinear methods that produce a low-dimensional view of it."
order: 3
status: placeholder
prerequisites:
  - title: "The Singular Value Decomposition"
    url: "/topics/singular-value-decomposition/"
  - title: "Manifolds, Charts, and Tangent Spaces"
    url: "/topics/manifolds-and-tangent-spaces/"
---

## Why this article exists

Claims that a model represents a concept in a small number of dimensions are estimates of intrinsic dimension, and the visualizations used to support them are dimensionality reductions with their own distortions.

## What this article will cover

- Intrinsic versus ambient dimension
- Participation ratio, spectral, and nearest-neighbor estimators
- Linear reduction with PCA, and where it fails on curved data
- Nonlinear methods: diffusion maps, UMAP, t-SNE, and what they preserve
- Reading a low-dimensional plot without over-reading it

## Where the curriculum uses it

[Discovering and Interpreting Neural Manifolds](/topics/neural-manifolds/).
