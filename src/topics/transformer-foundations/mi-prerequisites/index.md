---
title: "What This Book Assumes"
description: "The background the mechanistic interpretability textbook takes for granted, a diagnostic for checking whether you have it, and where in the foundations textbooks to get each missing piece."
order: 1
prerequisites: []
---

## The Background This Book Takes for Granted

This textbook assumes you can read a matrix product without stopping, treat a language model as a conditional distribution over tokens, and follow a gradient argument. It does not assume you can currently do all three. The [Mathematical Foundations](/topics/mathematical-notation-and-sets/) and [Machine Learning Foundations](/topics/supervised-learning-and-generalization/) textbooks exist to supply exactly this background, and every article here links to the specific pieces it needs.

The floor beneath those textbooks is high-school algebra: manipulating expressions, solving equations, and graphing a line and a parabola. Everything above that line is covered somewhere on the site, precalculus and single-variable calculus included. What is covered of them is narrow on purpose. [Trigonometry and the Unit Circle](/topics/trigonometry-and-the-unit-circle/) exists because cosine similarity and rotary embeddings need it, and it skips solving triangles; [Counting, Factorials, and Binomial Coefficients](/topics/counting-and-combinatorics/) exists because probability starts with counting, and it skips generating functions. Each such article says what it leaves out and why.

## A Diagnostic

Each question below is answered by one article. If a question reads as obvious, skip its link. If it does not, that link is where to start.

| Question | If it is not immediate |
|---|---|
| An activation is a row vector $\mathbf{x} \in \mathbb{R}^{768}$ and $W \in \mathbb{R}^{768 \times 64}$. What shape is $\mathbf{x}W$? | [Matrices as Linear Maps](/topics/matrices-as-linear-maps/) |
| A direction $\mathbf{v}$ has unit length. What does the scalar $\mathbf{x} \cdot \mathbf{v}$ measure? | [Dot Products, Norms, and Angles](/topics/dot-products-norms-and-angles/) |
| What does it mean to remove a direction from an activation without changing anything else? | [Orthogonality and Projections](/topics/orthogonality-and-projections/) |
| Why can $W_Q W_K^T$ have rank at most $d_{\text{head}}$ regardless of how large $d_{\text{model}}$ is? | [Rank and Low-Rank Factorization](/topics/matrix-rank-and-low-rank-factorization/) |
| A model is trained to minimize cross-entropy. What quantity is that, in units you can state? | [Entropy, Cross-Entropy, and Perplexity](/topics/entropy-and-cross-entropy/) |
| What does a gradient with respect to an *activation*, rather than a parameter, tell you? | [Backpropagation and Automatic Differentiation](/topics/backpropagation-and-autodiff/) |
| Why is $P(\text{sequence})$ a product of next-token conditionals? | [Language Modeling and Next-Token Prediction](/topics/language-modeling-and-next-token-prediction/) |
| What is the difference between conditioning on a variable and intervening on it? | [Causal Graphs and Interventions](/topics/causal-graphs-and-interventions/) |

Getting several of these wrong is not a reason to stop. It is a reason to follow the links, and then the links on those pages, until you reach something you already know.

## Following the Prerequisite Chain

Every article on this site lists what to read first, and those articles list what to read before *them*. Following that chain far enough always terminates in the assumed background above, so an article that looks impenetrable is never more than a few hops from ground you already have. The longest chain on the site runs 32 hops, from natural language autoencoders down to [Mathematical Notation, Sets, and Statements](/topics/mathematical-notation-and-sets/), which is the one article with no prerequisites at all.

Some links lead to articles marked as planned: the topic has a fixed place in the chain, and the page states its intended scope, but the article itself is not written yet.

<details class="pause-and-think">
<summary>Pause and think: which way does the matrix go?</summary>

Papers in this field are split between row-vector and column-vector conventions, and an equation copied from one into the other is dimensionally impossible. If a paper writes $\mathbf{q} = W_Q \mathbf{x}$ and this curriculum writes $\mathbf{q} = \mathbf{x} W_Q$, which of the two $W_Q$ matrices is the transpose of the other, and what happens to the shapes if you mix them?

The paper's $W_Q$ is $d_{\text{head}} \times d_{\text{model}}$ and ours is $d_{\text{model}} \times d_{\text{head}}$, so they are transposes. Mixing them produces a product whose inner dimensions do not match, which is the error to watch for whenever you carry an equation from a paper into code written against this curriculum's conventions.

</details>

## Notation Used Throughout

- Bold lowercase for vectors: $\mathbf{x}$, $\mathbf{r}$.
- Uppercase for matrices: $W$, $W_Q$, $W_K$, $W_V$.
- Residual stream at layer $l$: $\mathbf{r}^l$.
- Output of head $h$ in layer $l$: $\mathbf{r}^{l,h}$.
- **Activations are row vectors and weights act on the right**: $\mathbf{q}_i = \mathbf{x}_i W_Q$, never $W_Q \mathbf{x}_i$.

The last of these is the one that causes trouble, and [The Attention Mechanism](/topics/attention-mechanism/) states it once more at the point where the first matrix product appears.

## Looking Ahead

[Transformer Architecture Intro](/topics/transformer-architecture/) follows a single token through a decoder-only model end to end, which is the concrete picture every later article refers back to.
