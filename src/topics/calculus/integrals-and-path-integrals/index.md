---
title: "Integrals and Path Integrals"
description: "Integration as accumulation, the fundamental theorem that ties it to differentiation, and line integrals along a path between two inputs."
order: 5
status: placeholder
prerequisites:
  - title: "Partial Derivatives and Gradients"
    url: "/topics/partial-derivatives-and-gradients/"
---

## Why this article exists

Integrated gradients accumulate a gradient along a straight path from a baseline to an input, which is a line integral. Continuous probability distributions need the same machinery to define expectations.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Integration as accumulation**

- Riemann sums, then the definite integral as their limit
- The fundamental theorem of calculus, both parts, and what each is for
- Numerical quadrature, since every integral in this curriculum is computed approximately

**2. Multivariable integration**

- Integrating over a region, and iterated integrals
- Change of variables and the Jacobian determinant, stated
- Expectations as integrals against a density, previewing probability

**3. Line integrals**

- Parameterizing a path, and integrating a vector field along it
- The straight-line path from a baseline to an input, written out
- A worked one-dimensional example before the general case

**4. Path independence and completeness**

- Conservative fields, and when the integral depends only on the endpoints
- Why the gradient of a scalar function is conservative
- The completeness property of integrated gradients as a direct consequence of the fundamental theorem

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Set up the line integral that integrated gradients computes, and say what its endpoints are
- Prove the completeness property of integrated gradients from the fundamental theorem
- Estimate how many interpolation steps a Riemann approximation of that integral needs

## Sources to learn from

- 3Blue1Brown, *Essence of Calculus*, chapters 8-10 — Start here. Integration as accumulation, and the fundamental theorem as the central insight.
- MIT OCW 18.02SC, units 4-5 — Line integrals and vector fields, including path independence.
- MIT OCW 18.02SC, the line-integral problem sets — Free, with solutions. Path independence is the property integrated gradients depends on, and it is worth verifying by hand on a case where it fails.
- Sundararajan, Taly & Yan, 'Axiomatic Attribution for Deep Networks' (arXiv:1703.01365) — Read for the completeness axiom, which is the fundamental theorem wearing different clothes.
- Miglani et al., 'Investigating Saturation Effects in Integrated Gradients' — Optional, and useful for understanding why the choice of baseline and step count is not a detail.

## Where the curriculum uses it

[Random Variables and Distributions](/topics/random-variables-and-distributions/).
