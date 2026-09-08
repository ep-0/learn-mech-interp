---
title: "Complex Numbers and Euler's Formula"
description: "Arithmetic with i, the polar form that turns multiplication into rotation, and the identity linking the exponential to sine and cosine."
order: 9
status: placeholder
prerequisites:
  - title: "Trigonometry and the Unit Circle"
    url: "/topics/trigonometry-and-the-unit-circle/"
  - title: "Exponentials and Logarithms"
    url: "/topics/exponentials-and-logarithms/"
---

## Why this article exists

A real matrix can have complex eigenvalues, and when it does they encode rotation rather than scaling, which is how periodic and circular features get described. Rotary position embeddings are usually derived in complex notation, and the compact form of a sinusoidal encoding is $e^{i\omega t}$.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Arithmetic**

- $i$ defined by $i^2 = -1$, and why the definition is forced rather than arbitrary
- Addition, multiplication, and the conjugate
- Division by rationalizing with the conjugate

**2. The complex plane**

- A complex number as a point, and as a vector from the origin
- Modulus and argument, and the polar form $r(\cos\theta + i\sin\theta)$
- Converting between rectangular and polar form

**3. Multiplication as rotation**

- Multiplying in polar form multiplies moduli and adds arguments
- Multiplication by a unit complex number as a pure rotation
- The angle addition formulas recovered from this, which is why the two topics belong together

**4. Euler's formula**

- $e^{i\theta} = \cos\theta + i\sin\theta$, motivated rather than proved
- Powers and roots of unity, and the picture of points evenly spaced on a circle
- Writing a sinusoid at frequency $\omega$ as $e^{i\omega t}$

**5. Where it returns**

- Complex eigenvalues of a real matrix, arriving in conjugate pairs
- The interpretation as rotation in a two-dimensional invariant subspace
- Circular features and periodic representations, named so they are not a surprise

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Complex analysis: analytic functions, contour integration, residues
- The fundamental theorem of algebra beyond its statement
- Complex-valued neural networks

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Multiply two complex numbers in polar form and describe the result as a rotation and a scaling
- Convert $e^{i\pi/3}$ to rectangular form and plot it
- Explain what a conjugate pair of eigenvalues says about a linear map's behavior

## Sources to learn from

- Tristan Needham, *Visual Complex Analysis*, chapter 1 — Complex numbers as geometry from the first page. Read only chapter 1; the rest is a different subject.
- 3Blue1Brown, 'Euler's formula with introductory group theory' — Twenty minutes, and it makes $e^{i\theta}$ inevitable rather than mysterious.
- Axler, *Precalculus: A Prelude to Calculus*, the complex numbers sections — The algebra done carefully, with exercises.
- Khan Academy, 'Complex numbers' — Free drills for the arithmetic and polar conversions.

## Where the curriculum uses it

[Eigenvectors, Eigenvalues, and Diagonalization](/topics/eigenvectors-and-diagonalization/).
