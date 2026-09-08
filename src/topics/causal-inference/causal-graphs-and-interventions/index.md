---
title: "Causal Graphs and Interventions"
description: "Directed acyclic graphs as causal models, the difference between conditioning and intervening, and what an intervention licenses that an observation does not."
order: 1
status: placeholder
prerequisites:
  - title: "Conditional Probability, Independence, and Bayes' Rule"
    url: "/topics/conditional-probability-and-bayes/"
---

## Why this article exists

Activation patching is an intervention on a computational graph, and the entire argument that interpretability findings are causal rather than correlational is borrowed from this framework.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Structural causal models**

- Variables, structural equations, and exogenous noise
- The DAG induced by the equations, and what an arrow means
- A three-variable worked example carried through the article

**2. Conditioning versus intervening**

- $P(Y \mid X = x)$ against $P(Y \mid do(X = x))$, with a worked case where they differ
- Graph surgery: intervention as deleting incoming edges
- Why observational data alone cannot distinguish some graphs

**3. Paths and separation**

- Chains, forks, and colliders, and the flow of association through each
- d-separation, stated as a rule and applied to the running example
- Backdoor paths, and what blocking one accomplishes

**4. A network as a causal graph**

- Activations as variables, the forward pass as the structural equations
- The unusual property here: we can intervene on any node exactly and for free
- What that buys compared to causal inference in the sciences, and what it does not

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Draw the DAG for a small model and identify the colliders
- Explain the difference between conditioning and intervening using a transformer example
- State what makes interpretability an unusually favorable setting for causal inference

## Sources to learn from

- Pearl, Glymour & Jewell, *Causal Inference in Statistics: A Primer*, chapters 1-3 — The shortest rigorous introduction. Work the exercises; they are the point.
- Peters, Janzing & Schölkopf, *Elements of Causal Inference*, chapters 1-3 and 6 — More formal, and freely available from MIT Press.
- Pearl, *The Book of Why* — For the conceptual arguments, especially the ladder of causation. Read it alongside, not instead of, the technical text.
- Geiger et al., 'Causal Abstraction: A Theoretical Foundation for Mechanistic Interpretability' (arXiv:2301.04709) — Skim now, return later. It is the formal bridge between this material and this curriculum.

## Where the curriculum uses it

[Circuit Tracing and Attribution Graphs](/topics/circuit-tracing/), [Counterfactuals and Confounding](/topics/counterfactuals-and-confounding/), [Mediation: Direct and Indirect Effects](/topics/mediation-direct-and-indirect-effects/).
