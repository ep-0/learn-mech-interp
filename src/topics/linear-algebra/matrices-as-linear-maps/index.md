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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. A matrix is a function**

- Linearity: $f(\mathbf{x} + \mathbf{y}) = f(\mathbf{x}) + f(\mathbf{y})$ and $f(c\mathbf{x}) = cf(\mathbf{x})$
- A linear map is determined by what it does to a basis, which is what the matrix records
- Naming the domain and codomain: $W_Q : \mathbb{R}^{d_{\text{model}}} \to \mathbb{R}^{d_{\text{head}}}$

**2. Products and composition**

- Matrix-vector multiplication as a weighted sum of columns, and as a stack of dot products
- Matrix-matrix multiplication as composition of maps, and why the inner dimensions must agree
- Non-commutativity, with a rotation-then-projection example

**3. The row-vector convention**

- This curriculum writes $\mathbf{q}_i = \mathbf{x}_i W_Q$, so weights act from the right
- The resulting shapes, matched to what TransformerLens stores
- How to transpose an equation lifted from a paper that uses column vectors

**4. Special matrices**

- Identity, diagonal, permutation, and orthogonal matrices
- Invertibility, and the geometric reading of a non-invertible map as collapsing a direction
- Outer products $\mathbf{u}^T\mathbf{v}$ as rank-one matrices, and a general matrix as a sum of them

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Read any weight matrix in a transformer as a map between two named spaces, and state both shapes
- Convert an equation between row-vector and column-vector conventions without introducing a shape error
- Explain why composing two linear maps cannot produce anything a single linear map could not

## Sources to learn from

- 3Blue1Brown, *Essence of Linear Algebra*, chapters 3-4 and 7-8 — Linear transformations, composition, and inverses, presented geometrically.
- Strang, *Introduction to Linear Algebra*, chapters 2-3 — The four fundamental subspaces, which is the framing that makes rank feel inevitable later.
- MIT OCW 18.06SC, Unit I problem sets — Free, with solutions. Elimination and the four subspaces, drilled until you can find a null space without thinking about it.
- Axler, *Linear Algebra Done Right*, chapter 3 — Linear maps as objects in their own right, with the matrix as a representation chosen after a basis.
- Elhage et al., 'A Mathematical Framework for Transformer Circuits' (transformer-circuits.pub, 2021), the 'Notation' and 'Transformer Overview' sections — Read only for how the field writes these products. It will not fully make sense yet, and that is expected.

## Where the curriculum uses it

[Bases, Coordinates, and Change of Basis](/topics/bases-and-change-of-basis/), [Jacobians and Hessians](/topics/jacobians-and-hessians/), [Tensors, Shapes, and Einsum Notation](/topics/tensors-and-einsum-notation/).
