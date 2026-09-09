---
title: "Mediation: Direct and Indirect Effects"
description: "Decomposing a total effect into the part routed through a mediator and the part that bypasses it, and the interventions that identify each."
order: 2
status: placeholder
prerequisites:
  - title: "Causal Graphs and Interventions"
    url: "/topics/causal-graphs-and-interventions/"
---

## Why this article exists

Patching an activation and measuring the change in output is a mediation analysis, and the noising and denoising variants correspond to different mediation estimands. Naming them explains why the two directions can disagree.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The mediation setup**

- Treatment, mediator, outcome, with the graph
- Total effect defined as an interventional contrast
- The question mediation answers: how much of the effect runs through $M$

**2. Direct and indirect effects**

- Controlled direct effect, defined by fixing the mediator
- Natural direct and natural indirect effects, defined by cross-world quantities
- Why the natural effects need an assumption the controlled ones do not

**3. Identification**

- The interventions that estimate each effect
- Assumptions: no unmeasured confounding of each link, stated explicitly
- In a neural network, which assumptions hold automatically and which do not

**4. Non-additivity**

- Why direct and indirect effects need not sum to the total
- Interaction between mediators, worked on a two-path example
- The interpretability consequence: individually unimportant components that matter jointly

**5. Noising and denoising as different questions**

- Patching a clean activation into a corrupted run, and the reverse
- Which mediation estimand each corresponds to
- A concrete case where the two disagree, and why neither is wrong

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Define the effect that a given patching experiment estimates, in mediation vocabulary
- Explain why noising and denoising results can disagree without either being a bug
- Identify the assumption that fails when two components interact

## Sources to learn from

- VanderWeele, *Explanation in Causal Inference: Methods for Mediation and Interaction*, chapters 1-2 — Start here. The standard reference. Dense, but the definitions are worth getting exactly right.
- Pearl, 'Interpretation and Identification of Causal Mediation' (2014) — Pearl's own account of the natural effects and the cross-world assumption.
- Vig et al., 'Investigating Gender Bias in Language Models Using Causal Mediation Analysis' (arXiv:2004.12265) — The paper that brought this framework into NLP interpretability. Read it fully.
- Zhang & Nanda, 'Towards Best Practices of Activation Patching' (arXiv:2309.16042) — The methodological consequences, including the noising/denoising distinction.

## Where the curriculum uses it

[Activation Patching and Causal Interventions](/topics/activation-patching/).
