---
title: "Covariance Matrices and Whitening"
description: "The covariance matrix of a random vector, its geometry as an ellipsoid, and the whitening transform that makes coordinates uncorrelated and unit-scale."
order: 7
status: placeholder
prerequisites:
  - title: "Expectation, Variance, and Covariance"
    url: "/topics/expectation-variance-and-covariance/"
  - title: "Quadratic Forms and Positive Semi-Definite Matrices"
    url: "/topics/quadratic-forms-and-psd-matrices/"
---

## Why this article exists

LEACE's erasure guarantee is stated in terms of the covariance between activations and a concept label, and its minimum-distortion property is measured in a whitened inner product. The geometry has to be in hand before the guarantee means anything.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The covariance matrix**

- $\Sigma = E[(\mathbf{x} - \boldsymbol{\mu})^T(\mathbf{x} - \boldsymbol{\mu})]$ with the row-vector convention stated
- Symmetry and positive semi-definiteness, proved
- Reading the diagonal and the off-diagonal entries

**2. Cross-covariance**

- $\text{Cov}(\mathbf{x}, y)$ between activations and a scalar label
- Why this is the object a linear probe's solution depends on
- The zero-cross-covariance condition, which is what linear erasure targets

**3. Geometry**

- The covariance ellipsoid, with principal axes from the eigendecomposition
- Anisotropy in real activation distributions, and how strong it is in practice
- Why 'large in Euclidean norm' and 'large relative to the data' are different claims

**4. Whitening**

- $\Sigma^{-1/2}$ and what it does to the ellipsoid
- ZCA versus PCA whitening, and why the choice is not arbitrary
- Numerical issues: near-singular covariance and shrinkage estimators

**5. Estimation from finite samples**

- The empirical covariance, and its bias
- How many samples a $d \times d$ covariance needs before it is usable
- Ledoit-Wolf shrinkage as the standard fix

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute and whiten an empirical covariance, and state what changed
- Explain why erasing a concept requires driving a cross-covariance to zero
- Say how many samples are needed before an activation covariance in $\mathbb{R}^{768}$ is trustworthy

## Sources to learn from

- Murphy, *Probabilistic Machine Learning: An Introduction*, sections 3.2 and 7.4 — Covariance matrices, the multivariate Gaussian, and their geometry.
- Kessy, Lewin & Strimmer, 'Optimal whitening and decorrelation' (2018) — Whitening is not unique. This paper enumerates the choices and what each preserves.
- Ledoit & Wolf, 'A well-conditioned estimator for large-dimensional covariance matrices' (2004) — Read the introduction for why the naive empirical covariance fails in high dimension.
- Belrose et al., 'LEACE: Perfect linear concept erasure in closed form' (2023) — The whole paper. It is the clearest demonstration of why the covariance geometry is the thing that matters.

## Where the curriculum uses it

[LEACE and Linear Concept Erasure](/topics/concept-erasure/), [Principal Component Analysis](/topics/principal-component-analysis/).
