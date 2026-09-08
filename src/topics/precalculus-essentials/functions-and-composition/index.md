---
title: "Functions, Domains, and Composition"
description: "A function as a rule assigning one output to each input, the domain and codomain that pin it down, and the composition and inverses that the chain rule and encoder-decoder pairs are built on."
order: 2
status: placeholder
prerequisites:
  - title: "Mathematical Notation, Sets, and Statements"
    url: "/topics/mathematical-notation-and-sets/"
---

## Why this article exists

Composition is the single most reused idea in this curriculum: a transformer is a composition of layers, the chain rule differentiates a composition, and an autoencoder is a composition that should approximate the identity. Everything downstream needs this to be automatic.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. What a function is**

- A rule assigning exactly one output to each input, and why the 'exactly one' matters
- Domain, codomain, and range, distinguished with a worked example where range and codomain differ
- Graphs as a picture of a function, and the vertical line test

**2. The shape vocabulary**

- Increasing, decreasing, bounded, and periodic
- Even and odd symmetry
- Piecewise definitions, with $\text{ReLU}(x) = \max(0, x)$ as the example carried forward

**3. Transformations**

- Shifts, scalings, and reflections, and their effect on the graph
- Why adding a constant to every input of a softmax changes nothing, previewed
- Composing a transformation with a function, done in the right order

**4. Composition**

- $(f \circ g)(x) = f(g(x))$, and the domain restriction composition imposes
- Composing three or more functions, and reading a deep composition as a pipeline
- A worked example with numbers before any abstraction

**5. Inverses**

- When an inverse exists, and one-to-one as the condition
- Finding an inverse, with $\exp$ and $\log$ as the pair that recurs everywhere
- Why most functions in a neural network are not invertible, and what that costs interpretability

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Formal treatment of injectivity, surjectivity, and bijections beyond what inverses require
- Function algebra drills unrelated to composition
- Conic sections and their equations

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compose three functions by hand and state the domain of the result
- Decide whether a given function has an inverse and produce it if so
- Describe a two-layer neural network as an explicit composition

## Sources to learn from

- Sheldon Axler, *Precalculus: A Prelude to Calculus*, chapters 1-2 — Functions and transformations, written by someone unusually careful about definitions.
- Khan Academy, Precalculus: 'Composite and inverse functions' — Free, with exercises. Do them until composition is automatic.
- George Simmons, *Precalculus Mathematics in a Nutshell* — The whole book is 119 pages and covers only what calculus needs, which is the same editorial stance as this block.
- OpenStax, *Precalculus*, chapters 1 and 3 — Free and thorough. Use as a reference rather than reading front to back.

## Where the curriculum uses it

[Coordinate Geometry, Distance, and Lines](/topics/coordinate-geometry-and-distance/), [Exponentials and Logarithms](/topics/exponentials-and-logarithms/), [Polynomials and Rational Functions](/topics/polynomials-and-rational-functions/), [Sequences, Series, and Summation](/topics/sequences-series-and-summation/).
