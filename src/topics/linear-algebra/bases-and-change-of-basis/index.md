---
title: "Bases, Coordinates, and Change of Basis"
description: "How the same vector gets different coordinates in different bases, what a change-of-basis matrix does, and which quantities survive the change unchanged."
order: 4
status: placeholder
prerequisites:
  - title: "Matrices as Linear Maps"
    url: "/topics/matrices-as-linear-maps/"
---

## Why this article exists

The claim that a residual stream basis is not privileged, which motivates most of the search for features, is a change-of-basis claim: rotate the basis, compensate in every weight matrix, and the function is unchanged. That argument needs this machinery stated precisely.

## What this article will cover

- Coordinates as the representation of a vector in a chosen basis
- Change-of-basis matrices and the similarity transform $B^{-1} A B$
- Orthonormal bases and why they make coordinates cheap to compute
- Basis-dependent versus basis-independent quantities
- Privileged bases, and what makes a basis privileged in a network

## Where the curriculum uses it

[Eigenvectors, Eigenvalues, and Diagonalization](/topics/eigenvectors-and-diagonalization/), [Orthogonality and Projections](/topics/orthogonality-and-projections/), [Rank and Low-Rank Factorization](/topics/matrix-rank-and-low-rank-factorization/).
