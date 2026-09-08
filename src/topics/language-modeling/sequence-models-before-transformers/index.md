---
title: "Sequence Models Before Transformers"
description: "N-gram models, recurrent networks, and early attention, and the specific limitations that the transformer architecture was designed to remove."
order: 3
status: placeholder
prerequisites:
  - title: "Language Modeling and Next-Token Prediction"
    url: "/topics/language-modeling-and-next-token-prediction/"
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"
---

## Why this article exists

Attention is easier to understand as an answer to a problem than as a formula, and the problem is the fixed-size bottleneck that recurrent encoders forced information through.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. N-gram models**

- Counting, smoothing, and the fixed context window
- Why they plateau, stated in terms of data sparsity
- The interpolation and backoff ideas, briefly

**2. Recurrent networks**

- The recurrence, the hidden state, and unrolling through time
- Backpropagation through time, and its cost
- The hidden state as a fixed-size summary of unbounded history

**3. Vanishing gradients and gating**

- Why the repeated Jacobian product shrinks or explodes
- LSTM and GRU gates, and what each gate controls
- What gating fixed and what it did not

**4. The bottleneck and additive attention**

- Encoder-decoder translation, and the single-vector bottleneck
- Bahdanau attention as a learned soft lookup over encoder states
- The idea that survived: content-based addressing

**5. What the transformer changed**

- Removing recurrence to allow parallel training
- Self-attention as attention applied within a sequence
- The tradeoff: quadratic cost and no built-in notion of order

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Explain the vanishing gradient problem in terms of a product of Jacobians
- Describe what problem attention was invented to solve, before self-attention existed
- Say what the transformer gave up in exchange for parallelism

## Sources to learn from

- Jurafsky & Martin, *Speech and Language Processing*, the RNN and LSTM chapter — The standard treatment, with the encoder-decoder setup.
- Chris Olah, 'Understanding LSTM Networks' (colah.github.io) — The diagrams everyone uses. Fifteen minutes.
- Bahdanau, Cho & Bengio, 'Neural Machine Translation by Jointly Learning to Align and Translate' (arXiv:1409.0473) — The original attention paper. Read it before the transformer paper.
- Vaswani et al., 'Attention Is All You Need' (arXiv:1706.03762) — Read the introduction and related work here, for the argument. The architecture comes later in the curriculum.
