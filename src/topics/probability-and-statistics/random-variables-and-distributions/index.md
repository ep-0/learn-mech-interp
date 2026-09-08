---
title: "Random Variables and Distributions"
description: "Sample spaces, discrete and continuous random variables, densities and mass functions, and the standard distributions that recur in modeling."
order: 1
status: placeholder
prerequisites:
  - title: "Integrals and Path Integrals"
    url: "/topics/integrals-and-path-integrals/"
---

## Why this article exists

A language model is a conditional probability distribution over tokens, and every claim about what it predicts, samples, or is uncertain about is a claim about that distribution.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Probability spaces**

- Sample space, events, and the three axioms
- Why measure-theoretic care exists, and the level of rigor this article will stop at
- Discrete and continuous cases side by side

**2. Random variables**

- A random variable as a function from outcomes to numbers
- PMF, PDF, and CDF, and the relationships between them
- The distinction between a density value and a probability

**3. Joint, marginal, conditional**

- Joint distributions, marginalization by summing or integrating out
- Conditional distributions defined, with the language model's next-token distribution as the running example
- Independence stated in terms of factorization

**4. The distributions used in this curriculum**

- Categorical, and why a softmax output is exactly one
- Bernoulli, Gaussian, and uniform
- The multivariate Gaussian, with its mean vector and covariance matrix

**5. Transformations**

- Change of variables for densities, and the Jacobian factor
- Functions of random variables, and why $E[f(X)] \ne f(E[X])$ in general

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Write a transformer's output layer as an explicit conditional distribution and state its parameters
- Marginalize and condition a small joint distribution correctly
- Explain the difference between a density and a probability to someone who conflates them

## Sources to learn from

- Blitzstein & Hwang, *Introduction to Probability*, chapters 1-5 (or Harvard Stat 110 lectures, freely available) — The best first course. The lectures are worth watching even if you read the book.
- Wasserman, *All of Statistics*, chapters 1-3 — Terse and complete. Use it as the reference once Blitzstein has built the intuition.
- Murphy, *Probabilistic Machine Learning: An Introduction*, chapter 2 — The same material with ML notation and examples throughout. Freely available.
- Goodfellow et al., *Deep Learning*, chapter 3 — A compressed version, useful for checking that you can read the notation the field writes in.

## Where the curriculum uses it

[Conditional Probability, Independence, and Bayes' Rule](/topics/conditional-probability-and-bayes/), [Expectation, Variance, and Covariance](/topics/expectation-variance-and-covariance/).
