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

## What this article will cover

- Partial derivatives and what holding other variables fixed means
- The gradient as a vector, and its steepest-ascent property
- Directional derivatives, and the gradient as the map that computes them
- The multivariable chain rule
- Level sets, and why the gradient is orthogonal to them

## Where the curriculum uses it

[Integrals and Path Integrals](/topics/integrals-and-path-integrals/), [Jacobians and Hessians](/topics/jacobians-and-hessians/), [Linear Approximation and Taylor Expansion](/topics/taylor-expansion-and-linear-approximation/), [Optimization and Gradient Descent](/topics/optimization-and-gradient-descent/).
