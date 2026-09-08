---
title: "Optimization and Gradient Descent"
description: "Minimizing a differentiable objective by following the negative gradient, what step size controls, and how convex and non-convex problems differ."
order: 1
status: placeholder
prerequisites:
  - title: "Partial Derivatives and Gradients"
    url: "/topics/partial-derivatives-and-gradients/"
---

## Why this article exists

Every learned object in this curriculum, from a probe to a sparse autoencoder to a steering vector found by optimization, is the output of a gradient descent run, with all the local-minimum and step-size caveats that implies.

## What this article will cover

- Objectives, minima, and stationary points
- Gradient descent, learning rate, and convergence
- Convexity, and what it guarantees that the non-convex case does not
- Saddle points, local minima, and the geometry of high-dimensional loss surfaces
- Conditioning, and why badly scaled coordinates slow descent

## Where the curriculum uses it

[Constrained Optimization and Lagrange Multipliers](/topics/constrained-optimization-and-lagrange-multipliers/), [Linear and Logistic Regression](/topics/linear-and-logistic-regression/), [Sparsity, L1, and Regularization](/topics/sparsity-and-regularization/).
