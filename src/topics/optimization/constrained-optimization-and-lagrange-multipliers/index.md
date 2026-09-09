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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Equality constraints**

- The geometric condition: the objective's gradient parallel to the constraint's
- The Lagrangian, and stationarity in both the variable and the multiplier
- A worked example: maximizing a linear function on the unit sphere

**2. Inequality constraints**

- Active and inactive constraints
- The KKT conditions, each one named and interpreted
- Complementary slackness, and what it says about which constraints bind

**3. Duality**

- The dual function as a lower bound, and weak duality
- Strong duality and Slater's condition, stated
- Reading a multiplier as a shadow price

**4. Projected and penalized methods**

- Projected gradient descent, and the projections you already know
- Penalty and barrier methods as the soft alternative
- Norm constraints in practice: renormalizing after each step

**5. Two uses in this curriculum**

- Minimum-distortion concept erasure as a constrained program with a closed-form solution
- Unsupervised steering-vector search as maximization subject to a norm constraint

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Solve a small equality-constrained problem with multipliers and interpret the multiplier's value
- State the KKT conditions and check them on a given candidate solution
- Recognize when an interpretability method's 'closed form' is a solved constrained program

## Sources to learn from

- Boyd & Vandenberghe, *Convex Optimization*, chapters 4-5 — Start here. Constrained problems and duality. Chapter 5 is the one to work through carefully.
- Nocedal & Wright, *Numerical Optimization*, chapter 12 — KKT conditions with the geometry spelled out.
- Klaus-Robert Müller's or Stephen Boyd's lecture videos for the same material — Use if the text is heavy going; the worked examples are what make multipliers click.
- Belrose et al., 'LEACE' (2023), the derivation section — A constrained optimization problem whose closed-form solution is the whole method.

## Where the curriculum uses it

[LEACE and Linear Concept Erasure](/topics/concept-erasure/), [Unsupervised Steering Vectors](/topics/unsupervised-steering-vectors/).
