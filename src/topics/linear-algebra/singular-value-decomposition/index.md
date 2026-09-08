---
title: "The Singular Value Decomposition"
description: "Factoring any matrix into a rotation, a scaling, and a rotation, and reading rank, best low-rank approximation, and effective dimension off the singular values."
order: 8
status: placeholder
prerequisites:
  - title: "Eigenvectors, Eigenvalues, and Diagonalization"
    url: "/topics/eigenvectors-and-diagonalization/"
  - title: "Rank and Low-Rank Factorization"
    url: "/topics/matrix-rank-and-low-rank-factorization/"
  - title: "Orthogonality and Projections"
    url: "/topics/orthogonality-and-projections/"
---

## Why this article exists

The SVD is the general-purpose tool for asking what a weight matrix or an activation dataset actually does: how many directions it uses, which ones matter most, and what the best low-rank summary of it is.

## What this article will cover

- The decomposition $M = U \Sigma V^T$ and what each factor does
- Singular values, singular vectors, and their relation to eigenvectors of $M^T M$
- The Eckart-Young theorem and best rank-$k$ approximation
- Effective rank, spectral decay, and reading a singular value spectrum
- The pseudoinverse and numerical rank in floating point

## Where the curriculum uses it

[Intrinsic Dimension and Dimensionality Reduction](/topics/intrinsic-dimension-and-dimensionality-reduction/), [Least Squares and the Pseudoinverse](/topics/least-squares-and-the-pseudoinverse/), [Principal Component Analysis](/topics/principal-component-analysis/).
