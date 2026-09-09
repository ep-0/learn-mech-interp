---
title: "Trigonometry and the Unit Circle"
description: "Angles in radians, sine and cosine read off the unit circle, the identities that actually get used, and cosine as the measure of how much two directions agree."
order: 8
status: placeholder
prerequisites:
  - title: "Coordinate Geometry, Distance, and Lines"
    url: "/topics/coordinate-geometry-and-distance/"
---

## Why this article exists

Cosine similarity is the field's default measure of whether two directions mean the same thing, sinusoidal position encodings are built from sine and cosine at many frequencies, and rotary embeddings rotate query and key vectors by an angle proportional to position. All three are this page.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Angles and radians**

- Radians defined by arc length, and why calculus prefers them
- Converting degrees to radians and back, and the values worth memorizing
- Angles beyond one turn, and negative angles

**2. Sine and cosine from the unit circle**

- A point on the unit circle as $(\cos\theta, \sin\theta)$
- The graphs, their period, amplitude, and phase
- Tangent, defined and then mostly set aside for this curriculum's purposes

**3. The identities that get used**

- The Pythagorean identity $\sin^2\theta + \cos^2\theta = 1$, straight from the circle
- The angle addition formulas, and the rotation they encode
- Frequency and phase shift: what $\sin(\omega t + \phi)$ does as $\omega$ and $\phi$ change

**4. Cosine as alignment**

- The law of cosines, and solving it for $\cos\theta$
- Reading $\cos\theta$ as a score: $1$ for same direction, $0$ for perpendicular, $-1$ for opposite
- This is the formula the dot product article will rearrange into cosine similarity

**5. Rotation**

- Rotating a point in the plane by an angle, written out in coordinates
- The angle addition formulas recognized as the statement that rotations compose
- Named forward: this is what rotary position embeddings do to a pair of coordinates

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Solving triangles, the law of sines, and applied trigonometry problems
- Inverse trigonometric functions beyond stating that they exist
- Trigonometric identities not used downstream, including sum-to-product and half-angle

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Give $\cos\theta$ for two vectors from their coordinates, using the law of cosines
- Write the coordinates of a point rotated by $\theta$ and verify the composition of two rotations
- Explain what varying the frequency in $\sin(\omega t)$ does to how fast the value cycles with position

## Sources to learn from

- Simmons, *Precalculus Mathematics in a Nutshell*, the trigonometry section — Start here. Roughly forty pages covering what calculus needs and nothing else. The best fit for this article's scope.
- Axler, *Precalculus: A Prelude to Calculus*, chapters 5-6 — The unit-circle development, carefully done.
- Khan Academy, 'Trigonometry' and the unit circle unit — Free, with the drills that make the standard values automatic.
- Su et al., 'RoFormer: Enhanced Transformer with Rotary Position Embedding' (arXiv:2104.09864), section 3.2 — Read ahead just far enough to see the rotation formulas appear verbatim. It makes the trigonometry feel purposeful.

## Where the curriculum uses it

[Complex Numbers and Euler's Formula](/topics/complex-numbers-and-eulers-formula/), [Derivatives and the Chain Rule](/topics/derivatives-and-the-chain-rule/), [Dot Products, Norms, and Angles](/topics/dot-products-norms-and-angles/).
