---
title: "Pretraining, Fine-Tuning, and RLHF"
description: "The pipeline that turns a next-token predictor into a chat model: large-scale pretraining, supervised fine-tuning, and preference-based reinforcement learning."
order: 4
status: placeholder
prerequisites:
  - title: "Language Modeling and Next-Token Prediction"
    url: "/topics/language-modeling-and-next-token-prediction/"
  - title: "Training Deep Networks: SGD, Adam, and Schedules"
    url: "/topics/training-dynamics-and-optimizers/"
---

## Why this article exists

Refusal, evaluation awareness, alignment faking, and every model-diffing result compare a base model to a fine-tuned one, so what fine-tuning actually does to a model is not a detail that can be skipped.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Pretraining**

- Data scale and composition, and what is known about current mixtures
- Compute-optimal scaling, and the reason model sizes and token counts move together
- What the base model is: a distribution over internet-like text

**2. Supervised fine-tuning**

- Instruction tuning on demonstration data
- Chat templates, and the special tokens that mark roles
- How much of the model changes, measured in weight-space distance

**3. Preference learning**

- Reward models trained on pairwise comparisons
- PPO-based RLHF, with the KL penalty to the reference model and why it is there
- Direct preference optimization as the objective that removes the separate reward model

**4. What fine-tuning does mechanistically**

- Evidence that it is a small, low-rank-ish change on top of pretrained capability
- The 'superficial alignment' claim and the evidence for and against it
- Why refusal being mediated by a single direction is surprising given the training procedure

**5. Base and chat as a controlled pair**

- Two models differing by a known intervention, which is the setup model diffing exploits
- The confounds: tokenizer changes, template changes, and continued pretraining

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Describe the full pipeline from raw text to a deployed chat model, naming each stage's objective
- Explain what the KL term in RLHF is preventing
- State what a base-versus-chat comparison controls for and what it does not

## Sources to learn from

- Ouyang et al., 'Training language models to follow instructions with human feedback' (arXiv:2203.02155) — The InstructGPT paper. The reference description of the pipeline.
- Rafailov et al., 'Direct Preference Optimization' (arXiv:2305.18290) — DPO, and the derivation showing what RLHF was implicitly optimizing.
- Hoffmann et al., 'Training Compute-Optimal Large Language Models' (Chinchilla, arXiv:2203.15556) — Scaling, and why current models are trained the way they are.
- Zhou et al., 'LIMA: Less Is More for Alignment' (arXiv:2305.11206) — The superficial alignment hypothesis, which is worth reading critically.

## Where the curriculum uses it

[Feature-Level Model Diffing](/topics/feature-level-model-diffing/), [In-Context Learning and Prompting](/topics/in-context-learning/), [Memorization and Machine Unlearning](/topics/memorization-and-unlearning/), [The Refusal Direction](/topics/refusal-direction/), [Toy Models and Model Organisms](/topics/toy-models-and-model-organisms/).
