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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The problem**

- Two networks, two representation spaces, no correspondence between coordinates
- What 'the same representation' could mean, and the fact that it needs a definition
- Invariances: permutation, rotation, isotropic scaling, invertible linear maps

**2. Correlation-based measures**

- Canonical correlation analysis, and what it maximizes
- SVCCA, and why the SVD preprocessing step is needed
- PWCCA as the weighting fix

**3. Kernel alignment**

- Centered kernel alignment, defined through Gram matrices
- Its invariances, stated explicitly, and how they differ from CCA's
- The critiques: sensitivity to a few high-variance directions

**4. Alignment-based measures**

- Orthogonal Procrustes, and permutation matching between neurons
- Model stitching as a functional rather than representational test
- Why a functional test can disagree with a similarity score

**5. Using these honestly**

- The invariance you assume determines the answer you get
- Reporting more than one measure, and what disagreement between them means
- Application: what a universality claim needs to establish

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- State the invariance class of CKA and of CCA, and give a case where they disagree
- Design a similarity comparison whose conclusion does not depend on one measure
- Explain what a universality result would have to show to be convincing

## Sources to learn from

- Kornblith et al., 'Similarity of Neural Network Representations Revisited' (arXiv:1905.00414) — Start here. CKA, and the argument about which invariances a similarity measure should have.
- Raghu et al., 'SVCCA' (arXiv:1706.05806) — The CCA-based approach and its motivation.
- Davari et al., 'Reliability of CKA as a Similarity Measure' (arXiv:2210.16156) — The critique. Read it alongside the Kornblith paper, not after.
- Compute it: take two models, or one model at two checkpoints, and compute CKA between matched layers yourself — Then repeat under a random rotation of one representation. The invariance CKA has and SVCCA lacks is the whole argument, and it takes ten minutes to see.
- Bansal, Nakkiran & Barak, 'Revisiting Model Stitching' (arXiv:2106.07682) — The functional alternative to representational similarity.

## Where the curriculum uses it

[Universality Across Models](/topics/universality/).
