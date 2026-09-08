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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The overdetermined problem**

- More equations than unknowns, and why an exact solution usually does not exist
- Minimizing $\|A\mathbf{x} - \mathbf{b}\|^2$ as the replacement question
- The geometry: the residual must be orthogonal to the column space

**2. Normal equations**

- Deriving $A^TA\mathbf{x} = A^T\mathbf{b}$ from the orthogonality condition
- When $A^TA$ is invertible, and what happens when it is not
- The solution as a projection, connecting back to projection matrices

**3. The pseudoinverse**

- $A^+ = V\Sigma^+U^T$ built from the SVD
- The minimum-norm solution when the system is underdetermined
- The four Moore-Penrose conditions, stated once

**4. Regularization and conditioning**

- Ridge regression, and the effect of $\lambda$ on the spectrum
- Condition number, and why solving the normal equations directly is a numerical mistake
- QR and SVD as the methods actually used

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Solve a small least-squares problem and verify the residual is orthogonal to the column space
- Explain why ridge regularization improves conditioning, in terms of singular values
- Recognize least squares when it appears disguised as a rank-one model edit

## Sources to learn from

- Strang, *Introduction to Linear Algebra*, chapter 4 — Least squares as projection, which is the reading that makes everything else obvious.
- Trefethen & Bau, *Numerical Linear Algebra*, lectures 11 and 18-19 — Least squares, conditioning, and why the normal equations are numerically poor.
- Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning*, chapter 3 — The statistical reading, including ridge and the bias-variance consequences. Freely available.
- Meng et al., 'Locating and Editing Factual Associations in GPT' (ROME, arXiv:2202.05262), the derivation of the rank-one update — Read the algebra only, to see least squares turn up as a weight edit.

## Where the curriculum uses it

[Linear and Logistic Regression](/topics/linear-and-logistic-regression/).
