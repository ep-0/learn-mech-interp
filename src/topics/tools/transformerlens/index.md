---
title: "TransformerLens"
seoTitle: "TransformerLens Guide: Hooks, Caches, and Patching"
description: "How TransformerLens 3 instruments Hugging Face models with named hooks, activation caches, interventions, weight access, and cross-architecture adapters."
order: 1
prerequisites:
  - title: "What Is Mechanistic Interpretability?"
    url: "/topics/what-is-mech-interp/"
  - title: "Composition and Virtual Attention Heads"
    url: "/topics/composition-and-virtual-heads/"
  - title: "PyTorch Tensors, Modules, and Hooks"
    url: "/topics/pytorch-and-computation-graphs/"

glossary:
  - term: "HookPoint"
    definition: "A named location in an instrumented model where an activation can be read, cached, or replaced during a forward pass."
  - term: "Activation Cache"
    definition: "A mapping from HookPoint names to intermediate activations recorded during a model run, used for post-hoc inspection and as sources for interventions."

exitCriteria:
  - task: "TransformerLens gives internal locations stable names across architectures. Say what problem this solves, and state clearly what it does not make true of an experiment."
    answer: |
      **The problem it solves:** PyTorch hooks can expose intermediate values, but the module names are architecture-specific. The same experiment written for GPT-2 will not run on Gemma or Llama without rewriting every path, so results are hard to reproduce and harder to compare. A HookPoint is a *named* location — after each attention head, after each MLP — that means the same thing across models, which is what makes an experimental protocol portable and a published result checkable.

      **What it does not make true:** that the experiment is valid. A hook identifies *where* an intervention occurred; everything that determines what the result means is still the researcher's: the prompt contrast, the replacement value, the metric, and the controls.

      The warning is worth taking seriously, because the library makes the mechanics so easy that the hard parts become the invisible ones. `run_with_cache` and a hook function will happily produce a patching heatmap from a badly-chosen corruption, a saturating metric, and a single prompt — and the plot looks the same as one from a well-designed experiment. The infrastructure removes the engineering obstacle that used to force people to think about the design first.
  - task: "TransformerLens 3 loads models through TransformerBridge, wrapping the native Hugging Face implementation, rather than converting weights into a unified `HookedTransformer`. Explain the tradeoff."
    answer: |
      **The old approach** converted pretrained weights into TransformerLens's own implementation. Its advantage was unusual transparency — one forward pass, fully readable, with everything in one convention. Its cost was that each architecture's forward pass had to be *reimplemented* inside the library, so coverage lagged, and any subtle divergence between the reimplementation and the original was a silent source of error.

      **The bridge** keeps the native Hugging Face model running and maps its module graph onto generalized components — embeddings, attention, MLPs, normalizations, blocks — with architecture adapters exposing uniform hooks over them.

      **The tradeoff:** forward-pass fidelity and architecture coverage, in exchange for a layer of indirection. The model you are studying is now literally the model everyone else runs, which matters for any result meant to say something about a deployed system. The cost is that the hooks sit on a mapping rather than on a transparent implementation, so understanding exactly where a hook lands requires understanding the adapter.

      The practical consequence: `HookedTransformer` is deprecated in the 3.x line and scheduled for removal, and it is useful mainly for reproducing older notebooks during migration. New experiments should start with the bridge.
  - task: "Canonical hook names are described as a shared vocabulary. Explain why a naming convention is a scientific contribution rather than an engineering convenience."
    answer: |
      Because it makes claims **comparable and checkable across papers**.

      A result stated as "we patched the residual stream before layer 8" is ambiguous — before or after the attention sublayer, before or after normalization, at which position — and each reading is a different experiment with different consequences for whether the additive decomposition holds. A result stated as `blocks.8.hook_resid_pre` is not ambiguous. Two groups can run the same intervention and be confident they ran the same intervention.

      That is the precondition for replication, which is the precondition for a body of results rather than a collection of demonstrations. It also lets a reader who knows the convention audit a method section for a mistake the authors did not flag — patching post-normalization when the argument requires pre-normalization, say.

      The convention travels beyond the library, too. Papers that never call TransformerLens still describe sites in its vocabulary, which is how a shared name becomes shared infrastructure.

      The residual risk is that a convention encodes assumptions. Naming a site `hook_resid_pre` presupposes the pre-norm architecture where that object is meaningful, and a field whose vocabulary is built around one architecture may find its questions shaped accordingly.

furtherReading:
  - title: "The TransformerLens documentation and *Main Demo* notebook"
    url: "https://transformerlensorg.github.io/TransformerLens/"
    note: "The library's own tour. This article has no citations; the docs are the source and should be read with a notebook open."
  - title: "Nanda, *Concrete Steps to Get Started in Transformer Mechanistic Interpretability*"
    url: "https://www.neelnanda.io/mechanistic-interpretability/getting-started"
    note: "The workflow the library was built around, by its author."
  - title: "Nanda, *Exploratory Analysis Demo*"
    url: "https://www.neelnanda.io/mechanistic-interpretability/exploratory-analysis-demo"
    note: "A full investigation carried out in the library, which teaches more than the API reference does."
  - title: "The PyTorch hooks documentation"
    url: "https://pytorch.org/docs/stable/generated/torch.nn.Module.html"
    note: "What the library is wrapping. Knowing this is what lets you check its behavior rather than trust it."
