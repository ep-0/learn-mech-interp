---
title: "Curvature and Geodesics"
description: "How a manifold bends, the shortest paths that respect that bending, and why moving along a geodesic differs from moving in a straight line."
order: 2
status: placeholder
prerequisites:
  - title: "Manifolds, Charts, and Tangent Spaces"
    url: "/topics/manifolds-and-tangent-spaces/"
---

## Why this article exists

Manifold steering moves an activation along a learned curved path rather than adding a fixed vector, and the difference between those two moves is exactly the difference between a geodesic and a straight line.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Measuring on a curved space**

- A Riemannian metric as an inner product on each tangent space
- Lengths of curves, and distance as an infimum over paths
- The induced metric on a surface embedded in $\mathbb{R}^3$

**2. Geodesics**

- Locally length-minimizing curves, with great circles as the example
- The geodesic equation, stated without full derivation
- Straight lines in the ambient space are not geodesics on the manifold

**3. Curvature**

- Gaussian and sectional curvature, introduced on surfaces
- How curvature makes initially parallel geodesics converge or diverge
- Why curvature is what makes a linear approximation degrade with distance

**4. Exponential and logarithmic maps**

- Moving along a geodesic from a point in a tangent direction
- The log map as the inverse, and its use in comparing points
- The computational picture behind steering along a learned curved path

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Explain the difference between adding a vector and moving along a geodesic
- Say what curvature predicts about the failure of large linear steering interventions
- Describe what a manifold-steering method computes, geometrically

## Sources to learn from

- Do Carmo, *Differential Geometry of Curves and Surfaces*, chapters 3-4 — Curvature on surfaces, which is the level of generality this article needs.
- John Lee, *Introduction to Riemannian Manifolds*, chapters 2-5 — Metrics, geodesics, and the exponential map, done properly.
- Bronstein et al., 'Geometric Deep Learning' (arXiv:2104.13478) — For the machine learning framing of the same objects.
- Pennec, 'Intrinsic Statistics on Riemannian Manifolds' — Optional. Useful for how means and directions are defined when the space is curved.

## Where the curriculum uses it

[Manifold Steering](/topics/manifold-steering/).
