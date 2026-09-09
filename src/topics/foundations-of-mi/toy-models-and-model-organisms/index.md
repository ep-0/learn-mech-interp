---
title: "Toy Models and Model Organisms"
description: "Building a small system you can fully understand, or a model deliberately trained to have the property you want to study, and the inferential cost of both."
order: 5
status: placeholder
prerequisites:
  - title: "The Superposition Hypothesis"
    url: "/topics/superposition/"
  - title: "Pretraining, Fine-Tuning, and RLHF"
    url: "/topics/pretraining-finetuning-and-rlhf/"
---

## Why this article exists

Much of what this field knows comes from systems built to be understood: a two-layer transformer, a network trained on modular arithmetic, a model deliberately given a backdoor. That is a methodology with its own logic, and knowing when a toy result transfers is one of the harder judgments in interpretability. It is also the fastest route to doing research yourself, because a toy model is something you can actually finish.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Why build a small thing**

- Full understanding as a goal that is only achievable below some scale
- Ground truth: in a toy setting you know the answer independently of the method
- The tradeoff, stated plainly: everything you learn is about the toy until shown otherwise

**2. Toy models of representation**

- The superposition toy model and what its phase diagram established
- Modular arithmetic and other algorithmic tasks with a known correct algorithm
- Othello-GPT and the emergent-world-model line, including how the original claim was revised

**3. Model organisms**

- Deliberately inserted backdoors, and what a detector that finds them has shown
- Emergent misalignment from narrow fine-tuning as an organism nobody designed
- Organisms for reward hacking, sycophancy, and hidden objectives

**4. The transfer question**

- What would have to be true for a toy result to hold at scale
- Cases where transfer held, and cases where it did not
- Designing the check rather than assuming the answer

**5. Building one yourself**

- Choosing a task with a known algorithm
- Training small enough to iterate in minutes
- The standard traps: a task too easy, a model too big, an evaluation that cannot fail

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Training infrastructure and hyperparameter tuning as engineering
- Interpretability results in toy settings, which the articles that own those results cover
- The philosophy of models and idealization

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Design a toy setting for a question you care about, with a ground truth you can check against
- Say what would have to hold for a specific toy result to transfer, and how you would test it
- Explain what a backdoor detector has and has not demonstrated

## Sources to learn from

- Elhage et al., *Toy Models of Superposition* (transformer-circuits.pub, 2022) — The exemplar. Read it for the methodology as much as for the result.
- Li et al., *Emergent World Representations* (arXiv:2210.13382) with Nanda's linear-probe follow-up — A toy result, a challenge to it, and a revision. The whole exchange is a short course in how these claims get tested.
- Hubinger et al., *Sleeper Agents* (arXiv:2401.05566) — Model organisms constructed for safety research, and an honest account of what a trained-in property can establish.
- Reproduce it: the Toy Models of Superposition experiments run in a notebook in minutes, and the paper's accompanying Colab is the fastest route in — Vary the sparsity yourself and watch the pentagon appear. A toy model is the rare thing in this field you can finish in an afternoon.
- Betley et al., *Emergent Misalignment* (arXiv:2502.17424) — An organism nobody designed, which is why it carries different evidential weight.
