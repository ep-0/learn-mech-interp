---
title: "Derivatives and the Chain Rule"
description: "The derivative as a local linear approximation rather than a formula to memorize, and the chain rule that makes deep composition differentiable."
order: 1
status: placeholder
prerequisites: []
---

## Why this article exists

Backpropagation is the chain rule applied to a composition a hundred layers deep, and gradient-based attribution methods are the same rule read as a statement about influence. This is the refresher the rest of the calculus articles build on.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The derivative as local linearity**

- The limit definition, then immediately the reading that matters: the best local linear approximation
- $f(x + h) \approx f(x) + f'(x)h$, and the size of the error
- Why this reading, not the slope-of-tangent one, generalizes to millions of dimensions

**2. The rules, refreshed**

- Sum, product, quotient, power, exponential, logarithm
- Derivatives of the functions this curriculum actually uses: $\exp$, $\log$, $\tanh$, sigmoid, ReLU, GELU
- A table of these, since you will want it later

**3. The chain rule**

- $\frac{d}{dx}f(g(x)) = f'(g(x))g'(x)$, derived from the linear-approximation view
- Iterating it through a deep composition, and where the factors come from
- A worked three-layer example computed by hand

**4. Where differentiability fails**

- ReLU at zero, and the subgradient convention frameworks adopt
- Discontinuities, and why a gradient can be uninformative without being undefined
- Saturation: a correct gradient that is numerically useless

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Differentiate any composition of the standard activation and loss functions by hand
- Explain what a gradient of magnitude $10^{-8}$ tells you about the function, and what it does not
- State the chain rule in a form that will survive being generalized to vectors

## Sources to learn from

- 3Blue1Brown, *Essence of Calculus*, chapters 1-4 — The derivative as a local linear approximation, presented in the framing this article should adopt.
- MIT OCW 18.01SC, *Single Variable Calculus*, units 1-2 — The full refresher if it has been a long time. Skip the applications sections.
- Paul's Online Math Notes, derivatives section — For drilling the rules until they are automatic again. There is no substitute for doing the exercises.
- Goodfellow et al., *Deep Learning*, section 6.5.1-6.5.2 — The chain rule stated the way the backpropagation literature states it, which is where you are heading.

## Where the curriculum uses it

[Partial Derivatives and Gradients](/topics/partial-derivatives-and-gradients/).
