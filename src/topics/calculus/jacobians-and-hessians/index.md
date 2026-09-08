---
title: "Jacobians and Hessians"
description: "The matrix of partial derivatives of a vector-valued function, the chain rule as matrix multiplication, and the second-derivative matrix of a scalar loss."
order: 4
status: placeholder
prerequisites:
  - title: "Partial Derivatives and Gradients"
    url: "/topics/partial-derivatives-and-gradients/"
  - title: "Matrices as Linear Maps"
    url: "/topics/matrices-as-linear-maps/"
---

## Why this article exists

The Jacobian is how a layer's local behavior becomes a linear map that can be composed, inspected, and projected onto the vocabulary, which is exactly what the Jacobian lens does.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The Jacobian**

- The matrix of partials of a vector-valued function, with its shape stated explicitly
- The Jacobian as the local linear map: $f(\mathbf{x} + \Delta) \approx f(\mathbf{x}) + \Delta J$
- A worked example on a single transformer sublayer

**2. Composition**

- The chain rule as a product of Jacobians, in the correct order for row-vector conventions
- Why the product telescopes across layers
- Shape bookkeeping through a three-layer composition

**3. Vector-Jacobian products**

- Why forming $J$ explicitly is infeasible at transformer scale
- VJPs and JVPs, and which one reverse-mode autodiff computes
- The cost argument: one backward pass gives a full gradient of a scalar

**4. The Hessian**

- The second-derivative matrix of a scalar function, and its symmetry
- Eigenvalues as curvature, and the link to positive semi-definiteness
- Why Hessians are rarely formed in practice, and what is used instead

**5. Transpose conventions**

- The textbook Jacobian versus the transposed form this curriculum uses
- How to check which one a paper means from the shapes alone
- The Jacobian lens definition $J_\ell = (\partial \mathbf{h}_L / \partial \mathbf{h}_\ell)^T$, previewed

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- State the shape of the Jacobian between any two named activation sites in a transformer
- Explain why reverse-mode autodiff is cheap for a scalar loss and expensive for a vector output
- Read a Jacobian-based method and identify whether it uses the transposed convention

## Sources to learn from

- Parr & Howard, 'The Matrix Calculus You Need For Deep Learning' (arXiv:1802.01528) — The Jacobian sections, which are the clearest treatment aimed at exactly this audience.
- Baydin et al., 'Automatic Differentiation in Machine Learning: a Survey' (arXiv:1502.05767), sections 2-3 — Forward versus reverse mode, and the VJP framing.
- Boyd & Vandenberghe, *Convex Optimization*, appendix A — Derivative and Hessian conventions stated precisely, which resolves most transpose confusion.
- The paper behind this curriculum's Jacobian lens article — Read it after the linear algebra is solid. It is the direct application of everything above.

## Where the curriculum uses it

[Backpropagation and Automatic Differentiation](/topics/backpropagation-and-autodiff/), [Manifolds, Charts, and Tangent Spaces](/topics/manifolds-and-tangent-spaces/).
