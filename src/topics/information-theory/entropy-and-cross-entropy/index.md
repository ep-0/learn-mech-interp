---
title: "Entropy, Cross-Entropy, and Perplexity"
description: "Information content as surprise, entropy as its expectation, and the cross-entropy loss and perplexity that language modeling reports."
order: 1
status: placeholder
prerequisites:
  - title: "Expectation, Variance, and Covariance"
    url: "/topics/expectation-variance-and-covariance/"
---

## Why this article exists

Cross-entropy is the loss every language model is trained on, and perplexity is how its quality is quoted. Interpretability results are frequently reported as a change in that loss, so the units matter.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Surprisal**

- $-\log p(x)$ as the information content of an outcome, motivated by the properties it must satisfy
- Units: bits with $\log_2$, nats with $\ln$, and converting between them
- Why the log is forced rather than chosen

**2. Entropy**

- $H(p) = -\sum p(x)\log p(x)$ as expected surprisal
- Maximum entropy for a uniform distribution, minimum for a point mass
- Worked entropies for a few small distributions

**3. Cross-entropy**

- $H(p, q) = -\sum p(x)\log q(x)$, and reading it as the cost of coding $p$ with a code built for $q$
- The training objective of a language model, written out on one token
- Why $H(p,q) \ge H(p)$, with the gap named

**4. Perplexity**

- $\exp(H)$, and its reading as an effective vocabulary size
- Bits per token, bits per byte, and why tokenizer differences make raw perplexity incomparable
- Converting a reported loss into a perplexity and back

**5. Conditional and sequence entropy**

- Conditional entropy, and the entropy rate of a sequence model
- What a loss of 2.1 nats per token actually says about a model's uncertainty

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Convert between loss, perplexity, and bits per token without looking it up
- Explain why two models' perplexities are incomparable across tokenizers
- Interpret a reported loss delta from an ablation in interpretable units

## Sources to learn from

- MacKay, *Information Theory, Inference, and Learning Algorithms*, chapters 1-2 and 4 — Start here. The best introduction to entropy that exists, and freely available. Do the exercises. MacKay's Cambridge lectures on the same material are also free and are the better entry: he died in 2016 and they remain the clearest teaching of this subject by anyone.
- Cover & Thomas, *Elements of Information Theory*, chapter 2 — The rigorous reference for every identity you will need.
- Chris Olah, 'Visual Information Theory' (colah.github.io) — The pictures that make cross-entropy and KL feel geometric rather than symbolic.
- Jurafsky & Martin, *Speech and Language Processing* (3rd ed. draft), the perplexity section of the n-gram chapter — Perplexity as the NLP field defines and misuses it. Freely available.

## Where the curriculum uses it

[KL Divergence and Mutual Information](/topics/kl-divergence-and-mutual-information/), [Softmax and the Cross-Entropy Loss](/topics/softmax-and-cross-entropy-loss/).