---

## Why a Dedicated Library?

A language model API normally returns logits or generated tokens. Mechanistic interpretability needs the computations in between: residual stream states, attention patterns, multi-layer perceptron (MLP) outputs, and the effects of replacing any of them during a forward pass. PyTorch hooks can expose those values, but architecture-specific module names make the same experiment difficult to move from GPT-2 to Gemma, Llama, or a recurrent model.

**TransformerLens** gives those internal locations stable names and provides common operations for reading or changing them. The library turns questions such as “what did head 7 attend to?” and “does the layer-10 residual state cause this prediction?” into cache lookups and controlled interventions.

> **HookPoint:** A named location in a model's computation where TransformerLens can record an activation or replace it while the forward pass continues.

The abstraction separates an interpretability experiment from much of the model-specific wiring. It does not make the experiment valid by itself. A hook identifies where an intervention occurred; the prompt contrast, replacement value, metric, and controls still determine what the result means.

## TransformerLens 3 Uses a Bridge

Neel Nanda created the library in 2022 under the name EasyTransformer. Early versions converted pretrained weights into a unified `HookedTransformer` implementation, which made model internals unusually transparent but required each architecture's forward pass to be reimplemented inside TransformerLens.

TransformerLens 3 changed the default architecture. New code loads models through **TransformerBridge**, which keeps the native Hugging Face implementation and maps its module graph onto generalized components such as embeddings, attention, MLPs, normalizations, and blocks. Architecture adapters then expose uniform hook points over those components.

> **TransformerBridge:** The recommended TransformerLens 3 interface, which instruments a native Hugging Face model through an architecture adapter instead of converting it into the older unified forward pass.

The two loading paths now have different roles:

| Path | Model execution | Status | Best fit |
|---|---|---|---|
| `TransformerBridge.boot_transformers(...)` | Preserves the native Hugging Face model and wraps it with adapters | Recommended for new code | Current models, broad architecture coverage, and forward-pass fidelity |
| `HookedTransformer.from_pretrained(...)` | Converts weights into the original TransformerLens implementation | Deprecated in version 3 and scheduled for removal in a future major release | Running and reproducing older notebooks during migration |

