---
title: "Limits and Continuity"
description: "What it means for a function to approach a value, the indeterminate forms that make the question interesting, and the continuity that most of calculus quietly assumes."
order: 11
status: placeholder
prerequisites:
  - title: "Sequences, Series, and Summation"
    url: "/topics/sequences-series-and-summation/"
  - title: "Polynomials and Rational Functions"
    url: "/topics/polynomials-and-rational-functions/"
---

## Why this article exists

The derivative is defined as a limit, and this article is the immediate prerequisite for that definition. Continuity is also where ReLU's kink and softmax's saturation get described precisely rather than waved at.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The limit idea**

- Approaching a point without reaching it, with a worked example where $f$ is undefined at the point
- One-sided limits, and a function whose two sides disagree
- The $\epsilon$-$\delta$ definition, read as the bounding statement it is

**2. Computing limits**

- Direct substitution when it works, and the limit laws
- Indeterminate forms, with $0/0$ resolved by algebra rather than by a rule
- Limits at infinity, and the end behavior of a rational function

**3. Continuity**

- The three conditions, and a function that fails each one
- Continuity of sums, products, and compositions
- Which functions in a network are continuous, and where the exceptions are

**4. Non-smooth points**

- ReLU at zero: continuous but with a corner
- The difference between continuous and differentiable, previewed
- Why frameworks pick a value at the kink, and that the choice is a convention

**5. The limit that defines a derivative**

- The difference quotient written out
- Evaluating it for $f(x) = x^2$ from first principles
- Handing off: this expression is where the calculus block begins

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Formal proofs of the limit laws
- L'Hôpital's rule, which belongs after derivatives
- Limits of sequences of functions, uniform convergence, and analysis proper

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Evaluate a $0/0$ limit by simplifying the expression first
- Compute the derivative of $x^2$ from the difference quotient without using a rule
- Explain precisely what is true and what is false about ReLU at zero

## Sources to learn from

- Spivak, *Calculus*, chapters 5-6 — Limits and continuity with the $\epsilon$-$\delta$ definition treated as the point rather than an aside.
- 3Blue1Brown, *Essence of Calculus*, chapter 7 — Limits, including a clear account of why $\epsilon$-$\delta$ says what it says.
- MIT OCW 18.01SC, the limits unit — Free lectures and problem sets at the standard first-course level.
- Paul's Online Math Notes, 'Limits' — Free, with worked examples of every indeterminate form you will meet.

## Where the curriculum uses it

[Derivatives and the Chain Rule](/topics/derivatives-and-the-chain-rule/).
