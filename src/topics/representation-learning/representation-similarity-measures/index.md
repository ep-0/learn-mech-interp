---
title: "Comparing Representations Across Models"
description: "Measuring whether two networks represent things the same way, using CCA, CKA, and alignment methods, and the invariances each measure assumes."
order: 3
status: placeholder
prerequisites:
  - title: "Embeddings and Distributed Representations"
    url: "/topics/embeddings-and-distributed-representations/"
---

## Why this article exists

Universality claims are similarity measurements, and every such measurement builds in an invariance, to rotation, to scaling, to permutation, that decides in advance which differences count as real.

## What this article will cover

- The alignment problem: matching two representation spaces
- Canonical correlation analysis and SVCCA
- Centered kernel alignment and what it is invariant to
- Procrustes alignment and permutation matching
- Why the choice of invariance determines the conclusion

## Where the curriculum uses it

[Universality Across Models](/topics/universality/).
