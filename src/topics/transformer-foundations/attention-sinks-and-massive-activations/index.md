---
title: "Attention Sinks and Massive Activations"
description: "Why a large share of attention lands on the first token, why a few residual-stream coordinates are thousands of times larger than the rest, and what both do to every measurement you take."
order: 8
status: placeholder
prerequisites:
  - title: "The Attention Mechanism"
    url: "/topics/attention-mechanism/"
  - title: "Layer Normalization"
    url: "/topics/layer-normalization/"
---

## Why this article exists

Open an attention pattern in a real model and the first thing you will see is most of the mass sitting on the first token, doing nothing. Print residual-stream norms and a handful of coordinates will dwarf everything else. Neither is a bug, both are load-bearing, and neither appears in the idealized picture of a transformer. They also distort attention plots, feature dictionaries, and quantization, so meeting them now saves a week of confusion later.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The observation**

- Attention mass concentrating on the first token, or on delimiters, across essentially all trained models
- Massive activations: a few residual-stream dimensions with magnitudes orders of magnitude above the rest
- That both appear early in training and persist

**2. Why sinks exist**

- Softmax must sum to one, so a head with nothing to attend to still has to put its mass somewhere
- The no-op interpretation, and the evidence that removing the sink degrades the model
- Attention sinks as implicit bias terms, and the architectural fixes that make the bias explicit

**3. Massive activations**

- Which dimensions, in which models, and how consistent they are across inputs
- Their function as fixed attention biases, established by ablation
- The relationship between massive activations and sink tokens

**4. The interaction with normalization**

- How LayerNorm's rescaling both creates and hides outlier magnitudes
- Why folding normalization into adjacent weights does not remove the problem
- Privileged directions in the residual stream that the basis-free picture denies

**5. Consequences for measurement**

- Attention pattern plots dominated by a column you should mostly ignore
- Sparse autoencoders spending capacity on outlier dimensions
- Quantization and low-precision inference breaking on these coordinates
- The practical habit: check for sinks before interpreting any pattern

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Efficient attention implementations and streaming inference as engineering topics
- Quantization methods in detail, beyond why outliers break them
- Register tokens and architectural fixes as a research area of their own

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Identify the sink in an attention pattern and say what remains after discounting it
- Find the massive-activation dimensions of a real model and show by ablation what they do
- Explain why softmax makes a sink almost inevitable in a head with nothing to attend to

## Sources to learn from

- Xiao et al., *Efficient Streaming Language Models with Attention Sinks* (arXiv:2309.17453) — Where the term comes from, plus the evidence that the sink is functional rather than decorative.
- Sun et al., *Massive Activations in Large Language Models* (arXiv:2402.17762) — The systematic study across models, including the ablations showing these dimensions act as fixed attention biases.
- Darcet et al., *Vision Transformers Need Registers* (arXiv:2309.16588) — The same phenomenon in vision, with an architectural fix. Reading both makes clear this is about softmax, not about language.
- Anthropic, *Privileged Bases in the Transformer Residual Stream* (transformer-circuits.pub, 2023) — Outlier dimensions from the interpretability side, and what they cost the basis-free picture of the residual stream.
