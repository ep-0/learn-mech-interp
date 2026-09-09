---
title: "Quadratic Forms and Positive Semi-Definite Matrices"
description: "Functions of the form x A x^T, what positive semi-definiteness means geometrically, and the square roots and whitening transforms that PSD matrices support."
order: 9
status: placeholder
prerequisites:
  - title: "Eigenvectors, Eigenvalues, and Diagonalization"
    url: "/topics/eigenvectors-and-diagonalization/"
---

## Why this article exists

Covariance matrices, Hessians, and the Mahalanobis distances used in concept erasure are all quadratic forms, and their positive semi-definiteness is what makes square roots, whitening, and closed-form minimizations available.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Quadratic forms**

- $q(\mathbf{x}) = \mathbf{x} A \mathbf{x}^T$, and why only the symmetric part of $A$ matters
- Level sets as conics and, in higher dimensions, ellipsoids
- The eigenbasis as the principal axes of those level sets

**2. Definiteness**

- Positive definite, positive semi-definite, negative, and indefinite, defined by the sign of $q$
- The eigenvalue characterization, and why it is the usable test
- Sylvester's criterion mentioned, and why nobody uses it at scale

**3. Square roots and whitening**

- $A^{1/2}$ for a PSD matrix via the eigendecomposition, and its uniqueness
- The whitening transform $A^{-1/2}$, and what it does to the level sets
- Cholesky as the practical factorization

**4. Induced inner products and distances**

- $\langle \mathbf{x}, \mathbf{y} \rangle_A = \mathbf{x} A \mathbf{y}^T$ as a valid inner product when $A$ is positive definite
- Mahalanobis distance, and the sense in which it measures 'how surprising' rather than 'how far'
- Where this returns: minimum-distortion erasure is measured in exactly such a norm

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Test a small matrix for positive semi-definiteness and interpret the result geometrically
- Whiten a covariance matrix and say what the transform did to the data
- Explain why 'closest point' depends on the inner product, with a two-dimensional example

## Sources to learn from

- Strang, *Introduction to Linear Algebra*, chapter 6 (positive definite matrices) — Start here. The tests, the geometry, and the connection to minima.
- Boyd & Vandenberghe, *Convex Optimization*, appendix A and section 3.1 — Quadratic forms and definiteness in the notation the optimization literature uses. Freely available from the authors.
- Strang, *Introduction to Linear Algebra*, the chapter 6 exercises, and Boyd & Vandenberghe's chapter 3 exercises — Test definiteness by hand several ways (pivots, eigenvalues, completing the square) until you can pick the cheapest one for a given matrix.
- Petersen & Pedersen, *The Matrix Cookbook* — A reference, not a text. Bookmark it for identities involving quadratic forms and derivatives.
- Kessy, Lewin & Strimmer, 'Optimal whitening and decorrelation' — Whitening is not unique, and this paper is the clearest account of which choice does what.

## Where the curriculum uses it

[Covariance Matrices and Whitening](/topics/covariance-matrices-and-whitening/).
