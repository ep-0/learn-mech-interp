---
title: "Training Deep Networks: SGD, Adam, and Schedules"
description: "Minibatch stochastic gradient descent, momentum and adaptive methods, learning-rate schedules, and the failure modes that show up at scale."
order: 4
status: placeholder
prerequisites:
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"
  - title: "Supervised Learning, Generalization, and Overfitting"
    url: "/topics/supervised-learning-and-generalization/"
---

## Why this article exists

Phase changes during training, the emergence of induction heads, and the differences between a base model and its fine-tune are all statements about a training trajectory, not just a final weight vector.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Minibatch SGD**

- The stochastic gradient as an unbiased estimate, with variance set by batch size
- Why noise is not purely a cost
- Epochs, steps, and the token-count framing used for language models

**2. Momentum and adaptive methods**

- Momentum as an exponential average of gradients
- Adam: the two moment estimates, bias correction, and the update rule written out
- AdamW and why decoupled weight decay was needed

**3. Schedules**

- Warmup, cosine and linear decay, and what each is fixing
- Learning rate as the most consequential hyperparameter
- Batch size and learning rate scaling relationships

**4. Failure modes**

- Exploding and vanishing gradients, and clipping
- Initialization schemes, and why they matter at depth
- Loss spikes, divergence, and the practice of restarting from a checkpoint

**5. Training as an object of study**

- Checkpoints as a sequence of models rather than a means to an end
- Phase changes and emergent capabilities, with the induction-head phase change as the example
- Why model diffing needs the trajectory, not just the endpoints

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Write the Adam update from memory and say what each term is compensating for
- Diagnose a training curve as a learning-rate problem, a data problem, or an initialization problem
- Explain why interpretability research increasingly uses checkpoint sequences

## Sources to learn from

- Goodfellow et al., *Deep Learning*, chapter 8 — Optimization for deep models, including initialization and the algorithms.
- Kingma & Ba, 'Adam' (arXiv:1412.6980) and Loshchilov & Hutter, 'Decoupled Weight Decay Regularization' (arXiv:1711.05101) — The two papers. Short, and worth reading in the original.
- Godbole, Dahl, Gilmer, Shallue & Nado, *Deep Learning Tuning Playbook* — Free. What to tune, in what order, how many seeds to run, and how to tell a real improvement from noise. The closest thing the field has to a manual for running experiments.
- Karpathy, 'Let's build GPT' and 'Let's reproduce GPT-2 (124M)' — Training as it is actually done, including the schedule and stability tricks.
- Olsson et al., 'In-context Learning and Induction Heads' (transformer-circuits.pub, 2022) — The phase-change result. Read for why training dynamics is an interpretability question.

## Where the curriculum uses it

[Grokking and Progress Measures](/topics/grokking-and-progress-measures/), [Normalization and Residual Connections](/topics/normalization-and-residual-connections/), [Pretraining, Fine-Tuning, and RLHF](/topics/pretraining-finetuning-and-rlhf/).
