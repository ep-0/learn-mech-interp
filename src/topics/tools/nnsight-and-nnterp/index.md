---
title: "nnsight and nnterp"
seoTitle: "nnsight and nnterp: Model Intervention Tools"
description: "Using nnsight to inspect and intervene on Hugging Face models, and nnterp to write the same interpretability code across different architectures."
order: 2
prerequisites:
  - title: "TransformerLens"
    url: "/topics/transformerlens/"

glossary:
  - term: "Intervention Graph"
    definition: "A portable, serializable representation of a set of model interventions in nnsight. The intervention graph decouples the experimental design from model deployment, enabling the same experiment to run locally or on remote infrastructure."
  - term: "Tracing Context"
    definition: "A Python context manager in nnsight where code is captured rather than executed immediately. Operations on model internals within a tracing context build up an intervention graph that is executed as a batch when the context exits."

exitCriteria:
  - task: "nnsight's tracing context captures operations into an intervention graph instead of executing them immediately. Explain what this deferral makes possible that direct hooks do not."
    answer: |
      Deferring execution turns an experiment into a **data structure**, and a data structure can be moved.

      With ordinary PyTorch hooks, the intervention is a Python callback running in the same process as the model. That binds the experiment to wherever the model lives. An intervention graph is instead a *description* — what to read, what to modify, what to compute — which is serializable and therefore portable.

      That is what makes remote execution work, and remote execution is the point. The most capable open-weight models need multiple high-end GPUs for inference alone, and caching activations for interpretability makes it worse. Separating experimental design from model deployment lets a researcher write the experiment on a laptop and execute it on shared infrastructure where a 405B model is already resident.

      Two secondary benefits follow from the same property. The whole graph executes as one batch, so the framework can schedule it efficiently rather than paying per-hook overhead. And `.save()` becomes meaningful: tensors not explicitly marked exist only inside the graph and are discarded, which keeps memory minimal when you need a few specific activations from a very large model.

      The cost is a layer of indirection — code inside the context does not behave like ordinary Python.
  - task: "TransformerLens reimplements each architecture; nnsight wraps any PyTorch model. State the bottleneck this removes and the two kinds of coverage it buys."
    answer: |
      **The bottleneck:** every new model family requires someone to write conversion code, verify numerical equivalence against the original, and maintain it as the upstream implementation changes. When a new Llama or Qwen variant is released there is an unavoidable lag before it can be studied — and that lag falls on exactly the models people most want to study.

      **Coverage bought, two kinds:**

      1. **Temporal.** A model is available the moment it exists in PyTorch, because nothing needs reimplementing.
      2. **Architectural.** Interpretability questions apply to vision models, multimodal models, diffusion models, and state space models, none of which a transformer-specific library can reach. Wrapping arbitrary PyTorch removes the restriction entirely — which matters directly for the [multimodal](/topics/multimodal-mi/) and cross-architecture [universality](/topics/universality/) work.

      **What is given up** is the uniform vocabulary. TransformerLens's canonical hook names are a shared language precisely because the library imposes one convention; a general wrapper exposes whatever the underlying module graph happens to be called. That is why nnterp exists — a standardized TransformerLens-like interface layered on nnsight, recovering the convention without the reimplementation.
  - task: "In the example, `hidden = model.transformer.h[5].output[0].save()` uses HuggingFace-native module paths. Say what this implies for portability, and what nnterp adds."
    answer: |
      **The implication:** the experiment is written against *this model's* module names. `model.transformer.h[5]` is GPT-2's naming; a Llama model calls the same thing `model.model.layers[5]`, and a vision transformer something else again. So an nnsight experiment is portable in the sense that the *framework* runs anywhere, and not portable in the sense that matters — the code does not transfer between architectures without editing every path.

      This is the direct tradeoff for wrapping the native model rather than converting it. Preserving the original implementation means preserving its vocabulary, including its inconsistencies.

      **What nnterp adds:** a standardized interface over nnsight, so the same experiment can be written once against generalized components and run across transformer architectures without reimplementation. It recovers TransformerLens's shared vocabulary while keeping nnsight's execution model.

      The general shape here is worth noting, because it recurs across all three tools: uniformity of interface and fidelity to the original implementation pull against each other, and each library picks a point on that line. TransformerLens 3's move to a bridge is the same tension resolved from the other side.

furtherReading:
  - title: "Fiotto-Kaufman et al., *NNsight and NDIF: Democratizing Access to Foundation Model Internals*"
    url: "https://arxiv.org/abs/2407.14561"
    note: "The design rationale, including the remote-execution model that is the real motivation for the tracing abstraction."
  - title: "The nnsight documentation and walkthrough"
    url: "https://nnsight.net/"
    note: "The tracing context is unusual enough that the tutorial is worth working through rather than skimming."
  - title: "The TransformerLens documentation"
    url: "https://transformerlensorg.github.io/TransformerLens/"
    note: "Implement the same intervention in both. The comparison teaches which abstraction fits which question."
---

## The Architecture Coverage Problem