Existing `HookedTransformer` code continues to work in the 3.x line through compatibility machinery, but new experiments should begin with the bridge. The [official migration guide](https://transformerlensorg.github.io/TransformerLens/content/migrating_to_v3.html) documents API and weight-processing differences, while the [model tables](https://transformerlensorg.github.io/TransformerLens/content/model_tables.html) distinguish bridge coverage from legacy coverage.

## Hook Names Form a Shared Vocabulary

TransformerBridge gives each generalized component input and output hooks. These canonical names describe a path through the model rather than the private name used by one Hugging Face class:

| Canonical HookPoint | What it captures | Common legacy alias |
|---|---|---|
| `embed.hook_out` | Token embeddings | `hook_embed` |
| `blocks.{L}.hook_in` | Residual stream entering block L | `blocks.{L}.hook_resid_pre` |
| `blocks.{L}.attn.hook_pattern` | Attention weights after softmax | `blocks.{L}.attn.hook_attention_weights` |
| `blocks.{L}.attn.hook_hidden_states` | Attention component output used for caching | `blocks.{L}.attn.hook_result` |
| `blocks.{L}.mlp.hook_out` | MLP output | `blocks.{L}.hook_mlp_out` |
| `blocks.{L}.hook_out` | Residual stream leaving block L | `blocks.{L}.hook_resid_post` |
| `unembed.hook_out` | Vocabulary logits | none |

The alias layer explains why older papers and tutorials use names such as `hook_resid_pre` while current documentation recommends `hook_in`. Both may appear in real code, so the useful mental model is the computation being named: a block input, an attention pattern, or an MLP output.

Architecture details still matter. A grouped-query attention model, a mixture-of-experts model, and Mamba do not contain identical tensors. The [model-structure reference](https://transformerlensorg.github.io/TransformerLens/content/model_structure.html) lists canonical hooks and expected shapes, and an experiment should check the adapter for the exact architecture it uses.

## Activation Caches Support Observation

`run_with_cache` records intermediate activations while performing an ordinary forward pass:

```python
from transformer_lens.model_bridge import TransformerBridge

model = TransformerBridge.boot_transformers("gpt2", device="cpu")
logits, cache = model.run_with_cache("The Eiffel Tower is in")

residual = cache["blocks.8.hook_in"]
attention = cache["blocks.5.attn.hook_pattern"]
```

The **activation cache** lets us run the model once, then compare layers, positions, or heads without repeating inference. It also supplies replacement values for [activation patching](/topics/activation-patching/). A clean run can be cached, then selected clean activations can be inserted into a corrupted run.

Caching every HookPoint can consume much more memory than the weights alone, especially for long sequences. Selective caching is therefore part of experimental design rather than a minor optimization: record the components needed for the hypothesis, and verify tensor shapes before comparing or patching them.

<details class="pause-and-think">
<summary>Pause and think: Cache or hook?</summary>

You want to find heads that attend to a repeated token, then test whether one head causes the repeated-token prediction. Which interface belongs to each step?

Use a cache to inspect attention patterns from an unchanged run. Once a candidate head or residual location is identified, use a forward hook to replace or ablate its activation and measure the output change. The cache supports observation; the hook performs the intervention.

</details>

## Hooks Support Intervention

`run_with_hooks` calls a function at a named point while the model is computing. The function receives an activation and returns the value that downstream components will see. This example removes one MLP update:

```python
def zero_mlp_output(activation, hook):
    return activation * 0

ablated_logits = model.run_with_hooks(
    "The Eiffel Tower is in",
    fwd_hooks=[("blocks.5.mlp.hook_out", zero_mlp_output)],
)
```

Replacing the zero vector with a cached activation from another prompt produces an activation-patching experiment. More elaborate hook functions can clamp a feature, edit selected positions, or record derived quantities without retaining the full activation.

The hook changes the model's computation, so a difference in logits supports a causal claim about that intervention. It does not show that the component has one stable role across prompts, or that zero is a neutral baseline. The controls in the [activation patching article](/topics/activation-patching/) still apply.

## Native Weights Change the Tradeoff

The original `HookedTransformer` made weights such as query, key, value, and output matrices easy to access in a standardized layout. It also folded layer normalization and centered some weights by default, changing the coordinate system from the raw checkpoint in ways that were convenient for analyses such as [direct logit attribution](/topics/direct-logit-attribution/).

TransformerBridge preserves the native Hugging Face weights on load. This removes one source of forward-pass divergence and makes it easier to compare an intervention with the model used elsewhere. Analyses that depend on the legacy folded or centered representation must now enable compatibility processing explicitly and report it. The transformed and raw weights can support equivalent functions while giving different intermediate coordinates, so silently mixing them can invalidate a replication.

This design also changes the relationship between TransformerLens and other tools. The bridge no longer requires a separate reimplementation for every checkpoint, but it still requires an adapter that understands the architecture well enough to expose meaningful generalized components.

## Model Coverage Is Broad but Uneven

TransformerBridge covers thousands of Hugging Face model IDs across more than 50 architecture families, including transformer, multimodal, and state-space families. The number changes quickly and should not be copied into an experiment as a guarantee. The live [supported-model tables](https://transformerlensorg.github.io/TransformerLens/content/model_tables.html) distinguish architecture support from checkpoints that have been verified end to end.

Three checks matter before committing to a model:

- The architecture has an adapter for the internal component the experiment needs.
- The relevant hook exists and has the expected shape and semantics.
- The bridged run agrees with the uninstrumented Hugging Face model within the tolerance appropriate for the device and precision.

A model being loadable is weaker than every interpretability operation being meaningful. Fused projections, mixture-of-experts routing, recurrent state, and multimodal branches each require hooks that correspond to their actual computation.

## A Minimal Causal Workflow

A clean and corrupted prompt can share the same TransformerBridge instance. The sequence lengths and patched tensor shapes must match:

```python
clean_prompt = "When Mary and John met, John gave a book to"
corrupted_prompt = "When Mary and John met, Mary gave a book to"

clean_logits, clean_cache = model.run_with_cache(clean_prompt)

def restore_block_input(activation, hook):
    return clean_cache["blocks.6.hook_in"]

patched_logits = model.run_with_hooks(
    corrupted_prompt,
    fwd_hooks=[("blocks.6.hook_in", restore_block_input)],
)
```

The useful result is not `patched_logits` by itself. We need a metric such as the logit difference between the two candidate names, an unpatched corrupted baseline, and a sweep over locations or controls that could distinguish the proposed mechanism from a generic restoration effect.

<details class="pause-and-think">
<summary>Pause and think: What did the patch establish?</summary>

Restoring the clean residual stream at block 6 recovers the correct name. Does that prove block 6 computed the name?

No. The restored state contains everything represented at that position and layer, including information computed earlier. The result shows that replacing this state is sufficient to restore behavior in this prompt pair. Finer patches, alternative corruptions, and path-specific tests are needed to locate the computation that produced the useful information.

</details>

## Looking Ahead

TransformerLens provides a common language for model internals: canonical components, named hooks, cached activations, and interventions. Version 3 extends that language over native Hugging Face models, while legacy aliases keep much of the field's existing code readable during migration.

The [next article](/topics/nnsight-and-nnterp/) covers nnsight and nnterp. Their overlap with TransformerLens has grown now that both can work with native Hugging Face models, but their emphases differ: TransformerLens standardizes interpretability components and familiar MI workflows, while nnsight builds a general intervention trace and supports remote execution through the National Deep Inference Fabric.
