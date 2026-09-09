---
title: "Softmax and the Cross-Entropy Loss"
description: "Turning a vector of scores into a distribution, why differences of logits are the meaningful quantity, and the loss that pairs with it."
order: 2
status: placeholder
prerequisites:
  - title: "Neurons, Layers, and Activation Functions"
    url: "/topics/neurons-layers-and-activation-functions/"
  - title: "Entropy, Cross-Entropy, and Perplexity"
    url: "/topics/entropy-and-cross-entropy/"
---

## Why this article exists

Attention weights are a softmax over scores and next-token predictions are a softmax over logits. The shift-invariance of that function is why the curriculum measures logit differences rather than logits.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Softmax**

- The definition, and why exponentiate-then-normalize
- Shift invariance: $\text{softmax}(\mathbf{z} + c) = \text{softmax}(\mathbf{z})$, proved
- Numerical stability, and the max-subtraction trick every implementation uses

**2. Temperature**

- Dividing logits by $T$, and the effect on the distribution's entropy
- The limits $T \to 0$ and $T \to \infty$
- Where temperature appears twice: in decoding, and inside attention as $1/\sqrt{d_k}$

**3. Cross-entropy loss**

- The loss for a one-hot target, reduced to $-\log p_{\text{correct}}$
- The gradient $\hat{\mathbf{y}} - \mathbf{y}$, derived, and why it is so simple
- Why softmax and cross-entropy are implemented as one fused operation

**4. Logit differences**

- Shift invariance means absolute logits are not meaningful; differences are
- The logit difference metric used throughout this curriculum, defined here
- Working an example: what a logit difference of 3 corresponds to in probability

**5. Saturation**

- Vanishing gradients under a confident softmax
- The consequence for gradient-based attribution: a component can matter causally while its gradient is near zero
- Attention saturation as the same phenomenon inside the model

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Derive the cross-entropy gradient with respect to the logits
- Convert between a logit difference and a probability ratio
- Explain the connection between softmax saturation and the failure of attribution patching

## Sources to learn from

- Goodfellow et al., *Deep Learning*, sections 6.2.2 and 4.1 — Softmax, cross-entropy, and the numerical stability discussion.
- Prince, *Understanding Deep Learning*, chapter 5 — Loss functions derived from maximum likelihood rather than asserted, so that cross-entropy follows instead of appearing. Free.
- Karpathy, 'Neural Networks: Zero to Hero', the makemore videos — Softmax and cross-entropy implemented and debugged in front of you.
- Bishop, *Pattern Recognition and Machine Learning*, section 4.3.4 — The derivation of the softmax gradient.
- Nanda, 'Attribution Patching' and the AtP* paper (arXiv:2403.00745) — Read for the saturation failure mode, which is the practical reason this section exists.

## Where the curriculum uses it

[Language Modeling and Next-Token Prediction](/topics/language-modeling-and-next-token-prediction/).