[TransformerLens](/topics/transformerlens/) solved a fundamental problem: giving researchers clean access to model internals. But its approach, reimplementing each architecture from scratch, creates a bottleneck. Every new model family requires someone to write conversion code, test for numerical equivalence, and maintain compatibility as HuggingFace implementations evolve. When a new Llama or Qwen variant drops, there is an unavoidable lag before MI researchers can study it.

More fundamentally, TransformerLens is limited to transformer language models. Interpretability questions apply to vision models, multimodal models, diffusion models, and state space models too. And for very large models (70B+ parameters), running even a reimplemented version locally may not be feasible.

**nnsight** and **nnterp** address these limitations from complementary angles. nnsight provides a general-purpose framework for inspecting and intervening on *any* PyTorch model, with optional remote execution for models too large to run locally. nnterp builds on top of nnsight to provide a standardized, TransformerLens-like interface across transformer architectures without reimplementation.

## nnsight

### Origins and Motivation

nnsight was developed by the **NDIF team** (National Deep Inference Facility) at Northeastern University {% cite "fiotto2024nnsight" %}. The project grew out of a concrete problem: the most capable open-weight models are too large for most academic labs to run, let alone run interpretability experiments on. A 405B-parameter model requires multiple high-end GPUs just for inference. Adding the memory overhead of caching intermediate activations for MI research makes the hardware requirements even steeper.

The NDIF team's insight was to **separate experimental design from model deployment**. Researchers should be able to write interpretability experiments on their laptops and execute them on shared infrastructure where large models are already loaded and ready. This required a new abstraction: a way to describe interventions that is portable, serializable, and independent of where the model actually runs.

### The Tracing Context

nnsight's core abstraction is the **tracing context**, a Python context manager where code is captured rather than immediately executed. Inside a tracing context, operations on model modules build up an **intervention graph**: a description of what to read, what to modify, and what to compute. When the context exits, the entire graph executes as a batch.{% sidenote "The tracing context uses Python's standard context manager protocol. Under the hood, nnsight wraps every PyTorch module to intercept attribute access and method calls, building up a graph of deferred operations. This is conceptually similar to how JAX traces Python functions into XLA computations, but applied to model inspection rather than compilation." %}

Here is what reading a hidden state looks like:

```python
from nnsight import LanguageModel

model = LanguageModel("openai-community/gpt2")

with model.trace("The Eiffel Tower is in"):
    # Access the output of layer 5
    hidden = model.transformer.h[5].output[0].save()
    # Access attention weights at layer 8
    attn = model.transformer.h[8].attn.attn_dropout.input[0][0].save()

# After the context exits, saved tensors are available
print(hidden.shape)  # [1, 6, 768]
```

The `.save()` call marks a tensor for extraction. Without it, the tensor exists only within the intervention graph and is discarded after execution. This keeps memory usage minimal when you only need a few specific activations.

### Interventions

Reading activations is only half the story. nnsight supports arbitrary modifications within the tracing context:

```python
with model.trace("The Eiffel Tower is in"):
    # Zero out layer 5's output
    model.transformer.h[5].output[0][:] = 0

    # Or add a steering vector
    model.transformer.h[5].output[0][:, -1, :] += steering_vector

    # Save the modified output logits
    logits = model.output.save()
```

Because the tracing context captures operations as a graph rather than executing them immediately, nnsight can validate the intervention before running it, optimize execution order, and, critically, serialize the graph for remote execution.

### Remote Execution via NDIF

The intervention graph abstraction enables nnsight's most distinctive feature: **remote execution**. By adding `remote=True` to the trace call, the experiment runs on NDIF's shared infrastructure rather than locally:

```python
model = LanguageModel("meta-llama/Llama-3.1-405B", device_map="auto")

with model.trace("The Eiffel Tower is in", remote=True):
    hidden = model.model.layers[20].output[0].save()
```

The tracing style is designed to stay similar between local and remote execution. For a hosted model, nnsight serializes the intervention graph, executes it through the remote service, and returns tensors explicitly marked for saving. This avoids downloading the hosted checkpoint, while introducing service availability, access, privacy, and communication constraints.

### How nnsight Differs from TransformerLens

The two tools make different design choices:

| | TransformerLens | nnsight |
|---|---|---|
| **Approach** | Reimplements models from scratch | Wraps existing PyTorch models |
| **Model support** | 50+ transformer LMs (manually ported) | Any PyTorch model |
| **Naming** | Standardized (`blocks.0.attn.W_Q`) | Follows original model's naming |
| **Numerical match** | Near-identical (small FP differences possible) | Exact (same model code) |
| **Remote execution** | No | Yes (via NDIF) |
| **Ease of access** | Named HookPoints, cache | Tracing context, `.save()` |

Neither tool is strictly better. TransformerLens provides a more ergonomic interface for the models it supports, with named HookPoints and a rich cache system. nnsight is more general but requires knowing the model's internal module structure. Many researchers use both: TransformerLens for quick exploration on smaller models, nnsight when they need exact HuggingFace behavior or access to models TransformerLens does not support.

