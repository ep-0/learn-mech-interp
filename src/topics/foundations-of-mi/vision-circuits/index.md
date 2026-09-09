---
title: "Circuits in Vision Models"
description: "The curve detectors, high-low frequency detectors, and equivariant families found in InceptionV1, and the standard of evidence that first made circuit claims credible."
order: 4
status: placeholder
prerequisites:
  - title: "What Is Mechanistic Interpretability?"
    url: "/topics/what-is-mech-interp/"
---

## Why this article exists

The circuits programme began in vision, and the vision results are still the most completely verified in the field: a curve detector traced through its weights, its behavior predicted, and the prediction confirmed. Language work rarely reaches that standard, so the vision case study is the reference point for what a finished circuit claim looks like. It is also the most enjoyable reading in interpretability.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Features in a vision model**

- Feature visualization by optimization, and what an optimized image does and does not show
- Dataset examples as the complementary evidence
- Early layers: edges, colors, and Gabor-like filters

**2. Curve detectors as a worked circuit**

- The neuron family, its orientation tuning, and the evidence it is a curve detector rather than something correlated
- Reading the weights connecting early edge detectors to the curve family
- Synthetic stimuli and the predictions they confirmed

**3. Motifs that recur**

- Equivariance: families of units related by rotation, scale, or color transformation
- High-low frequency detectors and boundary detection
- Branch specialization, and weight banding as a puzzle rather than a result

**4. Multimodal neurons**

- Units in CLIP responding to a concept across photographs, drawings, and rendered text
- The typographic attack, and what it demonstrates about the representation
- The bridge from vision circuits to language interpretability

**5. What the standard of evidence was**

- Weights read directly, behavior predicted, prediction tested
- Why language models have been harder to hold to this standard
- The claims about universality that vision made first

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Convolutional architectures in detail
- Modern vision transformers and their interpretability, which the multimodal article covers
- Adversarial examples as a subject of their own

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Explain what evidence turned 'this neuron correlates with curves' into 'this neuron is a curve detector'
- Describe one equivariance motif and what it implies about how the network organizes features
- State why feature visualization alone is insufficient, and what has to accompany it

## Sources to learn from

- Olah et al., *Zoom In: An Introduction to Circuits* (Distill, 2020) — Start here. The founding statement, and the clearest account of the three claims this curriculum rests on.
- Cammarata et al., *Curve Detectors* and *Curve Circuits* (Distill, 2020-2021) — The full case study. Read both: the first establishes the neurons exist, the second reads the circuit off the weights.
- Olah et al., *Multimodal Neurons in Artificial Neural Networks* (Distill, 2021) — The CLIP result, including the typographic attacks. The most vivid demonstration of modality-independent features.
- Explore the figures: the Distill circuits articles ship interactive feature visualizations and weight diagrams alongside the text — Spend time in them. The claim these papers make is that you can read a mechanism off the weights, and the figures are the evidence rather than an illustration of it.
- Olah et al., *Feature Visualization* (Distill, 2017) — The method and, more usefully, its failure modes and the regularization needed to make it honest.
