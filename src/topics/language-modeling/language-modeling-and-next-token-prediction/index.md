---
title: "Language Modeling and Next-Token Prediction"
description: "Factoring the probability of a sequence into next-token conditionals, the training objective that follows, and what the resulting model is and is not."
order: 1
status: placeholder
prerequisites:
  - title: "Softmax and the Cross-Entropy Loss"
    url: "/topics/softmax-and-cross-entropy-loss/"
---

## Why this article exists

Everything the curriculum interprets is a next-token predictor, and a surprising number of confusions about model behavior dissolve once the objective it was actually trained on is clear.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The objective**

- The autoregressive factorization written out on a short sequence
- The training loss as an average cross-entropy over positions
- What the model is: a family of conditional distributions, one per prefix

**2. Training mechanics**

- Teacher forcing, and the train-inference mismatch it creates
- Causal masking, and where in the architecture it lives
- Loss computed at every position in parallel, which is the efficiency the architecture buys

**3. Evaluating a language model**

- Loss, perplexity, and bits per byte
- Why downstream benchmarks and loss can move in different directions
- Contamination, and the reason loss on held-out text remains a useful measure

**4. Masked versus causal**

- BERT-style masked modeling contrasted with GPT-style causal modeling
- Which one this curriculum studies, and why
- What the distinction implies about which positions can carry which information

**5. What next-token prediction is not**

- Not a model of truth, intention, or the speaker
- Simulator framings, briefly, and their limits as an explanation
- The behaviors that follow from the objective, and those that come from later training stages

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Write the training loss for a specific short sequence, with every term named
- Explain what causal masking makes impossible, in terms of information flow
- Distinguish claims about a base model's objective from claims about a chat model's behavior

## Sources to learn from

- Jurafsky & Martin, *Speech and Language Processing* (3rd ed. draft), the n-gram and neural LM chapters — Start here. The clearest development of the objective, from counting to neural models. Freely available.
- Karpathy, 'Let's build GPT: from scratch, in code, spelled out' — The objective implemented end to end, which makes the masking concrete.
- Stanford CS224N, the lectures on language models — Free video from the group that has taught this longest. Use it for the framing that connects n-gram models, neural LMs and transformers as one lineage rather than three topics.
- Radford et al., 'Language Models are Unsupervised Multitask Learners' (GPT-2) — Read for the argument that the objective alone induces general capability.
- Bender & Koller, 'Climbing towards NLU' (ACL 2020) and responses to it — Optional, and useful for calibrating what the objective does and does not imply.

## Where the curriculum uses it

[Pretraining, Fine-Tuning, and RLHF](/topics/pretraining-finetuning-and-rlhf/), [Sequence Models Before Transformers](/topics/sequence-models-before-transformers/), [Tokenization and Subword Vocabularies](/topics/tokenization/).
