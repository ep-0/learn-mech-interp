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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The generative model**

- $\mathbf{x} \approx \sum_i a_i \mathbf{d}_i$ with few nonzero $a_i$ and an overcomplete dictionary
- Why overcompleteness plus sparsity is different from a change of basis
- The original motivation from V1 receptive fields

**2. Sparse recovery**

- The L0 problem, and matching pursuit as the greedy approach
- Basis pursuit and the L1 relaxation
- ISTA as the proximal-gradient solver

**3. Learning the dictionary**

- Alternating between coding and dictionary updates
- K-SVD and online dictionary learning, briefly
- The non-convexity, and why initialization matters

**4. Identifiability**

- Coherence and the restricted isometry property
- Conditions under which the true dictionary is recoverable
- What happens when the true code is not sparse enough: feature splitting and merging

**5. The connection to sparse autoencoders**

- An SAE as amortized inference for the coding step
- What is gained (speed) and what is given up (exactness of the code)
- Why the identifiability results are the right lens for judging SAE features

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- State the conditions under which sparse coding recovers the generating dictionary
- Explain feature splitting as a predictable consequence of dictionary size
- Describe a sparse autoencoder in the vocabulary of dictionary learning

## Sources to learn from

- Olshausen & Field, 'Emergence of simple-cell receptive field properties by learning a sparse code for natural images' (Nature, 1996) — The founding paper. Short, and the argument still reads well.
- Elad, *Sparse and Redundant Representations*, chapters 1-3 and 12 — The textbook. Coherence, recovery guarantees, and dictionary learning.
- Mairal, Bach, Ponce & Sapiro, 'Online Dictionary Learning for Sparse Coding' (ICML 2009) — The algorithm that made dictionary learning practical at scale.
- Bricken et al., 'Towards Monosemanticity' and Templeton et al., 'Scaling Monosemanticity' — Read the feature-splitting discussions against the identifiability theory above.

## Where the curriculum uses it

[Sparse Autoencoders: Decomposing Superposition](/topics/sparse-autoencoders/).
