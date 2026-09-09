---
title: "Exponentials and Logarithms"
description: "The laws of exponents, the number e, the logarithm as the inverse of exponentiation, and the log rules that turn products into sums throughout machine learning."
order: 5
status: placeholder
prerequisites:
  - title: "Functions, Domains, and Composition"
    url: "/topics/functions-and-composition/"
---

## Why this article exists

This is the most load-bearing page in the block. Cross-entropy, log-likelihood, softmax, perplexity, KL divergence, bits and nats, and the log-odds a probe outputs are all statements about logarithms, and a reader who is shaky here will be shaky in half the curriculum.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Exponentials**

- The laws of exponents, including negative and fractional powers
- Exponential growth and decay, and how fast $e^x$ actually grows
- The number $e$, motivated by continuous compounding rather than asserted

**2. Logarithms**

- $\log_b(x)$ as the inverse of $b^x$, with the graph pair
- The three log rules, each derived from an exponent law rather than memorized
- Change of base, and converting between $\log_2$, $\ln$, and $\log_{10}$

**3. Why logs are everywhere in this field**

- Products become sums: $\log \prod_i p_i = \sum_i \log p_i$, worked on a sentence's probability
- Very small probabilities become manageable numbers, with a concrete underflow example
- Multiplicative comparisons become differences, which is what a logit difference is

**4. Reading log-scaled quantities**

- Bits versus nats, and converting between them
- $-\log p$ as surprise, previewed as the definition of information content
- Log-odds, and why a classifier's raw output is on that scale

**5. Solving**

- Solving equations where the unknown is in an exponent
- Solving equations involving logs, and checking for extraneous solutions
- A worked conversion between a cross-entropy loss and a perplexity

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Logarithmic and exponential modeling applications such as finance and half-life problems
- Log-scaled graphing techniques
- Hyperbolic functions

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Convert a per-token loss in nats into a perplexity and back without looking it up
- Expand $\log$ of a product of a hundred probabilities and say why that form is preferred numerically
- Explain what a log-odds output of 2.2 means as a probability

## Sources to learn from

- Axler, *Precalculus: A Prelude to Calculus*, chapters 3-4 — Start here. Exponentials and logarithms, including a genuinely good motivation for $e$.
- Khan Academy, Algebra 2 and Precalculus: logarithms — Free, with the drills. Do them; the log rules must be reflexive.
- 3Blue1Brown, 'What's so special about Euler's number e?' — Fifteen minutes on why $e$ is the base that makes calculus simple.
- Simmons, *Precalculus Mathematics in a Nutshell* — The compressed treatment, for checking you have the essentials rather than the trivia.

## Where the curriculum uses it

[Complex Numbers and Euler's Formula](/topics/complex-numbers-and-eulers-formula/), [Derivatives and the Chain Rule](/topics/derivatives-and-the-chain-rule/), [Geometry in High Dimensions](/topics/high-dimensional-geometry/).
