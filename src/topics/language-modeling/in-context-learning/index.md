---
title: "In-Context Learning and Prompting"
description: "The ability of a trained model to pick up a task from examples in its prompt, how it is measured, and what varies with the format of the demonstrations."
order: 5
status: placeholder
prerequisites:
  - title: "Pretraining, Fine-Tuning, and RLHF"
    url: "/topics/pretraining-finetuning-and-rlhf/"
---

## Why this article exists

In-context learning is the behavior that induction heads and function vectors offer mechanistic accounts of, and those accounts are only assessable once the behavior itself is pinned down.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The phenomenon**

- Zero-shot, few-shot, and the format of a demonstration block
- The original GPT-3 result, and what was surprising about it
- Measuring it: accuracy against number of demonstrations

**2. Scaling**

- How in-context performance changes with model size and with example count
- Task diversity in pretraining as a predictor of in-context ability
- The distinction between improvement from examples and improvement from format

**3. What the demonstrations supply**

- Evidence that label correctness matters less than expected
- Input distribution, label space, and format as the components
- How this result has been qualified since, and where it stands

**4. Pattern completion**

- Induction as a behavioral description: [A][B] ... [A] predicts [B]
- Measuring induction behaviorally on repeated random sequences
- Keeping this separate from any claim about heads, which comes later

**5. Task vectors, behaviorally**

- The observation that a task can be summarized by an activation, described as a finding
- The experiments that establish it, and the ones that would be needed to explain it

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Design an experiment that separates learning from demonstrations from learning from format
- State the induction pattern precisely enough to test for it on random tokens
- Distinguish a behavioral claim about in-context learning from a mechanistic one

## Sources to learn from

- Brown et al., 'Language Models are Few-Shot Learners' (arXiv:2005.14165), sections 1-3 — The original result and its evaluation methodology.
- Min et al., 'Rethinking the Role of Demonstrations' (arXiv:2202.12837) — The label-correctness result. Read the follow-up literature too, since it has been refined.
- Olsson et al., 'In-context Learning and Induction Heads' (transformer-circuits.pub, 2022), the behavioral sections — Read only the parts that define and measure the behavior. The mechanism is a later article.
- Hendel, Geva & Globerson, 'In-Context Learning Creates Task Vectors' (arXiv:2310.15916) — The behavioral observation that function vectors later explain.

## Where the curriculum uses it

[Function Vectors](/topics/function-vectors/), [Induction Heads and In-Context Learning](/topics/induction-heads/).
