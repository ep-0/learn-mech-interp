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

## What this article will cover

- The Jacobian of a vector-valued function and its shape
- The chain rule as a product of Jacobians
- Vector-Jacobian and Jacobian-vector products, and why autodiff computes those
- The Hessian, symmetry, and curvature of a loss surface
- Transposes and layout conventions, and the transposed Jacobian used in this curriculum

## Where the curriculum uses it

[Backpropagation and Automatic Differentiation](/topics/backpropagation-and-autodiff/), [Manifolds, Charts, and Tangent Spaces](/topics/manifolds-and-tangent-spaces/).
