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

## What this article will cover

- Encoder, decoder, latent code, and the reconstruction loss
- Undercomplete bottlenecks and the link to PCA in the linear case
- Overcomplete codes, and why they need a constraint to be meaningful
- Denoising, contractive, and variational variants
- Dead units, tied weights, and reconstruction-quality metrics

## Where the curriculum uses it

[Sparse Coding and Dictionary Learning](/topics/sparse-coding-and-dictionary-learning/).
