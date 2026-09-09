---
title: "GPUs, Memory, and Numerical Precision"
description: "Why models run on accelerators, how to reason about what fits in memory, the float formats that trade precision for room, and the cost of the experiments this curriculum describes."
order: 5
status: placeholder
prerequisites:
  - title: "Arrays and Numerical Python"
    url: "/topics/arrays-and-numerical-python/"
---

## Why this article exists

Caching every residual-stream activation for a batch of prompts is the routine operation in this field, and it is also the one that fills a GPU. Knowing the memory arithmetic before running something is the difference between an experiment and an out-of-memory error at minute forty.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Why a GPU**

- Parallel arithmetic on large arrays as the thing an accelerator does well
- Host and device memory, and the cost of moving between them
- Choosing a device in code, and the failure mode of tensors on different devices

**2. Memory arithmetic**

- Counting bytes: parameters, activations, gradients, and optimizer state
- A worked estimate for a 7B model in bf16, with and without a full activation cache
- Why interpretability is activation-heavy in a way that inference is not
- Batch size, sequence length, and which one to cut first

**3. Numerical precision**

- float32, float16, and bfloat16, compared by range and by mantissa bits
- Why bfloat16 became the default, and what it costs in precision
- Where precision actually bites in this field: small logit differences and near-zero activations

**4. Floating point behavior**

- Rounding, catastrophic cancellation, and why a difference of two large numbers is untrustworthy
- Non-associativity, and why a sum's value depends on the reduction order
- The consequence for reproducibility: identical code, different hardware, different last digits

**5. The cost of an experiment**

- Counting forward and backward passes for a method before running it
- Why activation patching over every layer and position is expensive, and attribution patching is not
- Out-of-memory triage: shorter sequences, smaller batches, fewer cached sites, offloading to CPU

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Writing CUDA kernels, Triton, and low-level performance engineering
- Distributed and multi-GPU training, sharding, and parallelism strategies
- Quantization methods as a research topic, as opposed to the formats you will encounter

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Estimate whether caching a given set of activations will fit in a given amount of GPU memory
- Explain why bf16 is preferred to fp16 for training in terms of range and mantissa
- Predict the number of forward passes a described patching experiment requires

## Sources to learn from

- Horace He, 'Making Deep Learning Go Brrrr From First Principles' — The clearest explanation of where time actually goes on a GPU: compute, memory bandwidth, or overhead.
- The PyTorch documentation on CUDA semantics and on automatic mixed precision — The mechanics: devices, transfers, memory caching, and what autocast changes.
- David Goldberg, 'What Every Computer Scientist Should Know About Floating-Point Arithmetic' (1991), the first two sections — Rounding and cancellation, explained once and permanently.
- Profile something: run a small model under `torch.profiler`, then halve the batch size and change the dtype, and predict each effect on memory and wall time before you measure it — Where your predictions are wrong is exactly where your model of the hardware is wrong.
- Kalamkar et al., 'A Study of BFLOAT16 for Deep Learning Training' — Why the format exists and what the tradeoff against float16 actually is.

## Where the curriculum uses it

[PyTorch Tensors, Modules, and Hooks](/topics/pytorch-and-computation-graphs/).
