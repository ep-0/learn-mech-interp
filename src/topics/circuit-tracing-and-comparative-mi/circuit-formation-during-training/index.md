---
title: "How Circuits Form During Training"
description: "Watching a mechanism appear over training rather than examining it at the end: phase changes, the order in which capabilities arrive, and what checkpoints can establish that a final model cannot."
order: 4
status: placeholder
prerequisites:
  - title: "Induction Heads and In-Context Learning"
    url: "/topics/induction-heads/"
  - title: "Grokking and Progress Measures"
    url: "/topics/grokking-and-progress-measures/"
---

## Why this article exists

Every circuit you will study was built by a training run, and the run leaves evidence the final weights do not. Induction heads appear in a narrow window that coincides with a jump in in-context learning; that coincidence is an argument about causation you can only make with checkpoints. This is also the practical route into research, since open checkpoint suites make the experiments cheap.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Training as an object of study**

- Checkpoints as a sequence of models rather than a means to an end
- Open suites: Pythia, OLMo, and the model-diffing setups that depend on them
- What a trajectory can show that an endpoint cannot

**2. Phase changes**

- The induction-head bump, measured, and its coincidence with in-context learning
- How to tell a phase change from a smooth transition badly measured
- Progress measures applied across training

**3. The order things are learned**

- Simplicity biases and which structure appears first
- Circuits that form, get used, and are later replaced
- Fine-tuning as a short trajectory on top of a long one

**4. Developmental interpretability**

- The programme: study formation, not just structure
- Singular learning theory as one proposed formalism, described without overclaiming
- Which of its predictions have been tested

**5. Designing a training-dynamics experiment**

- Choosing checkpoints densely enough to see the transition
- Controls: seed variation, and distinguishing a real change from noise
- Reporting what varies across seeds rather than a single run

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Optimization theory and convergence analysis
- Scaling laws as a subject of their own
- Curriculum learning and data ordering as training techniques

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Measure the formation of induction heads across a checkpoint series and plot it against an in-context-learning metric
- Distinguish a genuine phase change from a metric artifact, with a concrete test
- Say what a checkpoint study can establish about causation that a final-model study cannot

## Sources to learn from

- Olsson et al., *In-Context Learning and Induction Heads* (transformer-circuits.pub, 2022) — The phase-change evidence in full, including the authors' own caveats about the causal claim.
- Biderman et al., *Pythia: A Suite for Analyzing Large Language Models Across Training and Scaling* (arXiv:2304.01373) — The checkpoint suite most of this work runs on, plus the analyses it was built to support.
- Singh et al., *What Needs to Go Right for an Induction Head?* (arXiv:2404.07129) — Formation dynamics in a controlled setting, which explains the phase change rather than reporting it.
- Use the checkpoints: EleutherAI's Pythia suite was released with intermediate training checkpoints precisely so questions like this can be asked — Pick a behavior with a known circuit, run the same probe or patch at a series of checkpoints, and plot when it appears.
- Hoogland et al., *The Developmental Landscape of In-Context Learning* (arXiv:2402.02364) — Developmental interpretability applied concretely, and a fair test of whether the formalism earns its keep.
