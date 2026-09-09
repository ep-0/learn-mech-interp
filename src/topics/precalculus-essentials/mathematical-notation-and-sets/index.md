---
title: "Mathematical Notation, Sets, and Statements"
description: "The symbols this curriculum never stops to define: set and interval notation, summation and product signs, function arrows, and the quantifiers that make a theorem say what it says."
order: 1
status: placeholder
prerequisites: []
---

## Why this article exists

Every article on this site writes $\mathbb{R}^n$, $\sum_i$, $\in$, and "for all $\epsilon > 0$ there exists" without explanation, because textbooks assume it. This page is where that assumption gets paid for, and it is the bottom of the whole prerequisite chain: nothing on the site sits below it.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Sets and membership**

- Sets by listing and by set-builder notation, with $\{x \in \mathbb{R} : x > 0\}$ read aloud
- Membership, subset, union, intersection, complement, and the empty set
- The number systems by name: $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$, and what $\mathbb{R}^n$ means

**2. Intervals and ordering**

- Open, closed, and half-open intervals, and the bracket convention
- Unbounded intervals and the two infinity symbols
- Why $[0, 1]$ and $(0, 1)$ differ in a way that matters for probabilities

**3. Summation and product notation**

- $\sum_{i=1}^{n} a_i$ decoded index by index, with three worked expansions
- $\prod_{i=1}^{n} a_i$, and why the autoregressive factorization of a sentence is one
- Manipulating sums: splitting, reindexing, pulling out constants, and swapping a double sum
- Turning a product into a sum with a logarithm, previewed as the reason log-likelihood exists

**4. Functions and maps, notationally**

- $f : A \to B$ read as a sentence, and what the arrow asserts about domain and codomain
- Subscripts, superscripts, and the difference between an index and an exponent
- Notation used site-wide: $\mathbf{x}$ for vectors, $W$ for matrices, $\hat{\mathbf{v}}$ for a unit vector

**5. Reading a mathematical statement**

- Implication, converse, contrapositive, and 'if and only if'
- The quantifiers $\forall$ and $\exists$, and why their order changes the claim
- Necessary versus sufficient conditions, with an example from a theorem you will meet later
- Definitions, theorems, lemmas, and what a proof is for

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Formal logic, truth tables, and proof techniques beyond reading a statement correctly
- Axiomatic set theory, cardinality, and countability
- Mathematical induction

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Read $\prod_{i=1}^{n} P(x_i \mid x_{<i})$ aloud and say what each piece contributes
- Rewrite a double sum with its order of summation swapped and explain why that is legal
- State the contrapositive of a theorem and explain why it says the same thing

## Sources to learn from

- Serge Lang, *Basic Mathematics*, chapters 1-2 — Start here. Notation and the number systems, developed with more care than a typical high-school text and no more length.
- Daniel Velleman, *How to Prove It*, chapters 1-2 — Logic, quantifiers, and sets. Read for how to parse a statement, not to become a proof writer.
- Graham, Knuth & Patashnik, *Concrete Mathematics*, chapter 2 — Sums. The best treatment of summation manipulation there is, and directly useful later.
- Paul's Online Math Notes, the algebra preliminaries — For drilling notation until it stops slowing you down. Free.

## Where the curriculum uses it

[Counting, Factorials, and Binomial Coefficients](/topics/counting-and-combinatorics/), [Functions, Domains, and Composition](/topics/functions-and-composition/), [Inequalities, Absolute Value, and Bounds](/topics/inequalities-and-bounds/).
