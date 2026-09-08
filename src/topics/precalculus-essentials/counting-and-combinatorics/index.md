---
title: "Counting, Factorials, and Binomial Coefficients"
description: "Multiplying choices, arrangements and selections, and the binomial coefficient that counts subsets and weights the binomial distribution."
order: 12
status: placeholder
prerequisites:
  - title: "Mathematical Notation, Sets, and Statements"
    url: "/topics/mathematical-notation-and-sets/"
---

## Why this article exists

Probability starts with counting outcomes, the Bernoulli and binomial distributions are built from binomial coefficients, and several arguments in this curriculum turn on how many objects of some kind fit in a space. This is the smallest amount of combinatorics that makes those work.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The multiplication principle**

- Independent choices multiply, with a sequence-of-tokens example
- Counting with and without replacement
- Why the size of a vocabulary raised to a sequence length is the number of possible sequences

**2. Permutations and combinations**

- Factorials, and arrangements of distinct objects
- Permutations of $k$ from $n$
- Combinations, and the point that order stops mattering

**3. Binomial coefficients**

- $\binom{n}{k}$ defined, computed, and read as 'the number of subsets of size $k$'
- Pascal's triangle and the symmetry $\binom{n}{k} = \binom{n}{n-k}$
- The binomial theorem, stated and used once

**4. Counting as the basis of probability**

- Equally likely outcomes, and probability as a ratio of counts
- A worked example: the probability of exactly $k$ successes in $n$ trials
- Named forward: this expression is the binomial distribution

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Inclusion-exclusion, derangements, and generating functions
- Combinatorial identities beyond Pascal's rule and the binomial theorem
- Graph and network counting

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute a binomial coefficient and say what it counts in a stated problem
- Derive the probability of exactly $k$ heads in $n$ flips from first principles
- Explain why sampling with and without replacement give different counts

## Sources to learn from

- Blitzstein & Hwang, *Introduction to Probability*, chapter 1 — Counting introduced as the foundation of probability, which is exactly the framing this article wants. Free lectures accompany it as Harvard Stat 110.
- Graham, Knuth & Patashnik, *Concrete Mathematics*, chapter 5 — Binomial coefficients in depth. Read the first sections only unless you enjoy it.
- Khan Academy, 'Counting, permutations, and combinations' — Free drills.
- OpenStax, *Precalculus*, the sequences and counting chapter — Reference for the mechanics.

## Where the curriculum uses it

[Random Variables and Distributions](/topics/random-variables-and-distributions/).
