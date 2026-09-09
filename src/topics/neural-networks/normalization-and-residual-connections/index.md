---
title: "Normalization and Residual Connections"
description: "Why deep networks add skip connections and normalize activations, what BatchNorm, LayerNorm, and RMSNorm each compute, and what those choices cost in interpretability."
order: 5
status: placeholder
prerequisites:
  - title: "Training Deep Networks: SGD, Adam, and Schedules"
    url: "/topics/training-dynamics-and-optimizers/"
---

## Why this article exists

The residual stream is a skip connection read as a shared communication channel, and layer normalization is the one component that breaks the additive decomposition circuit analysis depends on.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Residual connections**

- $\mathbf{x} + f(\mathbf{x})$, and why it makes deep networks trainable
- The gradient path argument, worked through two blocks
- Reading the residual stream as a channel that components read from and write to

**2. Normalization schemes**

- BatchNorm, LayerNorm, and RMSNorm: what each averages over, with the axes named
- Learnable gain and bias, and how they are often folded into adjacent weights
- Why LayerNorm and not BatchNorm in transformers

**3. Placement**

- Pre-norm versus post-norm, and the training-stability argument
- Which one current models use, and what that implies for reading the residual stream
- The final layer norm before unembedding, which is easy to forget and changes results

**4. The interpretability cost**

- Normalization rescales by an input-dependent factor, so it is not linear
- What this breaks: the additive decomposition of the residual stream into component contributions
- The standard workarounds, including folding and treating the scale as frozen, with what each assumes

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- State exactly which axis each normalization scheme reduces over
- Explain why layer normalization complicates direct logit attribution
- Describe what 'freezing LayerNorm' assumes and when that assumption is safe

## Sources to learn from

- Ba, Kiros & Hinton, 'Layer Normalization' (arXiv:1607.06450) — The original. Short.
- He et al., 'Deep Residual Learning for Image Recognition' (arXiv:1512.03385) — Where residual connections come from, and the argument for them.
- Xiong et al., 'On Layer Normalization in the Transformer Architecture' (arXiv:2002.04745) — Pre-norm versus post-norm, with the gradient analysis.
- Verify it: take a trained model, scale a residual stream vector by a positive constant, and confirm the post-normalization activation is unchanged — Two lines of code. Scale invariance is the property that makes half the claims in this curriculum work, and reading it is not the same as seeing it.
- Zhang & Sennrich, 'Root Mean Square Layer Normalization' (arXiv:1910.07467) — RMSNorm, used by most current open models.

## Where the curriculum uses it

[Layer Normalization](/topics/layer-normalization/).
