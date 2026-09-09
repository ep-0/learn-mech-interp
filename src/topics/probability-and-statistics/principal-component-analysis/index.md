---
title: "Principal Component Analysis"
description: "Finding the directions of greatest variance in a dataset, the equivalence between the eigendecomposition and SVD routes, and what PCA does and does not recover."
order: 8
status: placeholder
prerequisites:
  - title: "Covariance Matrices and Whitening"
    url: "/topics/covariance-matrices-and-whitening/"
  - title: "The Singular Value Decomposition"
    url: "/topics/singular-value-decomposition/"
---

## Why this article exists

PCA is the first thing anyone runs on a set of activations, and several results in the curriculum, from the geometry of truth to unsupervised direction discovery, begin with a principal component and a claim about what it means.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The variance-maximizing formulation**

- Finding the direction of greatest projected variance, set up as a constrained problem
- The solution as the top eigenvector of the covariance matrix
- Successive components under an orthogonality constraint

**2. The reconstruction-error formulation**

- Minimizing squared reconstruction error over rank-$k$ projections
- Proving the two formulations give the same answer
- The connection to a linear autoencoder, which returns later

**3. Computation**

- PCA via the SVD of the centered data matrix, and why that is preferred
- Explained variance ratios and the scree plot
- Choosing $k$: elbow, cumulative variance, and the honest answer that it depends on the use

**4. Preprocessing decisions**

- Centering, and what PCA computes if you forget
- Scaling, and when to standardize features first
- How these choices change which direction comes out on top

**5. Reading a principal component**

- A high-variance direction need not correspond to anything meaningful
- The first component of a contrast set often does, and why that is a different claim
- Concrete cautions from interpretability results that leaned on PC1

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Run PCA two ways on the same activations and confirm they agree
- Interpret a scree plot and defend a choice of $k$
- Argue both for and against reading a specific principal component as a concept direction

## Sources to learn from

- Bishop, *Pattern Recognition and Machine Learning*, chapter 12.1 — Both formulations of PCA, derived carefully, plus the probabilistic version.
- Blum, Hopcroft & Kannan, *Foundations of Data Science*, chapter 3 — PCA through the SVD, with the approximation guarantees.
- Implement it twice: once as the eigendecomposition of the covariance matrix, once through the SVD of the centred data, and check they agree — The equivalence is stated everywhere and understood after you have made the centring mistake yourself.
- Jonathon Shlens, 'A Tutorial on Principal Component Analysis' (arXiv:1404.1100) — Short, geometric, and good on the assumptions PCA is making.
- Burns et al., 'Discovering Latent Knowledge in Language Models Without Supervision' (arXiv:2212.03827) — An interpretability method built on this machinery, and useful for seeing what such methods do and do not establish.

## Where the curriculum uses it

[Linear Artificial Tomography (LAT)](/topics/lat-probing/), [Truthfulness Probing and the Geometry of Truth](/topics/truthfulness-probing/).
