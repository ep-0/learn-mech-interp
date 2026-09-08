---
title: "Coordinate Geometry, Distance, and Lines"
description: "Points in the plane and in space, the distance formula that comes from Pythagoras, lines and planes described three different ways, and the parameterized paths later used for integration."
order: 6
status: placeholder
prerequisites:
  - title: "Functions, Domains, and Composition"
    url: "/topics/functions-and-composition/"
---

## Why this article exists

An activation is a point in $\mathbb{R}^{4096}$, a norm is a distance, a probe's decision boundary is a hyperplane, and integrated gradients accumulates along a parameterized path. Each of those is this page's content with the dimension count raised.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Coordinates**

- The Cartesian plane, then three dimensions, then the honest statement that $n$ dimensions works the same algebraically
- Plotting, quadrants, and reading a coordinate as a list of numbers
- The origin, and why it is a special point once we start talking about directions

**2. Distance**

- The Pythagorean theorem, and the distance formula derived from it
- Extending to three dimensions, and then to $n$ by the same argument
- The midpoint, and the general point a fraction of the way along a segment

**3. Lines**

- Slope-intercept, point-slope, and general form $ax + by = c$
- Parallel and perpendicular conditions, and the slope product $-1$
- The general form as a preview: $ax + by = c$ is a dot product set equal to a constant

**4. Planes and higher analogues**

- A plane in three dimensions, and its normal vector
- Distance from a point to a line, and to a plane
- The word hyperplane introduced, so that a probe's decision boundary has a name

**5. Parameterized paths**

- Describing a line as $\mathbf{p}(t) = \mathbf{a} + t(\mathbf{b} - \mathbf{a})$
- Why this form generalizes when the points live in many dimensions
- The straight path from a baseline to an input, named now and used later by integrated gradients

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Conic sections beyond naming the ellipse
- Polar coordinates, which arrive with complex numbers instead
- Classical Euclidean geometry, proofs, and constructions

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute the distance between two points in $\mathbb{R}^n$ and say why the formula does not change with $n$
- Write the equation of a hyperplane given a normal direction and a point on it
- Parameterize the straight path between two points and evaluate it at $t = 0.3$

## Sources to learn from

- Simmons, *Precalculus Mathematics in a Nutshell*, the geometry and analytic geometry sections — Exactly the narrow selection this article needs.
- Lang, *Basic Mathematics*, the coordinate geometry chapters — Distance, lines, and the algebra-geometry correspondence, carefully.
- Khan Academy, 'Analytic geometry' — Free, with exercises on distance and line equations.
- 3Blue1Brown, *Essence of Linear Algebra*, chapter 1 — Watch ahead: it shows where this material is going once points become vectors.

## Where the curriculum uses it

[Systems of Linear Equations](/topics/systems-of-linear-equations/), [Trigonometry and the Unit Circle](/topics/trigonometry-and-the-unit-circle/).
