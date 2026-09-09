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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Coordinates depend on a choice**

- The same vector written in two bases, worked numerically in $\mathbb{R}^2$
- The change-of-basis matrix, and which direction it converts
- A common error: confusing the matrix that changes coordinates with the one that changes the map

**2. Transforming a linear map**

- The similarity transform $B^{-1} A B$, derived rather than asserted
- What it means for two matrices to represent the same map
- Invariants: rank, trace, determinant, eigenvalues

**3. Orthonormal bases**

- Why coordinates in an orthonormal basis are just dot products
- Orthogonal matrices, and change of basis as rotation and reflection
- The inverse being the transpose, and why that makes them cheap

**4. Privileged bases**

- A basis is privileged when something in the architecture treats coordinates separately
- Elementwise nonlinearities and per-coordinate normalization as the sources of privilege
- The residual stream has no such mechanism acting on it directly, which is the setup for the whole feature-finding project

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Convert a vector and a matrix between two bases and check the result
- Say which properties of a matrix survive a change of basis and which do not
- Explain what makes a neuron basis privileged and the residual stream basis not

## Sources to learn from

- 3Blue1Brown, *Essence of Linear Algebra*, chapter 13 (change of basis) — Start here. The clearest available explanation of $B^{-1} A B$.
- Axler, *Linear Algebra Done Right*, sections on matrices of linear maps and invertibility — For the treatment that keeps the map and its matrix distinct throughout.
- MIT OCW 18.06SC, the change-of-basis and similarity problem sets — Free, with solutions. Convert a vector and a matrix by hand several times; the direction of $B^{-1}AB$ will not stick otherwise.
- Elhage et al., 'A Mathematical Framework for Transformer Circuits', the discussion of privileged bases — The source of the privileged-basis vocabulary as this field uses it.
- Chris Olah, 'Distributed Representations: Composition and Superposition' and the Distill circuits thread — Background on why the choice of basis is the central question in feature interpretation.

## Where the curriculum uses it

[Eigenvectors, Eigenvalues, and Diagonalization](/topics/eigenvectors-and-diagonalization/), [Orthogonality and Projections](/topics/orthogonality-and-projections/), [Rank and Low-Rank Factorization](/topics/matrix-rank-and-low-rank-factorization/).
