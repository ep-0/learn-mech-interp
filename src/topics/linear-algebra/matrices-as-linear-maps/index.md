---
title: "Matrices as Linear Maps"
description: "Reading a matrix as a function between vector spaces, why matrix multiplication is composition, and how row-vector conventions fix the shapes used throughout the curriculum."
order: 3
status: placeholder
prerequisites:
  - title: "Dot Products, Norms, and Angles"
    url: "/topics/dot-products-norms-and-angles/"
---

## Why this article exists

A transformer is a long composition of linear maps interleaved with nonlinearities. Reading $W_Q$, $W_K$, and $W_O$ as maps between named spaces, rather than as grids of numbers, is what makes circuit-level arguments possible.

## What this article will cover

- A matrix as a linear map, determined by where it sends basis vectors
- Matrix-vector and matrix-matrix products, and multiplication as composition
- Shapes, transposes, and the row-vector convention this curriculum uses
- Identity, inverse, and when an inverse fails to exist
- Outer products and rank-one matrices as building blocks

## Where the curriculum uses it

[Bases, Coordinates, and Change of Basis](/topics/bases-and-change-of-basis/), [Jacobians and Hessians](/topics/jacobians-and-hessians/), [Tensors, Shapes, and Einsum Notation](/topics/tensors-and-einsum-notation/).
