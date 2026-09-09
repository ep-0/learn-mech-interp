---
title: "Dot Products, Norms, and Angles"
description: "The inner product as a measure of alignment, the norms built from it, and how cosine similarity turns geometry into a comparison between directions."
order: 2
status: placeholder
prerequisites:
  - title: "Vectors, Span, and Vector Spaces"
    url: "/topics/vectors-and-vector-spaces/"
  - title: "Trigonometry and the Unit Circle"
    url: "/topics/trigonometry-and-the-unit-circle/"
---

## Why this article exists

Attention scores are dot products. Feature strength is a dot product. Similarity between two learned directions is a normalized dot product. The single operation carries most of the geometric reasoning in the curriculum.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The dot product two ways**

- The algebraic definition $\sum_i a_i b_i$ and the geometric definition $\|\mathbf{a}\|\|\mathbf{b}\|\cos\theta$
- Why the two agree, via the law of cosines
- Bilinearity and symmetry, and what those buy when decomposing a sum of vectors

**2. Norms**

- The Euclidean norm as $\sqrt{\mathbf{x} \cdot \mathbf{x}}$, and the general $L^p$ family
- $L^0$, $L^1$, $L^2$, $L^\infty$ and the shape of their unit balls
- Normalization to a unit vector, and why steering vectors are usually reported normalized

**3. Angles and cosine similarity**

- Cosine similarity as a scale-free comparison of direction
- Orthogonality as $\cos\theta = 0$, and why it means 'carries no information about'
- Cauchy-Schwarz, and the bound it puts on any alignment claim

**4. Reading a dot product as a measurement**

- $\mathbf{x} \cdot \hat{\mathbf{v}}$ as the signed amount of $\hat{\mathbf{v}}$ present in $\mathbf{x}$
- Attention scores as $\mathbf{q} \mathbf{k}^T$, previewed concretely
- Why unnormalized dot products conflate magnitude with alignment, and when that matters

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute and interpret a cosine similarity, and say what it is invariant to
- Explain why a large dot product does not imply a small angle
- Predict how a norm changes under projection, scaling, and addition of an orthogonal component

## Sources to learn from

- 3Blue1Brown, *Essence of Linear Algebra*, chapter 9 (dot products and duality) — The duality view, that a dot product is a linear map to $\mathbb{R}$, is the one that pays off later in direct logit attribution.
- Strang, *Introduction to Linear Algebra*, section 1.2 and chapter 4 opening — Dot products, lengths, angles, and the Cauchy-Schwarz inequality.
- Khan Academy, 'Vectors' and 'Dot products and duality' — Free drills. Elementary, and worth twenty minutes if computing a projection or an angle is not currently automatic.
- Goodfellow et al., *Deep Learning*, section 2.5 — Norms in the notation used by the deep learning literature.
- Ethayarajh, 'How Contextual are Contextualized Word Representations?' (EMNLP 2019) — Optional but useful early: it shows cosine similarity between contextual embeddings behaving badly, which is a caution worth absorbing before you rely on it.

## Where the curriculum uses it

[Geometry in High Dimensions](/topics/high-dimensional-geometry/), [Matrices as Linear Maps](/topics/matrices-as-linear-maps/), [Sparsity, L1, and Regularization](/topics/sparsity-and-regularization/).
