---
title: "Systems of Linear Equations"
description: "Solving several linear equations at once by elimination, the three possible outcomes, and the matrix shorthand that turns a system into a single equation."
order: 7
status: placeholder
prerequisites:
  - title: "Coordinate Geometry, Distance, and Lines"
    url: "/topics/coordinate-geometry-and-distance/"
---

## Why this article exists

Testing whether a set of vectors is linearly independent is solving a homogeneous system, and the normal equations of least squares are a system. The three-outcome classification, one solution, none, or infinitely many, is where rank and null space come from.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Systems and their solutions**

- Two equations in two unknowns, solved by substitution and by elimination
- The geometric reading: intersecting lines, parallel lines, and the same line twice
- The three outcomes, and that there is no fourth

**2. Elimination**

- Gaussian elimination on a three-by-three system, worked in full
- Row operations, and why each one preserves the solution set
- Row echelon form, pivots, and free variables

**3. Matrix shorthand**

- The augmented matrix as bookkeeping for the same computation
- Writing a system as $A\mathbf{x} = \mathbf{b}$, with the shapes named
- Reading the number of pivots as a count of independent constraints

**4. Homogeneous systems**

- $A\mathbf{x} = \mathbf{0}$, which always has the zero solution
- When a nonzero solution exists, and what that says about the columns
- This is exactly the linear independence test, stated now so it is familiar later

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Determinants and Cramer's rule
- Matrix inverses and matrix algebra, which belong to the linear algebra block
- Numerical stability of elimination, covered later with conditioning

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Solve a three-by-three system by elimination and classify the outcome
- Decide from a row echelon form how many free variables a system has
- Explain what a nonzero solution to $A\mathbf{x} = \mathbf{0}$ says about the columns of $A$

## Sources to learn from

- Gilbert Strang, *Introduction to Linear Algebra*, chapter 2 (or MIT OCW 18.06, lectures 1-3) — Start here. Elimination done by the person who has taught it best, and it leads directly into the next block.
- Lang, *Basic Mathematics*, the linear equations chapter — The precalculus-level treatment, if Strang moves too fast.
- Khan Academy, 'Systems of equations' — Free drills for the mechanics.
- OpenStax, *Precalculus*, chapter 9 — Reference for the augmented-matrix bookkeeping.

## Where the curriculum uses it

[Vectors, Span, and Vector Spaces](/topics/vectors-and-vector-spaces/).
