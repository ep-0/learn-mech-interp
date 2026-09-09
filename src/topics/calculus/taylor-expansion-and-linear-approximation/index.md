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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. First-order approximation**

- $f(\mathbf{x} + \Delta) \approx f(\mathbf{x}) + \nabla f \cdot \Delta$, and the tangent-plane picture
- The error term, and the sense in which it is $O(\|\Delta\|^2)$
- A worked numerical example showing the approximation degrade as $\|\Delta\|$ grows

**2. Taylor series**

- The one-dimensional series, then the multivariable form with the Hessian term
- Lagrange remainder, stated so the error is bounded rather than waved at
- When the series converges and when it does not

**3. Second-order structure**

- The quadratic term $\frac{1}{2}\Delta H \Delta^T$, and reading curvature from $H$
- Why a large second-order term means the linear estimate is untrustworthy
- Newton's method mentioned as the payoff, without developing it

**4. Failure modes that matter here**

- Saturated softmax: the gradient is near zero but the effect of a large intervention is not
- Discontinuous or piecewise behavior across the interval
- Integrated gradients as the repair, and why integrating along a path fixes what a single gradient misses

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Bound the error of a first-order approximation given a Hessian bound
- Predict when attribution patching will disagree with real activation patching, and explain why
- Explain integrated gradients as a fix for a specific, named defect of gradients

## Sources to learn from

- 3Blue1Brown, *Essence of Calculus*, chapter 11 (Taylor series) — Start here. The clearest geometric account of what the higher terms are doing.
- MIT OCW 18.01SC, the Taylor series unit — For the remainder term done carefully, which is the part usually skipped.
- Paul's Online Math Notes, the Taylor series practice problems — Free, with full solutions. Expand a few functions by hand and bound the remainder; the first-order approximations throughout interpretability are only as trustworthy as your feel for that bound.
- Sundararajan, Taly & Yan, 'Axiomatic Attribution for Deep Networks' (arXiv:1703.01365) — Integrated gradients, including the axioms that motivate it. Read sections 1-3.
- Nanda, 'Attribution Patching: Activation Patching At Industrial Scale' (neelnanda.io) — The interpretability application, and honest about where the approximation breaks.

## Where the curriculum uses it

[Attribution Patching and Path Patching](/topics/attribution-patching/).
