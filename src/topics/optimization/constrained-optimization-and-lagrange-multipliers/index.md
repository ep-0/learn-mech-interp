---
title: "Constrained Optimization and Lagrange Multipliers"
description: "Optimizing subject to equality and inequality constraints, the multiplier conditions that characterize a solution, and projected updates that keep iterates feasible."
order: 2
status: placeholder
prerequisites:
  - title: "Optimization and Gradient Descent"
    url: "/topics/optimization-and-gradient-descent/"
---

## Why this article exists

LEACE is the solution to a constrained minimum-distortion problem, and unsupervised steering-vector search optimizes an activation change subject to a norm constraint. Both are stated as constrained programs and solved as such.

## What this article will cover

- Equality constraints and the method of Lagrange multipliers
- Inequality constraints and the KKT conditions
- The geometric reading: gradients aligned with constraint normals
- Projected gradient descent and staying on a feasible set
- Duality, and reading a multiplier as a price

## Where the curriculum uses it

[LEACE and Linear Concept Erasure](/topics/concept-erasure/), [Unsupervised Steering Vectors](/topics/unsupervised-steering-vectors/).
