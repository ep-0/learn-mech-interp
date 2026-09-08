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

## What this article will cover

- Maximizing projected variance, and the eigenvector solution
- PCA via the SVD of the centered data matrix
- Explained variance, scree plots, and choosing a number of components
- Centering, scaling, and how preprocessing changes the answer
- Why a high-variance direction need not be a meaningful one

## Where the curriculum uses it

[Linear Artificial Tomography (LAT)](/topics/lat-probing/), [Truthfulness Probing and the Geometry of Truth](/topics/truthfulness-probing/).
