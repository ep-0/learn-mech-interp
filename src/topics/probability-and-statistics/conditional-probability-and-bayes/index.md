---
title: "Conditional Probability, Independence, and Bayes' Rule"
description: "Conditioning as restriction to a subpopulation, independence and its conditional form, and the rule that inverts a conditional."
order: 3
status: placeholder
prerequisites:
  - title: "Random Variables and Distributions"
    url: "/topics/random-variables-and-distributions/"
---

## Why this article exists

Autoregressive language modeling factors a sequence distribution into conditionals, and probe calibration, detection thresholds, and base-rate arguments about monitoring are all Bayes' rule applied carefully.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Conditioning**

- $P(A \mid B) = P(A \cap B)/P(B)$, with the restriction-to-a-subpopulation picture
- The chain rule of probability, and its extension to sequences
- Conditioning on an event versus on a random variable

**2. Independence**

- Independence as factorization, and its failure to be transitive
- Conditional independence, and how conditioning can create dependence
- Explaining away, with a worked collider example

**3. Bayes' rule**

- Statement, derivation, and each term named
- A worked numerical example with a rare condition and an imperfect test
- Odds form, which is easier to reason with

**4. Base rates and detection**

- Why a 99%-accurate probe on a 1-in-10000 behavior is mostly false positives
- Precision as a posterior, computed explicitly
- The implication for every monitoring claim in this curriculum

**5. The autoregressive factorization**

- $P(x_1 \ldots x_n) = \prod_i P(x_i \mid x_{<i})$, derived from the chain rule
- Why this makes next-token prediction sufficient for modeling sequences

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute the precision of a detector from its true-positive rate, false-positive rate, and base rate
- Identify a collider in a small graph and explain why conditioning on it induces dependence
- Derive the autoregressive factorization from the chain rule of probability

## Sources to learn from

- Blitzstein & Hwang, *Introduction to Probability*, chapter 2 — Start here. Conditional probability done thoroughly, including the classic paradoxes that are worth working through.
- Harvard Stat 110, lectures 2-4 and the corresponding Strategic Practice sets — Free, with solutions. Conditioning is where nearly everyone's intuition is wrong; the problems are what fix it, and Blitzstein has collected the ones that expose the error.
- Wasserman, *All of Statistics*, chapter 2 — The compact statements.
- Judea Pearl, *The Book of Why*, chapters 1-3 — Not for the math, but for the distinction between conditioning and intervening, which you will need shortly.
- Murphy, *Probabilistic Machine Learning: An Introduction*, sections 2.1 and 4.6 — Bayes' rule in ML notation, including the classification setting.

## Where the curriculum uses it

[Causal Graphs and Interventions](/topics/causal-graphs-and-interventions/), [Estimation and Maximum Likelihood](/topics/estimation-and-maximum-likelihood/), [KL Divergence and Mutual Information](/topics/kl-divergence-and-mutual-information/).
