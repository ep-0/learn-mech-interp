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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The problem**

- Objective, feasible set, minimizer versus minimum
- Stationary points, and why $\nabla f = 0$ is necessary but not sufficient
- Global versus local minima

**2. Gradient descent**

- The update rule, derived from the first-order approximation
- Learning rate: too small, too large, and the divergence threshold
- Convergence for smooth functions, stated with its assumption

**3. Convexity**

- Convex sets and functions, with the second-derivative test
- What convexity guarantees: every local minimum is global
- Why almost nothing in deep learning is convex, and why the theory is still worth having

**4. Non-convex landscapes**

- Saddle points outnumbering local minima in high dimension
- Plateaus, sharp and flat minima, and what 'flat' is measured by
- The honest summary of what is and is not known about why SGD works

**5. Conditioning**

- Ill-conditioned quadratics, and the zig-zag picture
- Condition number as the ratio of Hessian eigenvalues
- Preconditioning as the fix, previewing adaptive optimizers

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Predict whether a given learning rate will converge on a quadratic objective
- Explain why saddle points, not local minima, are the relevant obstacle in high dimension
- Describe what optimizing a steering vector is actually solving for

## Sources to learn from

- Boyd & Vandenberghe, *Convex Optimization*, chapters 2-3 and 9 — Convexity and descent methods, done rigorously. Freely available. Skip the interior-point material.
- Goodfellow et al., *Deep Learning*, chapters 4 and 8 — Numerical computation and optimization for deep models, including the saddle-point discussion.
- Nocedal & Wright, *Numerical Optimization*, chapters 2-3 — Line search and convergence rates, if you want the analysis.
- Gabriel Goh, 'Why Momentum Really Works' (Distill, 2017) — The clearest account of conditioning and why it makes plain gradient descent slow.

## Where the curriculum uses it

[Constrained Optimization and Lagrange Multipliers](/topics/constrained-optimization-and-lagrange-multipliers/), [Linear and Logistic Regression](/topics/linear-and-logistic-regression/), [Sparsity, L1, and Regularization](/topics/sparsity-and-regularization/).
