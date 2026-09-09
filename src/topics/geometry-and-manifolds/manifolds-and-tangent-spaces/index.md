---
title: "Manifolds, Charts, and Tangent Spaces"
description: "Curved surfaces that look flat up close, the coordinate charts that describe them, and the tangent space that makes local linear reasoning available again."
order: 1
status: placeholder
prerequisites:
  - title: "Geometry in High Dimensions"
    url: "/topics/high-dimensional-geometry/"
  - title: "Jacobians and Hessians"
    url: "/topics/jacobians-and-hessians/"
---

## Why this article exists

When activations concentrate on a curved low-dimensional set, the linear-direction vocabulary stops applying exactly, and the replacement is a manifold with a tangent space at each point.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. What a manifold is**

- Locally Euclidean, with the circle and the sphere as the worked examples
- Charts and atlases, and smooth transition maps
- Dimension of a manifold, and why it can be much less than the ambient dimension

**2. Embedded manifolds**

- Submanifolds of $\mathbb{R}^n$, defined as level sets or as images of parameterizations
- The manifold hypothesis, stated as an empirical claim about data
- What evidence for it in activation space would look like

**3. Tangent spaces**

- Tangent vectors as velocities of curves through a point
- The tangent space as a vector space attached to each point
- The Jacobian of a parameterization as the map into it

**4. Linear directions as first-order objects**

- A steering direction as a tangent vector at a specific activation
- Why moving far along it leaves the manifold
- The precise sense in which the linear representation hypothesis is a local claim

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Give the tangent space of a sphere at a point, and its dimension
- Explain why a feature direction is a tangent vector rather than a global object
- State what the manifold hypothesis claims and what would falsify it

## Sources to learn from

- Tristan Needham, *Visual Differential Geometry and Forms*, the early chapters — Start here. The gentlest serious entry point, and the one to start from if do Carmo's index notation is doing more harm than good. Needham argues the geometry pictorially and then makes it rigorous.
- Do Carmo, *Differential Geometry of Curves and Surfaces*, chapters 1-2 — Concrete surfaces in $\mathbb{R}^3$ before any abstraction. Work it after Needham, or instead of him if you would rather have coordinates from the outset.
- John Lee, *Introduction to Smooth Manifolds*, chapters 1 and 3 — The rigorous definitions, if you want them. Heavy; read selectively.
- Do Carmo's chapter 1-2 exercises, and John Lee's chapter 1 exercises — Parameterise a few surfaces and compute their tangent planes by hand. Charts and transition maps stay abstract until you have written one down for the sphere and hit the pole.
- Bronstein, Bruna, Cohen & Veličković, 'Geometric Deep Learning' (arXiv:2104.13478), chapters 2-3 — Manifolds as they are used in machine learning rather than in geometry.
- Fefferman, Mitter & Narayanan, 'Testing the Manifold Hypothesis' (arXiv:1310.0425) — Read the introduction. It is the paper that turned an intuition into a testable statement.

## Where the curriculum uses it

[Curvature and Geodesics](/topics/curvature-and-geodesics/), [Intrinsic Dimension and Dimensionality Reduction](/topics/intrinsic-dimension-and-dimensionality-reduction/).
