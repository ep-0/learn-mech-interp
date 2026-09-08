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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Intrinsic versus ambient dimension**

- The distinction, with a curve in $\mathbb{R}^{100}$ as the example
- Why activations in $\mathbb{R}^{4096}$ may occupy far fewer dimensions
- Local versus global intrinsic dimension

**2. Estimators**

- Participation ratio and spectral estimators from the covariance eigenvalues
- Nearest-neighbor estimators, including the two-nearest-neighbor method
- Their disagreements, and why reporting one number is usually overclaiming

**3. Linear reduction**

- PCA as the linear method, and its failure on a curved manifold, shown concretely
- Random projection as the cheap alternative, justified by Johnson-Lindenstrauss
- When linear is enough

**4. Nonlinear methods**

- t-SNE and UMAP, what each optimizes, and what each preserves
- Diffusion maps and Isomap, briefly
- The standard failures: cluster sizes, inter-cluster distances, and apparent structure from hyperparameters

**5. Reading a low-dimensional plot honestly**

- What can and cannot be concluded from a UMAP of activations
- Controls: re-run with different seeds and hyperparameters before believing a shape
- When to trust the plot as evidence rather than as illustration

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Estimate the intrinsic dimension of an activation set two ways and reconcile the answers
- List three conclusions a t-SNE plot does not support
- Choose between linear and nonlinear reduction for a stated question, and justify it

## Sources to learn from

- Wattenberg, Viégas & Johnson, 'How to Use t-SNE Effectively' (Distill, 2016) — Interactive, and the fastest way to learn what these plots do not mean.
- Coenen & Pearce, 'Understanding UMAP' (pair-code.github.io) — The same treatment for UMAP, including the hyperparameter sensitivity.
- Facco et al., 'Estimating the intrinsic dimension of datasets by a minimal neighborhood information' (Scientific Reports, 2017) — The two-nearest-neighbor estimator, widely used on activations.
- Ansuini et al., 'Intrinsic dimension of data representations in deep neural networks' (NeurIPS 2019) — The application to network representations, with the hunchback profile result.

## Where the curriculum uses it

[Discovering and Interpreting Neural Manifolds](/topics/neural-manifolds/).
