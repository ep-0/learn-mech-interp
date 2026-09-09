---
title: "Rank and Low-Rank Factorization"
description: "Rank as the dimension of a map's image, how a low-rank matrix factors into thin pieces, and what a bottleneck of rank r can and cannot express."
order: 6
status: placeholder
prerequisites:
  - title: "Bases, Coordinates, and Change of Basis"
    url: "/topics/bases-and-change-of-basis/"
---

## Why this article exists

An attention head's QK and OV circuits are low-rank factorizations: $W_Q W_K^T$ has rank at most $d_{\text{head}}$, which is why an entire head can be summarized by two matrices smaller than the residual stream.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Rank as a dimension count**

- Column space, row space, and the theorem that their dimensions agree
- Null space and the rank-nullity theorem
- Full rank, rank deficient, and what a deficient map loses

**2. Rank of a product**

- $\text{rank}(AB) \le \min(\text{rank}(A), \text{rank}(B))$, with the proof sketch
- A thin inner dimension as a bottleneck, worked with concrete shapes
- Why $W_Q W_K^T$ has rank at most $d_{\text{head}}$ however large $d_{\text{model}}$ is

**3. Factorization**

- Writing a rank-$r$ matrix as $AB$ with inner dimension $r$
- Sums of rank-one outer products as the other reading of the same factorization
- Parameter counts, and why low rank is a compression as well as a constraint

**4. What a low-rank map cannot do**

- A concrete function a rank-1 map cannot express
- Numerical rank versus exact rank in floating point
- Forward reference: QK and OV circuits are exactly this factorization, given interpretive meaning

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute the rank of a product from the shapes alone and justify the bound
- Explain what an attention head's low-rank structure implies about how much it can attend to
- Recognize a rank-one weight update and say what it can and cannot change

## Sources to learn from

- Strang, *Introduction to Linear Algebra*, chapters 3 and 7 — Start here. Rank, the four subspaces, and the factorization view Strang has pushed hardest in recent editions.
- Trefethen & Bau, *Numerical Linear Algebra*, lectures 1-5 — Matrix-vector products, rank, and the low-rank picture, written for people who will compute with them.
- MIT OCW 18.06SC, Unit I problem sets on rank and the four subspaces — Free, with solutions. Rank arguments are the ones most often waved at in interpretability papers, so they are worth being able to do.
- Elhage et al., 'A Mathematical Framework for Transformer Circuits', the QK and OV circuit derivation — The payoff. Come back to it after the attention article, but skim the algebra now.
- Hu et al., 'LoRA: Low-Rank Adaptation of Large Language Models' (arXiv:2106.09685), sections 1-4 — A second, independent use of the same idea, which helps separate the technique from the one place you first meet it.

## Where the curriculum uses it

[The Singular Value Decomposition](/topics/singular-value-decomposition/).
