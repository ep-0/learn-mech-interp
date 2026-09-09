---
title: "Tokenization and Subword Vocabularies"
description: "How text becomes a sequence of integer tokens, the byte-pair encoding algorithm behind most vocabularies, and the artifacts tokenization leaves in model behavior."
order: 2
status: placeholder
prerequisites:
  - title: "Language Modeling and Next-Token Prediction"
    url: "/topics/language-modeling-and-next-token-prediction/"
---

## Why this article exists

Token boundaries decide what a model can attend to, and a large share of surprising interpretability findings, from odd first-token behavior to failures on numbers and spelling, are tokenizer artifacts rather than model mechanisms.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Units of text**

- Characters, bytes, words, and subwords, with the tradeoffs of each
- Vocabulary size against sequence length, as the central tension
- Why byte-level fallbacks exist

**2. Byte-pair encoding**

- The merge algorithm, worked on a small corpus by hand
- Training the tokenizer versus applying it
- WordPiece and Unigram/SentencePiece mentioned as the alternatives

**3. Practical structure**

- Leading-space tokens, and why ' the' and 'the' are different
- Special tokens: BOS, EOS, padding, and chat templates
- The first-position anomaly, and why BOS handling shows up in interpretability results

**4. Artifacts**

- Numbers split inconsistently, and the arithmetic failures that follow
- Rare words, non-English text, and code fragmenting into many tokens
- Glitch tokens, and what they revealed about undertrained embeddings

**5. Consequences for experiment design**

- Clean and corrupted prompts must tokenize to the same length for position-aligned patching
- Checking tokenization before attributing a result to a mechanism
- A short checklist to run on any new prompt set

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Run BPE by hand on a toy corpus and produce the merge list
- Diagnose a failed patching experiment caused by misaligned token boundaries
- Predict which of two prompt phrasings will tokenize more cleanly for an experiment

## Sources to learn from

- Sennrich, Haddow & Birch, 'Neural Machine Translation of Rare Words with Subword Units' (arXiv:1508.07909) — Start here. The BPE paper. Short and clear.
- Jurafsky & Martin, *Speech and Language Processing*, the tokenization sections of chapter 2 — The algorithm with worked examples.
- Karpathy, 'Let's build the GPT Tokenizer' — Implement BPE and see every artifact appear as a consequence of the algorithm.
- Rumbelow & Watkins, 'SolidGoldMagikarp' (LessWrong, 2023) — Glitch tokens. A good demonstration of tokenizer artifacts producing apparently mysterious model behavior.

## Where the curriculum uses it

[Transformer Architecture Intro](/topics/transformer-architecture/).
