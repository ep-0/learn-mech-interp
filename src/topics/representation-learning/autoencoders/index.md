---
title: "Autoencoders and Reconstruction Objectives"
description: "Encoder-decoder pairs trained to reconstruct their input, the bottleneck that forces compression, and the variants that constrain the code rather than its width."
order: 1
status: placeholder
prerequisites:
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"
---

## Why this article exists

A sparse autoencoder is an autoencoder whose bottleneck is sparsity rather than width, so the reconstruction objective, the dead-unit failure mode, and the tied-weight question all arrive from here.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The architecture**

- Encoder, latent code, decoder, and the reconstruction loss
- Shapes, and the meaning of undercomplete and overcomplete
- What is learned when the loss is minimized

**2. The linear case**

- A linear autoencoder with squared loss recovers the PCA subspace
- Why it recovers the subspace but not the individual components
- The lesson: reconstruction alone does not identify a basis

**3. Constraining the code**

- Bottleneck width as one constraint, sparsity as another
- Denoising and contractive autoencoders, and what each regularizer buys
- Variational autoencoders mentioned, with the point that they are solving a different problem

**4. Practical failure modes**

- Dead units, and the standard resampling fixes
- Tied versus untied encoder and decoder weights
- Learning the identity when the constraint is too weak

**5. Measuring reconstruction**

- Mean squared error, explained variance, and their limits
- Downstream measures: loss recovered when the reconstruction is substituted into a model
- Why the downstream measure is the one that matters

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Explain why a linear autoencoder recovers the PCA subspace but not PCA's basis
- List the failure modes that require an overcomplete autoencoder to be regularized
- Argue why substituting a reconstruction back into the model is a better test than MSE

## Sources to learn from

- Goodfellow et al., *Deep Learning*, chapter 14 — Autoencoders, including the denoising and contractive variants and the PCA connection.
- Baldi & Hornik, 'Neural networks and principal component analysis' (1989) — The original result that linear autoencoders find the PCA subspace.
- Implement it: train a linear autoencoder on data whose principal components you know, and confirm it recovers the PCA subspace but not the individual components — This is the Baldi and Hornik result above, and doing it is what makes the later claim about SAE non-uniqueness unsurprising rather than alarming.
- Bishop & Bishop, *Deep Learning: Foundations and Concepts*, the autoencoder sections — A current textbook treatment.
- Bricken et al., 'Towards Monosemanticity' (transformer-circuits.pub, 2023), the architecture and training sections — Where these choices are made for interpretability, including dead-feature resampling.

## Where the curriculum uses it

[Sparse Coding and Dictionary Learning](/topics/sparse-coding-and-dictionary-learning/).
