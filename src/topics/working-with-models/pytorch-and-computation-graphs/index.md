---
title: "PyTorch Tensors, Modules, and Hooks"
description: "The tensor and module abstractions interpretability tooling is built on, and the forward and backward hooks that make reading and editing activations possible."
order: 1
status: placeholder
prerequisites:
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"
  - title: "Tensors, Shapes, and Einsum Notation"
    url: "/topics/tensors-and-einsum-notation/"
  - title: "GPUs, Memory, and Numerical Precision"
    url: "/topics/gpus-memory-and-precision/"
---

## Why this article exists

TransformerLens, nnsight, and SAE Lens are all wrappers over the same hook mechanism, and knowing what a hook is makes the difference between using those libraries and being able to check what they did.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Tensors**

- Creation, dtype, device, and the memory cost of activations at transformer scale
- Views versus copies, and the in-place operations that break autograd
- The shape conventions used by Hugging Face transformer models

**2. Modules**

- `nn.Module`, parameters, buffers, and the module tree
- Named modules, and how a hook target like `blocks.5.attn.hook_z` resolves
- `state_dict`, and reading weights directly

**3. Hooks**

- Forward hooks, forward pre-hooks, and backward hooks, and exactly when each fires
- Returning a modified value from a hook, which is how interventions are implemented
- Removing hooks, and the leaks that follow from forgetting

**4. Gradients and memory**

- `requires_grad`, `no_grad`, and `inference_mode`, with the difference between the last two
- Retaining gradients on non-leaf activations, which attribution methods need
- Activation caching, and the memory arithmetic for a full model's cache

**5. A minimal intervention, end to end**

- Cache an activation, modify it on a second run, measure the logit difference
- The same operation written directly in PyTorch and in TransformerLens, side by side
- What the library is doing for you, so that you can check it

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Implement activation patching in raw PyTorch with hooks, without a library
- Estimate the memory needed to cache all residual-stream activations for a given model and batch
- Explain what `no_grad` changes and why an attribution method must not use it

## Sources to learn from

- The PyTorch tutorials: 'Learn the Basics' and the autograd mechanics notes — Start here. Then read the hooks documentation specifically.
- Karpathy, 'Let's build GPT', the PyTorch portions — Model code written in front of you, which is the fastest way to internalize the module tree.
- TransformerLens documentation, the 'Main Demo' and hook-points reference — The library this curriculum uses, and its naming scheme for activation sites.
- Build a hook you will actually use: cache one layer's activations on a forward pass, then write a second hook that replaces them, and confirm the output changes — This is activation patching in miniature, and every causal method later in this curriculum is a variation on those twenty lines.
- nnsight documentation, the tracing tutorial — The alternative execution model, worth seeing early so the two do not blur together.

## Where the curriculum uses it

[ARENA: Hands-On Technical Training](/topics/arena/), [TransformerLens](/topics/transformerlens/).
