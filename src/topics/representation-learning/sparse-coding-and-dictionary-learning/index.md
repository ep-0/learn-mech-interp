---
title: "Sparse Coding and Dictionary Learning"
description: "Representing signals as sparse combinations of an overcomplete dictionary, the classical algorithms that learn one, and the identifiability conditions that make recovery possible."
order: 2
status: placeholder
prerequisites:
  - title: "Autoencoders and Reconstruction Objectives"
    url: "/topics/autoencoders/"
  - title: "Sparsity, L1, and Regularization"
    url: "/topics/sparsity-and-regularization/"
---

## Why this article exists

Sparse autoencoders are dictionary learning applied to activations, and the field's questions about feature splitting, dictionary size, and whether the true features are recoverable at all were asked and partly answered in the sparse-coding literature first.

## What this article will cover

- The sparse coding model: an overcomplete dictionary and sparse coefficients
- Matching pursuit, basis pursuit, and ISTA
- Dictionary learning as alternating minimization
- Coherence, the restricted isometry property, and recovery guarantees
- Identifiability: when the learned dictionary is the generating one

## Where the curriculum uses it

[Sparse Autoencoders: Decomposing Superposition](/topics/sparse-autoencoders/).
