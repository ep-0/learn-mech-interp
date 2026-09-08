---
title: "Eigenvectors, Eigenvalues, and Diagonalization"
description: "Directions a linear map only scales, what the spectrum says about repeated application, and when a matrix can be diagonalized."
order: 7
status: placeholder
prerequisites:
  - title: "Bases, Coordinates, and Change of Basis"
    url: "/topics/bases-and-change-of-basis/"
  - title: "Polynomials and Rational Functions"
    url: "/topics/polynomials-and-rational-functions/"
  - title: "Complex Numbers and Euler's Formula"
    url: "/topics/complex-numbers-and-eulers-formula/"
---

## Why this article exists

Eigenstructure is how we reason about repeated or accumulated linear action, and it is the machinery behind the singular value decomposition, covariance analysis, and the copying behavior read off an OV circuit.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The defining equation**

- $A\mathbf{v} = \lambda\mathbf{v}$ read as 'this direction is only scaled'
- The characteristic polynomial, and why it is a poor computational tool
- Eigenspaces, algebraic and geometric multiplicity

**2. Diagonalization**

- $A = V \Lambda V^{-1}$ as a change of basis into coordinates where the map is elementwise
- Powers of a matrix, and why repeated application is easy in the eigenbasis
- Defective matrices, and an example that cannot be diagonalized

**3. The symmetric case**

- The spectral theorem: real eigenvalues and an orthonormal eigenbasis
- Why covariance matrices and Hessians land in this case
- Orthogonal diagonalization $A = Q \Lambda Q^T$

**4. Complex eigenvalues**

- Rotation matrices as the standard example
- Reading a complex pair as rotation plus scaling in a plane
- Where this shows up: periodic features and circular representations

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Diagonalize a small symmetric matrix by hand and interpret the eigenvalues
- Explain what the eigenvalues of an OV circuit would say about copying behavior
- Say why a real matrix can have no real eigenvectors and what that means geometrically

## Sources to learn from

- 3Blue1Brown, *Essence of Linear Algebra*, chapters 10 and 14 — Eigenvectors geometrically, then the eigenbasis as a computational device.
- Strang, *Introduction to Linear Algebra*, chapter 6 — Eigenvalues, diagonalization, and symmetric matrices, with the applications worked out.
- Axler, *Linear Algebra Done Right*, chapters 5 and 7 — The determinant-free development, and the spectral theorem done properly.
- Elhage et al., 'A Mathematical Framework for Transformer Circuits', the eigenvalue analysis of OV circuits — A direct interpretability use: positive eigenvalues as evidence of copying.

## Where the curriculum uses it

[Quadratic Forms and Positive Semi-Definite Matrices](/topics/quadratic-forms-and-psd-matrices/), [The Singular Value Decomposition](/topics/singular-value-decomposition/).
