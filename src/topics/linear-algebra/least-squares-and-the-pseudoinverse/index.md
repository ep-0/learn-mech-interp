---
title: "Least Squares and the Pseudoinverse"
description: "Solving overdetermined systems by minimizing squared error, the normal equations, and the pseudoinverse that generalizes them to any matrix."
order: 10
status: placeholder
prerequisites:
  - title: "The Singular Value Decomposition"
    url: "/topics/singular-value-decomposition/"
---

## Why this article exists

Least squares is the closed-form fit behind linear probes, the tuned lens, and the rank-one weight edits used in fact editing, and its solution is exactly an orthogonal projection onto a column space.

## What this article will cover

- The least-squares problem and its geometric reading as a projection
- Normal equations, and when $A^T A$ is invertible
- The Moore-Penrose pseudoinverse via the SVD
- Ridge regularization and its effect on conditioning
- Numerical conditioning, and why the normal equations are not how to compute it

## Where the curriculum uses it

[Linear and Logistic Regression](/topics/linear-and-logistic-regression/).