<details class="pause-and-think">
<summary>Pause and think: Local vs. remote tradeoffs</summary>

Consider a research project studying how a safety-relevant behavior (like refusal) works in Llama 3.1 405B. You could study it locally in a smaller model (Llama 3.1 8B via TransformerLens) or remotely in the full model (via nnsight + NDIF). What are the tradeoffs? The smaller model is faster to iterate on and does not depend on external infrastructure, but the circuit implementing refusal might differ between model sizes. The full model gives you the real behavior but each experiment takes longer and depends on NDIF availability. This is a practical decision MI researchers face regularly.

</details>

## nnterp

### The Standardization Gap

nnsight operates on many PyTorch models through their native module structure. GPT-2, Llama, and Gemma expose different paths, so architecture-specific code often needs adaptation. nnterp addresses this portability problem with shared accessors, while TransformerLens takes a different route by exposing standardized hook names in its supported model implementations.

**nnterp** (created by Clement Dumas) takes a middle path {% cite "dumas2024nnterp" %}. It is a thin wrapper around nnsight that provides a unified interface across transformer architectures *without* reimplementing them. The original HuggingFace model runs underneath; nnterp just standardizes how you refer to its components.

### Unified Access

nnterp provides consistent accessors that work identically across architectures:

```python
from nnterp import StandardizedTransformer

model = StandardizedTransformer("gpt2")
# Or: StandardizedTransformer("meta-llama/Llama-3.1-8B")
# Or: StandardizedTransformer("google/gemma-2-2b")

with model.trace("The Eiffel Tower is in"):
    # Same code, any architecture
    hidden = model.layers_output[5].save()
    attn = model.attentions_output[5].save()
    mlp_out = model.mlps_output[5].save()
```

Under the hood, nnterp maps `model.layers_output[5]` to the correct module path for whatever architecture you loaded. It standardizes all models to a naming scheme close to Llama's conventions: `layers`, `self_attn`, `mlp`, `ln_final`, `lm_head`. This gives you the portability of TransformerLens's naming with the fidelity of running the original HuggingFace model.

### Built-in Interpretability Methods

nnterp ships with standardized implementations of common MI techniques:

- **Logit lens:** Projects intermediate hidden states through the unembedding layer to see the model's evolving prediction at each layer, the technique we studied in [logit lens and tuned lens](/topics/logit-lens-and-tuned-lens/).
- **Patchscope:** Replaces activations from one context into another, implementing the framework from [Patchscopes](/topics/patchscopes/).
- **Activation steering:** Adds steering vectors at specified layers, as described in [addition-based steering](/topics/addition-steering/).

These implementations work across all supported architectures with no code changes. A logit lens analysis written for GPT-2 runs on Llama or Gemma by changing a single string.

### Architecture Coverage

nnterp supports over 50 model variants across 16+ architecture families, including GPT-2, GPT-J, Llama (all versions), Mistral, Mixtral (mixture-of-experts), Gemma 2 and 3, Qwen 2 and 3, Phi-3, and more. Adding a new architecture requires only a naming configuration, no reimplementation.

When you load a model, nnterp automatically validates that the standardized names resolve correctly and that interventions produce the expected effects. This validation catches configuration errors before they silently corrupt experimental results.{% sidenote "The validation system tests that module outputs have expected shapes, attention probabilities sum to 1, and interventions actually affect outputs. These are sanity checks rather than formal correctness proofs, but they catch the most common integration errors." %}

<details class="pause-and-think">
<summary>Pause and think: Choosing the right tool</summary>

You are starting a new MI project. Consider these scenarios and which tool (TransformerLens, nnsight, nnterp) you would reach for:

1. Quick exploration of attention patterns in GPT-2 Small on your laptop.
2. Comparing how a circuit works across GPT-2, Llama, and Gemma.
3. Running activation patching on a 70B-parameter model you cannot fit locally.
4. Studying a vision transformer's internal representations.

There is no single right answer, the tools are complementary, and experienced researchers often use multiple tools within the same project.

</details>

## The Evolving Tooling Landscape

The MI tooling ecosystem reflects the field's rapid maturation. TransformerLens established the abstractions (hook points, caches, named weight access) that made MI research practical. nnsight generalized the approach to work with any PyTorch model and introduced remote execution for large-scale experiments. nnterp bridged the gap, providing TransformerLens-style ergonomics on top of nnsight's generality.

Other tools serve adjacent needs. **Neuronpedia** provides a web interface for exploring [SAE features](/topics/sparse-autoencoders/) and attribution graphs interactively. **Gemma Scope** offers pre-trained SAEs for every layer of Gemma 2. Platform tools like **ARENA 3.0** provide structured exercises for learning MI techniques hands-on.

The trend is toward more accessible, more general, and more scalable tooling. As models grow larger and architectures diversify beyond standard transformers, tools that work with models as they are, rather than requiring reimplementation, become increasingly valuable. But the core workflow remains the same: load a model, inspect its internals, form a hypothesis about a mechanism, and test it with targeted interventions.
