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

## What this article will cover

- The covariance matrix of a random vector and its PSD structure
- Cross-covariance between two random vectors
- The covariance ellipsoid and principal axes
- Whitening, and why it changes which directions look large
- Empirical covariance from finite samples, and its estimation error

## Where the curriculum uses it

[LEACE and Linear Concept Erasure](/topics/concept-erasure/), [Principal Component Analysis](/topics/principal-component-analysis/).
