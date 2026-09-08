---
title: "Inequalities, Absolute Value, and Bounds"
description: "Manipulating inequalities without breaking them, absolute value as distance, and the habit of bounding a quantity you cannot compute exactly."
order: 3
status: placeholder
prerequisites:
  - title: "Mathematical Notation, Sets, and Statements"
    url: "/topics/mathematical-notation-and-sets/"
---

## Why this article exists

Most of the results this curriculum relies on are inequalities rather than equations: Cauchy-Schwarz bounds an alignment, Johnson-Lindenstrauss bounds a distortion, concentration bounds a deviation, and a Taylor remainder bounds an approximation error. Reading a bound is a skill, and it is assumed everywhere.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Manipulating inequalities**

- The operations that preserve an inequality and the one that flips it
- Adding and multiplying inequalities, and when that is not allowed
- Solving a linear and a quadratic inequality, with the solution written as an interval

**2. Absolute value**

- $|x|$ as distance from zero, and $|x - y|$ as distance between
- The triangle inequality $|x + y| \le |x| + |y|$, with the picture that makes it obvious
- Solving $|x - a| < \epsilon$, which is the shape every limit and error bound takes

**3. Reading a bound**

- Upper and lower bounds, and what it means for one to be tight
- Big-$O$ notation informally, as 'grows no faster than'
- Turning 'the error is at most $C\|\Delta\|^2$' into a statement about when an approximation is usable

**4. Bounds that recur later**

- The arithmetic-geometric mean inequality, stated and used once
- Why $|\cos\theta| \le 1$ is the source of the Cauchy-Schwarz bound you will meet in linear algebra
- A worked example: bounding a quantity two ways and comparing which is tighter

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Proving the classical inequalities in general form
- Optimization by inequality manipulation
- Formal asymptotic analysis beyond reading big-$O$

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Solve an absolute-value inequality and write the answer as an interval
- Apply the triangle inequality to bound the norm of a sum
- Read a stated error bound and say for which step sizes it makes the approximation trustworthy

## Sources to learn from

- Serge Lang, *Basic Mathematics*, the inequalities sections — Careful and short.
- Paul's Online Math Notes, 'Solving Inequalities' and 'Absolute Value Equations and Inequalities' — Free, exercise-driven, exactly the right scope.
- Steele, *The Cauchy-Schwarz Master Class*, chapter 1 — Optional and delightful. Read it if you want inequalities to feel like a subject rather than a chore.
- Khan Academy, Algebra 2: inequalities and absolute value — For drilling if the manipulation rules are rusty.

## Where the curriculum uses it

[Geometry in High Dimensions](/topics/high-dimensional-geometry/), [Sequences, Series, and Summation](/topics/sequences-series-and-summation/).
