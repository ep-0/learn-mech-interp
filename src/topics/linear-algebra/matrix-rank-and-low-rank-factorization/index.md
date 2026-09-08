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

## What this article will cover

- Column space, row space, null space, and the rank-nullity theorem
- Rank of a product, and why a bottleneck caps it
- Factorization $M = AB$ with a thin inner dimension
- Rank-one matrices, outer products, and sums of rank-one terms
- What a low-rank constraint costs in expressiveness

## Where the curriculum uses it

[The Singular Value Decomposition](/topics/singular-value-decomposition/).
