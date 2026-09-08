---
title: "Partial Derivatives and Gradients"
description: "Derivatives of multivariable functions, the gradient as the vector of steepest ascent, and directional derivatives that ask how much one direction matters."
order: 2
status: placeholder
prerequisites:
  - title: "Derivatives and the Chain Rule"
    url: "/topics/derivatives-and-the-chain-rule/"
  - title: "Vectors, Span, and Vector Spaces"
    url: "/topics/vectors-and-vector-spaces/"
---

## Why this article exists

A loss is a scalar function of millions of parameters, and every attribution method in the curriculum asks a version of the same question: how much does this coordinate, or this direction, move that scalar?

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Partial derivatives**

- Holding all but one variable fixed, with a two-variable worked example and a surface picture
- Notation: $\partial f / \partial x_i$, and the ordering conventions that cause confusion
- Mixed partials and Clairaut's theorem, stated

**2. The gradient**

- $\nabla f$ as the vector of partials, and why it is a vector rather than a list
- The steepest-ascent property, derived rather than asserted
- Gradient orthogonal to level sets, with the picture

**3. Directional derivatives**

- $D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u}$ as the rate of change along $\mathbf{u}$
- The gradient as the object that computes all directional derivatives at once
- Interpretability reading: 'how much does moving activations along this direction change the loss'

**4. The multivariable chain rule**

- The sum-over-paths form, with a computation-graph picture
- Why the sum is over every route from input to output
- A worked example with two intermediate variables

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute a gradient of a scalar function of a vector and check it numerically by finite differences
- Explain what the directional derivative along a steering vector measures
- Apply the multivariable chain rule to a small computation graph without dropping a path

## Sources to learn from

- 3Blue1Brown, *Multivariable Calculus* (with Khan Academy), the gradient and directional derivative sections — Short, geometric, and exactly the right scope.
- MIT OCW 18.02SC, *Multivariable Calculus*, units 1-2 — The rigorous version, with the level-set geometry developed properly.
- Parr & Howard, 'The Matrix Calculus You Need For Deep Learning' (arXiv:1802.01528) — The single most useful document for translating between scalar calculus and the vector-matrix expressions in ML papers.
- Goodfellow et al., *Deep Learning*, section 4.3 — Gradient-based optimization introduced with the notation used later in the book.

## Where the curriculum uses it

[Integrals and Path Integrals](/topics/integrals-and-path-integrals/), [Jacobians and Hessians](/topics/jacobians-and-hessians/), [Linear Approximation and Taylor Expansion](/topics/taylor-expansion-and-linear-approximation/), [Optimization and Gradient Descent](/topics/optimization-and-gradient-descent/).
