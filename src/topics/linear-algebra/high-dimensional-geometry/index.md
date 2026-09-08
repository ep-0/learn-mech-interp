---
title: "Geometry in High Dimensions"
description: "Why volume, distance, and angle behave counterintuitively in many dimensions, and how many almost-orthogonal directions a space of dimension d actually holds."
order: 12
status: placeholder
prerequisites:
  - title: "Dot Products, Norms, and Angles"
    url: "/topics/dot-products-norms-and-angles/"
---

## Why this article exists

The superposition hypothesis rests on a counting argument: $\mathbb{R}^d$ contains exponentially many almost-orthogonal directions even though it holds only $d$ exactly orthogonal ones. That claim is a theorem about high-dimensional geometry, and it deserves to be understood rather than assumed.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Intuitions that fail**

- Volume concentrating near the shell of a ball
- Almost all the mass of a Gaussian sitting near a thin annulus
- Random vectors being nearly orthogonal, with the $\cos\theta \sim 1/\sqrt{d}$ calculation

**2. Concentration of measure**

- The statement for Lipschitz functions on the sphere, without full proof
- Why sample averages in high dimension are unusually well behaved
- The consequence for norms: $\|\mathbf{x}\|$ concentrates sharply

**3. Johnson-Lindenstrauss**

- The lemma stated precisely, with the $O(\log n / \epsilon^2)$ dimension bound
- Random projection as a near-isometry, worked as a concrete example
- What it does and does not promise about preserving structure

**4. Counting almost-orthogonal directions**

- How many unit vectors fit in $\mathbb{R}^d$ with pairwise $|\cos\theta| < \epsilon$
- The exponential-in-$d$ answer, and the interference cost of using them
- This is the quantitative content of the superposition hypothesis, so state it as a theorem, not an intuition

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Estimate the expected cosine similarity of two random unit vectors in $\mathbb{R}^{768}$
- State the Johnson-Lindenstrauss bound and apply it to a concrete embedding-compression question
- Explain, with numbers, why a 768-dimensional space can host far more than 768 features

## Sources to learn from

- Blum, Hopcroft & Kannan, *Foundations of Data Science*, chapter 2 — The best single treatment of high-dimensional geometry for this purpose. Freely available.
- Roman Vershynin, *High-Dimensional Probability*, chapters 3 and 5 — Concentration done rigorously. Harder, and worth it if you want the proofs. Freely available.
- Elhage et al., 'Toy Models of Superposition' (transformer-circuits.pub, 2022) — Read the geometry sections. This is where the counting argument is used to make an empirical claim.
- Sanjoy Dasgupta & Anupam Gupta, 'An elementary proof of a theorem of Johnson and Lindenstrauss' — Four pages, and it makes the lemma concrete rather than cited.

## Where the curriculum uses it

[Manifolds, Charts, and Tangent Spaces](/topics/manifolds-and-tangent-spaces/), [The Superposition Hypothesis](/topics/superposition/).
