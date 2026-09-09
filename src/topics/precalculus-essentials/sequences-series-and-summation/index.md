---
title: "Sequences, Series, and Summation"
description: "Sequences and their limits, what it means for an infinite sum to converge, the geometric series, and the partial sums that approximate an integral."
order: 10
status: placeholder
prerequisites:
  - title: "Functions, Domains, and Composition"
    url: "/topics/functions-and-composition/"
  - title: "Inequalities, Absolute Value, and Bounds"
    url: "/topics/inequalities-and-bounds/"
---

## Why this article exists

Taylor expansion is an infinite series and the question of how much of it to keep is a convergence question. Riemann sums are partial sums. The geometric series is the standard tool for bounding a tail, which is how error terms get controlled.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Sequences**

- A sequence as a function on the positive integers
- Explicit and recursive definitions, with an example of each
- Boundedness and monotonicity

**2. Limits of sequences**

- Convergence stated informally, then with the $\epsilon$-$N$ definition read as a bounding claim
- Divergence, oscillation, and growth to infinity
- Standard limits worth knowing: $1/n$, $r^n$, and $(1 + 1/n)^n$

**3. Series**

- Partial sums, and a series as the limit of its partial sums
- The geometric series, its sum, and the condition $|r| < 1$
- The harmonic series as the standard example of a divergent series with terms going to zero

**4. Bounding a tail**

- Comparing a series to a geometric one to bound what is discarded
- Why this is the shape of every truncation-error argument in calculus
- A worked example: how many terms of a series are needed for a given accuracy

**5. Sums as approximations**

- Approximating an area by rectangles, with the picture
- Refining the partition, and the limit that will define the integral
- Named forward: this is the Riemann sum that integrated gradients computes numerically

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- The full battery of convergence tests: ratio, root, integral, alternating
- Power series radius of convergence in general
- Sequences and series as a standalone subject

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Sum a geometric series and state when the formula applies
- Bound the tail of a convergent series and use it to choose a truncation point
- Set up a Riemann sum for a given function and interval

## Sources to learn from

- 3Blue1Brown, *Essence of Calculus*, chapter 11 — Start here. Taylor series presented visually. Watch for the intuition about what a series is doing.
- Michael Spivak, *Calculus*, chapters 22-23 — Sequences and infinite series done rigorously. Demanding, and the standard against which others are measured.
- Paul's Online Math Notes, 'Series and Sequences' — Free, complete, and organized for looking things up.
- Paul's Online Math Notes, the Series and Sequences practice problems — Free, with worked solutions. Convergence tests are procedural, and the only way to stop guessing which one to apply is to have applied all of them.
- Graham, Knuth & Patashnik, *Concrete Mathematics*, chapter 2 — Return here for manipulating sums once the convergence ideas are in place.

## Where the curriculum uses it

[Limits and Continuity](/topics/limits-and-continuity/).
