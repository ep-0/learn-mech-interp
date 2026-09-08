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

## What this article will cover

- Pretraining data, scale, and what the base model learns
- Supervised fine-tuning, instruction tuning, and chat templates
- Reward models and RLHF, including PPO and direct preference optimization
- How much fine-tuning changes weights, and how localized those changes are
- Base versus chat models as a controlled pair for model diffing

## Where the curriculum uses it

[Feature-Level Model Diffing](/topics/feature-level-model-diffing/), [In-Context Learning and Prompting](/topics/in-context-learning/), [Memorization and Machine Unlearning](/topics/memorization-and-unlearning/), [The Refusal Direction](/topics/refusal-direction/).
