---
title: "Vectors, Span, and Vector Spaces"
description: "Vectors as points and directions in R^n, what span and linear independence mean, and why a basis fixes the coordinates everything else is written in."
order: 1
status: placeholder
prerequisites:
  - title: "Systems of Linear Equations"
    url: "/topics/systems-of-linear-equations/"
---

## Why this article exists

Every activation, embedding, and feature direction in this curriculum is a vector in $\mathbb{R}^n$, and nearly every claim about what a model represents is a claim about spans, subspaces, and independence. This article establishes that vocabulary.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Two readings of the same object**

- A vector as a point, and as a displacement, and why activation space uses both readings in the same sentence
- Addition and scalar multiplication as the only two operations a vector space guarantees
- $\mathbb{R}^n$ concretely, with $n$ in the thousands rather than in $\{2, 3\}$

**2. Span and linear independence**

- The span of a set as everything reachable by weighted sums
- Linear independence, and the test for it as a homogeneous system
- Worked example: three vectors in $\mathbb{R}^3$ that span a plane, and what that costs

**3. Basis, coordinates, and dimension**

- A basis as a minimal spanning set, and why every basis of a space has the same size
- Coordinates as the unique weights reconstructing a vector from a basis
- The point to keep: a vector has no coordinates until a basis is chosen

**4. Subspaces**

- Subspaces as the sets closed under both operations, with lines and planes through the origin as the examples
- Sum and intersection of subspaces
- Why 'a concept occupies a subspace' is a stronger claim than 'a concept has a direction'

**5. Where this breaks down for interpretability**

- Activations live in $\mathbb{R}^{d_{\text{model}}}$ but are not uniformly distributed in it
- Forward reference: the standard basis of a residual stream is not privileged, which is a claim these definitions let us state precisely

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Decide whether a given set of vectors is independent, and say what its span is
- State the dimension of a subspace defined by a spanning set
- Explain, without hand-waving, what changes and what does not when a basis is replaced

## Sources to learn from

- 3Blue1Brown, *Essence of Linear Algebra*, chapters 1-3 — The geometric picture of vectors, span, and linear combinations. Watch this first even if the algebra is familiar.
- Gilbert Strang, *Introduction to Linear Algebra*, chapters 1-3 (or MIT OCW 18.06, lectures 1-9) — The computational treatment, with column space and null space developed carefully.
- MIT OCW 18.06SC, Unit I problem sets — Free, with full solutions. Span and independence are not learned by reading; do these until deciding whether a set is independent is mechanical.
- Sheldon Axler, *Linear Algebra Done Right*, chapters 1-2 — The basis-free treatment. Read this for why a vector space is defined the way it is, not for computation.
- Goodfellow, Bengio & Courville, *Deep Learning*, section 2.1-2.4 — The same material compressed into ML notation, which is the notation the rest of this curriculum uses.

## Where the curriculum uses it

[Dot Products, Norms, and Angles](/topics/dot-products-norms-and-angles/), [Partial Derivatives and Gradients](/topics/partial-derivatives-and-gradients/).
