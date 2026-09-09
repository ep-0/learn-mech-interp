---
title: "Sparsity, L1, and Regularization"
description: "Penalties added to an objective, why the L1 norm produces exact zeros where L2 does not, and the sparsity-fidelity tradeoff a penalty coefficient controls."
order: 3
status: placeholder
prerequisites:
  - title: "Optimization and Gradient Descent"
    url: "/topics/optimization-and-gradient-descent/"
  - title: "Dot Products, Norms, and Angles"
    url: "/topics/dot-products-norms-and-angles/"
---

## Why this article exists

A sparse autoencoder is a reconstruction objective plus a sparsity penalty, and almost every design question about SAEs, including which variant to use, is a question about how that penalty behaves.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Regularization two ways**

- The penalized form $\min f(\mathbf{w}) + \lambda R(\mathbf{w})$ and the constrained form
- Their equivalence, and how $\lambda$ maps to a constraint radius
- What regularization is for: not just overfitting, but selecting among equally good solutions

**2. L2 versus L1**

- L2 shrinks everything, L1 zeroes some coordinates: show this, do not assert it
- The geometric argument with the constraint-ball corners
- The subgradient argument, which is the one that generalizes

**3. L0 and its relaxation**

- Counting nonzeros as the objective we actually want
- NP-hardness, and L1 as the convex relaxation
- When the relaxation recovers the L0 solution, stated as a condition rather than a hope

**4. Proximal methods**

- Soft thresholding as the proximal operator of L1, derived
- ISTA, and why the update is 'gradient step then shrink'
- Straight-through estimators as the alternative used by TopK and JumpReLU autoencoders

**5. The sparsity-fidelity frontier**

- Sweeping $\lambda$ and plotting reconstruction against L0
- Why a single $\lambda$ is never the right answer to report
- Shrinkage bias: L1 does not only zero small coefficients, it also shrinks the surviving ones

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Derive the soft-thresholding operator from the L1 proximal problem
- Explain why an L1-penalized autoencoder systematically underestimates feature magnitudes
- Read a sparsity-fidelity frontier plot and say what a point on it costs

## Sources to learn from

- Hastie, Tibshirani & Wainwright, *Statistical Learning with Sparsity*, chapters 1-2 — Start here. The lasso, the geometry, and the shrinkage bias. Freely available.
- Boyd & Vandenberghe, *Convex Optimization*, chapter 6 — Approximation and fitting, including the regularization framing.
- Beck & Teboulle, 'A Fast Iterative Shrinkage-Thresholding Algorithm' (2009) — ISTA and FISTA. Read section 1-2 for the proximal view.
- Fit it: run lasso and ridge on the same data across a range of penalties and plot the coefficient paths — The geometric argument for why $L_1$ produces exact zeros and $L_2$ does not is convincing on the page and obvious in the plot.
- Rajamanoharan et al., 'Jumping Ahead: Improving Reconstruction Fidelity with JumpReLU Sparse Autoencoders' (arXiv:2407.14435) — How the sparsity penalty question is being answered in interpretability right now.

## Where the curriculum uses it

[Sparse Coding and Dictionary Learning](/topics/sparse-coding-and-dictionary-learning/), [Training Models to Be Interpretable](/topics/weight-sparse-training/).
