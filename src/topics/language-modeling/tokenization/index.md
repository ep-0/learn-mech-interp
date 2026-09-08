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

## What this article will cover

- Characters, bytes, words, and subwords as units
- Byte-pair encoding and the merge procedure
- Vocabulary size, leading spaces, and special tokens
- Tokenization artifacts: numbers, rare words, code, and non-English text
- Why token identity matters when designing a clean-corrupted prompt pair

## Where the curriculum uses it

[Transformer Architecture Intro](/topics/transformer-architecture/).
