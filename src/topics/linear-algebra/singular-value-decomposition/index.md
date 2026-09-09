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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The decomposition**

- $M = U \Sigma V^T$ with the geometric reading: rotate, scale each axis, rotate
- Existence for every matrix, including non-square and rank-deficient ones
- Relation to eigendecomposition of $M^TM$ and $MM^T$

**2. Reading the spectrum**

- Singular values as the scaling factors, sorted
- Rank as the number of nonzero singular values, and numerical rank as the number of large ones
- Effective rank, participation ratio, and what a slowly decaying spectrum indicates

**3. Best low-rank approximation**

- The Eckart-Young theorem, stated for the spectral and Frobenius norms
- Truncating the SVD, with a worked reconstruction-error calculation
- Why this makes the SVD the default tool for 'how many directions does this actually use'

**4. Computational notes**

- Thin versus full SVD, and which one you want on transformer-sized matrices
- Conditioning, and the pseudoinverse defined through the SVD
- Randomized SVD when the matrix is too large to decompose exactly

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Interpret a singular value spectrum plot and state what it implies about effective dimension
- Produce the best rank-$k$ approximation to a matrix and bound its error
- Explain the relationship between the SVD, PCA, and least squares in one paragraph

## Sources to learn from

- Trefethen & Bau, *Numerical Linear Algebra*, lectures 4-5 — The best short treatment of the SVD as geometry, from people who also compute it.
- Strang, *Introduction to Linear Algebra*, chapter 7 — The SVD tied to the four subspaces, plus applications.
- MIT OCW 18.06SC, Unit III problem sets — Free, with solutions. Compute a small SVD by hand once. It is tedious and it is the only way the relationship to the eigendecomposition of $A^TA$ becomes concrete.
- Blum, Hopcroft & Kannan, *Foundations of Data Science*, chapter 3 — Best-fit subspaces and the SVD, developed for data rather than for matrices. Freely available.
- Gavish & Donoho, 'The optimal hard threshold for singular values is 4/sqrt(3)' — Optional, and worth it the first time you have to decide where to truncate a spectrum on real data.

## Where the curriculum uses it

[Intrinsic Dimension and Dimensionality Reduction](/topics/intrinsic-dimension-and-dimensionality-reduction/), [Least Squares and the Pseudoinverse](/topics/least-squares-and-the-pseudoinverse/), [Principal Component Analysis](/topics/principal-component-analysis/).
