---
title: "Embeddings and Distributed Representations"
description: "Representing discrete items as learned vectors, why the resulting geometry carries meaning, and what the word-vector analogy results did and did not show."
order: 6
status: placeholder
prerequisites:
  - title: "Neurons, Layers, and Activation Functions"
    url: "/topics/neurons-layers-and-activation-functions/"
---

## Why this article exists

The linear representation hypothesis is the modern descendant of the word-embedding result that directions in a learned vector space correspond to concepts, and its evidence and its overstatements both start here.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. From symbols to vectors**

- One-hot encoding, and embedding lookup as multiplication by a one-hot row
- The embedding matrix as a learned parameter
- Dimensionality, and what is lost and gained relative to one-hot

**2. Distributed representations**

- Localist versus distributed encoding, with the capacity argument
- Why distributed representations generalize and localist ones do not
- The historical thread from connectionism to current models

**3. Learned word vectors**

- The distributional hypothesis stated
- word2vec's objectives and GloVe's, briefly
- The analogy results, and what the arithmetic actually shows

**4. Critiques**

- The analogy evaluations' dependence on excluding the query words
- Anisotropy in contextual embeddings, and why raw cosine similarity misleads
- What survives: directions in embedding space do carry semantic structure, with qualifications

**5. Forward to the linear representation hypothesis**

- The same claim, restated for intermediate activations rather than input embeddings
- Why evidence from embeddings does not automatically transfer

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Explain embedding lookup as a matrix operation and state the shapes
- Summarize what the word-analogy results establish and what they were over-read as showing
- Articulate the difference between the embedding-space claim and the residual-stream claim

## Sources to learn from

- Mikolov et al., 'Efficient Estimation of Word Representations in Vector Space' (arXiv:1301.3781) — The original word2vec paper.
- Jurafsky & Martin, *Speech and Language Processing* (3rd ed. draft), the vector semantics and embeddings chapter — The best textbook treatment, and freely available.
- Train them yourself: fit word2vec or GloVe on a small corpus, then check whether the analogy arithmetic actually works on your own vectors — The famous king-man+woman result is much weaker and more dataset-dependent than its fame suggests, and finding that out first-hand is the point.
- Nissim, van Noord & van der Goot, 'Fair Is Better than Sensational: Man Is to Doctor as Woman Is to Doctor' (arXiv:1905.09866) — The methodological critique of the analogy results.
- Ethayarajh, 'How Contextual are Contextualized Word Representations?' (EMNLP 2019) — Anisotropy, and why similarity measurements on contextual embeddings need care.

## Where the curriculum uses it

[Comparing Representations Across Models](/topics/representation-similarity-measures/), [Embeddings](/topics/embeddings/).
