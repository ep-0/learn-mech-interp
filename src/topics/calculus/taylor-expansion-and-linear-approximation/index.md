---
title: "Linear Approximation and Taylor Expansion"
description: "Approximating a function near a point by its first-order behavior, the error terms that come next, and when a linear approximation stops being trustworthy."
order: 3
status: placeholder
prerequisites:
  - title: "Partial Derivatives and Gradients"
    url: "/topics/partial-derivatives-and-gradients/"
---

## Why this article exists

Attribution patching replaces an expensive intervention with a first-order Taylor estimate of it. Knowing exactly which term is being dropped is what separates using that approximation from being misled by it.

## What this article will cover

- First-order approximation and the tangent plane
- Taylor series in one and several variables, and the remainder term
- Second-order terms, the Hessian, and local curvature
- Where linearization fails: saturation, discontinuity, and large steps
- Integrated gradients as a way of repairing a bad linear approximation

## Where the curriculum uses it

[Attribution Patching and Path Patching](/topics/attribution-patching/).
