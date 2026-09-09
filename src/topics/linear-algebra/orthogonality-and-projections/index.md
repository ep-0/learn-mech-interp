---
title: "Orthogonality and Projections"
description: "Decomposing a vector into a component along a direction and a component orthogonal to it, and extending that to projections onto and away from subspaces."
order: 5
status: placeholder
prerequisites:
  - title: "Bases, Coordinates, and Change of Basis"
    url: "/topics/bases-and-change-of-basis/"
---

## Why this article exists

Ablating a feature means projecting it out. Reading a feature's strength means projecting onto it. Direct logit attribution, ablation steering, and concept erasure are all built on the same decomposition.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Decomposing along a direction**

- Splitting $\mathbf{x}$ into $(\mathbf{x} \cdot \hat{\mathbf{v}})\hat{\mathbf{v}}$ plus a remainder, and proving the remainder is orthogonal
- The scalar projection versus the vector projection
- Worked example in $\mathbb{R}^2$ before any matrix appears

**2. Projection matrices**

- $P = \hat{\mathbf{v}}^T \hat{\mathbf{v}}$ for a direction, and $P = A(A^TA)^{-1}A^T$ for a subspace
- Idempotence $P^2 = P$ and symmetry as the defining properties
- The complementary projector $I - P$, which is what ablation actually applies

**3. Building orthonormal bases**

- Gram-Schmidt, and its numerical instability
- QR decomposition as the practical alternative
- Projecting onto the span of several directions at once

**4. When the inner product is not the identity**

- Oblique projections, and why they are not symmetric
- Whitened inner products, previewing where concept erasure needs one
- The consequence: 'removing a direction' is only well defined once an inner product is fixed

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Write down the projector onto and away from a given subspace, and verify idempotence
- Explain what ablation steering does to an activation in one sentence of linear algebra
- Say why projecting out a direction can still leave the information recoverable

## Sources to learn from

- Strang, *Introduction to Linear Algebra*, chapter 4 — Projections, least squares, and orthogonality developed together, which is how they are used.
- 3Blue1Brown, *Essence of Linear Algebra*, chapter 9 — Projection as the geometric content of the dot product.
- MIT OCW 18.06SC, Unit II problem sets — Free, with solutions. Projections, Gram-Schmidt, and orthogonal complements. Work the projection-matrix problems specifically.
- Trefethen & Bau, *Numerical Linear Algebra*, lectures 6-8 — Projectors, QR, and why Gram-Schmidt is taught but not used.
- Belrose et al., 'LEACE: Perfect linear concept erasure in closed form' (2023), sections 1-2 — Read the setup only. It shows what a projection has to be careful about when the goal is erasure rather than measurement.

## Where the curriculum uses it

[The Singular Value Decomposition](/topics/singular-value-decomposition/).
