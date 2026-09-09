---
title: "Crosscoders"
description: "Learning one sparse feature dictionary across several layers or models, so we can track representations over depth and compare model variants."
order: 7
prerequisites:
  - title: "SAE Variants, Evaluation, and Limitations"
    url: "/topics/sae-variants-and-evaluation/"

glossary:
  - term: "Crosscoder"
    definition: "A variant of sparse autoencoders trained jointly on activations from multiple models (or the same model at different training stages), learning a shared feature dictionary that enables direct comparison of representations across models."

exitCriteria:
  - task: "A crosscoder concatenates activations from two sources and encodes them with one shared encoder. Explain why separate encoders with a shared bottleneck would not achieve the same thing."
    answer: |
      With separate encoders, each source's activations get their own map into the latent space. Nothing then forces a concept present in both sources onto the *same* latent: encoder A can route "proper noun" to latent 412 and encoder B to latent 8,900, and reconstruction is unaffected. The shared bottleneck constrains capacity but not correspondence, so you can end up with two independent dictionaries wearing one label — which is exactly the situation crosscoders exist to escape.

      Under concatenation there is one encoder reading $[\mathbf{x}_{\text{base}};\, \mathbf{x}_{\text{chat}}]$, so each latent is a single direction in the joint space. A latent that fires must explain variation in *both* halves at once, and the sparsity penalty makes representing a shared concept twice strictly more expensive than representing it once. The cheapest solution is one latent with two decoder directions.

      That is what makes the shared/exclusive distinction meaningful: a latent whose decoder norm is substantial in one half and near zero in the other is source-specific, and this is only interpretable because both halves were competing for the same latent in the first place.
  - task: "The crosscoder loss weights the reconstruction terms for both sources equally. Name a conclusion that is sensitive to this choice and say how you would check it."
    answer: |
      **The sensitive conclusion is the shared/exclusive classification itself** — the primary output of model diffing.

      The weighting sets whose reconstruction the dictionary is optimized to serve. If one source has larger-norm activations, more variance, or simply more of the training data, equal weighting still favours it in practice, because reducing squared error there buys more loss reduction. Latents drift toward explaining that source, and structure unique to the other appears as unexplained residual rather than as an exclusive feature. The finding "fine-tuning added these features and removed those" can then partly reflect the loss weighting.

      **How to check:** re-train with the weights swapped and with activations normalized per source, and see which latents keep their classification. Report the classification's stability rather than one run's assignment. The latents that flip were never evidence.

      This belongs to a family with dictionary size and sparsity level: choices the analyst makes that determine the answer, and that are usually reported as setup rather than as part of the result. The general discipline is to vary each one and report which conclusions survive.
  - task: "A feature like \"this token is a proper noun\" may be active from layer 3 to layer 15. Explain how representing it once rather than per-layer simplifies a circuit, and what the simplification is discarding."
    answer: |
      **The simplification:** with per-layer SAEs, that one property becomes thirteen latents joined by strong edges, and the circuit graph fills with a chain that represents nothing but information persisting. A reader must recognize the chain as one thing; every path through it is inflated in length; and the visible structure is dominated by transport rather than computation. A crosscoder gives one node whose edges go to the places the feature is actually *consumed*.

      This is the same problem cross-layer transcoders address for MLP features, from the representation side.

      **What is discarded:** the possibility that the feature is *not* the same thing at every layer. Collapsing to one node asserts identity across depth, and that assertion could be wrong — the direction may drift, the property may be re-derived rather than carried, or a downstream component may read only a rotated version of it. If "proper noun" at layer 3 is computed from tokens and "proper noun" at layer 12 is recomputed from richer context, they are two computations, and the crosscoder has hidden one.

      The collapse is a hypothesis about identity, and it is worth checking that the shared latent's per-layer decoder directions are actually aligned rather than merely co-active.
  - task: "A crosscoder trained on a base model and its chat-tuned version labels a latent \"chat-exclusive.\" List three explanations besides \"fine-tuning created this feature.\""
    answer: |
      1. **The feature exists in the base model but is rarely active on the training sample.** Exclusivity is measured over whatever activations were collected. If the crosscoder was trained mostly on chat-formatted text, a base-model feature that only fires in other contexts contributes little to the base half and reads as chat-exclusive. This is the dead-latent problem wearing a different hat.
      2. **The feature exists in both but the fine-tune moved its direction.** The crosscoder assigns one latent per dictionary element with a decoder direction per source. If fine-tuning rotated the representation, the base half's direction no longer aligns and the latent looks one-sided — while the concept is present in both, just relocated.
      3. **It is an artifact of the dictionary's capacity allocation.** With reconstruction error, non-uniqueness, and a loss weighting that favours one source, some structure will be represented asymmetrically for reasons that are properties of the SAE rather than of either model. A different seed can reassign it.

      The check that discriminates them: does the base model exhibit the *behavior* associated with the feature? A feature genuinely absent from the base model should correspond to a capability the base model lacks.

furtherReading:
  - title: "Lindsey, Templeton et al., *Sparse Crosscoders for Cross-Layer Features and Model Diffing*"
    url: "https://transformer-circuits.pub/2024/crosscoders/index.html"
    note: "The originating write-up. This article has no citations at all, and this is the source for everything in it."
  - title: "Minder et al., *Robustly Identifying Concepts Introduced During Chat Fine-Tuning Using Crosscoders*"
    url: "https://arxiv.org/abs/2504.02922"
    note: "The L1 sparsity artifact, latent scaling as a diagnostic, and the BatchTopK fix. Essential before trusting any crosscoder diffing result."
  - title: "Bussmann et al., *BatchTopK Sparse Autoencoders*"
    url: "https://arxiv.org/abs/2412.06410"
    note: "The sparsity mechanism the corrected crosscoders rely on."
  - title: "Gorton, *The Missing Curve Detectors of InceptionV1*"
    url: "https://arxiv.org/abs/2407.08688"
    note: "Cross-model feature comparison done carefully in vision, useful for calibrating what a shared feature claim requires."
---

## Beyond Single-Layer SAEs

Standard [sparse autoencoders](/topics/sparse-autoencoders/) operate on a single activation vector from one layer of one model. This is a powerful tool for decomposing individual layers, but it misses two things: features that persist *across* layers, and features that differ *across* models.

Consider a feature like "this token is a proper noun." With per-layer SAEs, this feature might be rediscovered independently at layers 3, 5, 8, and 12. Each SAE finds it anew, creating redundant representations and obscuring the fact that it is a single persistent feature. Cross-layer superposition (the same concept spread across layers) is invisible to per-layer decomposition.{% sidenote "The [refusal direction](/topics/refusal-direction/) finding hints at this problem from a different angle. A single direction mediates refusal across layers. Per-layer SAEs might capture this direction at each layer but would not naturally connect those per-layer representations into a unified picture." %}

Similarly, when comparing a base model and its fine-tuned variant, separate SAEs trained on each model produce incompatible dictionaries. We cannot directly ask "which features are shared?" because the two SAEs learned different decompositions.

Crosscoders solve both problems by training a single dictionary across multiple sources simultaneously.

## From SAEs to Crosscoders

In [sparse autoencoders](/topics/sparse-autoencoders/), the encoder reads from a single activation vector $\mathbf{x}^{(\ell)}$ at one layer of one model, and the decoder reconstructs that same vector through a sparse bottleneck.

> **Crosscoder:** A crosscoder is a sparse autoencoder variant that reads from (and writes to) concatenated activations from multiple layers or multiple models. It learns a shared dictionary of features across all sources simultaneously. Where a standard SAE operates on a single activation vector $\mathbf{x}^{(\ell)}$, a crosscoder operates on the concatenation of activations from multiple sources:
>
> $$\mathbf{x}_{\text{concat}} = [\mathbf{x}_{\text{base}};\; \mathbf{x}_{\text{chat}}]$$

The crosscoder learns a single dictionary. For each dictionary element, it learns a pair of latent directions, one per model (or one per layer, in the cross-layer case). This forces the crosscoder to find common structure across sources while also representing source-specific features.

![Diagram showing a crosscoder architecture with two models' activations concatenated as input, a shared sparse dictionary in the middle, and outputs that reconstruct both models' activations. Features are labeled as shared, base-exclusive, or chat-exclusive.](/topics/crosscoders/images/crosscoder_model_diffing.png "Figure 1: Crosscoder architecture. Activations from multiple sources (here, two models) are concatenated and encoded through a shared sparse dictionary. Each feature is classified based on its activation pattern across sources.")

### Three Applications

Crosscoders have three main uses:

1. **Cross-layer features:** Track features that persist across layers in the residual stream, resolving cross-layer superposition. A feature like "this token is a proper noun" might be active from layer 3 through layer 15; a crosscoder represents it once rather than rediscovering it at each layer.

2. **Circuit simplification:** By identifying persistent features, crosscoders remove redundant "identity" connections from circuit analysis. If a feature simply passes through several layers unchanged, the crosscoder collapses those connections into a single node.

3. **Model diffing:** Train a crosscoder on activations from two models to discover what they share and where they differ. This is the most safety-relevant application.

## The Training Objective

The crosscoder training objective mirrors standard SAEs, applied to the concatenated input:

$$\mathcal{L} = \|\mathbf{x}_{\text{concat}} - \hat{\mathbf{x}}_{\text{concat}}\|^2 + \lambda \sum_j |f_j|$$

The reconstruction term penalizes information lost from each source, while the sparsity term encourages only a few latents to be active on each input. Sharing latent activations gives the crosscoder an incentive to align common structure across sources, although reconstruction error and dictionary non-uniqueness prevent that alignment from being guaranteed.{% sidenote "The loss shown here weights the reconstruction terms equally. Other weightings could prioritize one source, so conclusions about what is shared should be checked for sensitivity to this design choice as well as to dictionary size and sparsity." %}

<details class="pause-and-think">
<summary>Pause and think: Why concatenation?</summary>

Why does the crosscoder concatenate activations from multiple sources rather than, say, training separate encoders with a shared bottleneck? What property of the concatenation approach forces the crosscoder to find shared structure?

The concatenation means a single encoder must find features that explain variation across *all* sources simultaneously. If a concept exists in both the base and chat model, the most efficient representation is a single shared feature. Separate encoders could find independent features for each source, even for shared concepts, which would defeat the purpose. The shared encoder under concatenation is what creates the pressure to discover genuinely shared vs. source-specific features.

</details>

## Crosscoders in the SAE Family

Crosscoders fit naturally into the progression of SAE architectures:

- **Standard SAEs** decompose a single layer's activations into sparse features.
- **[Transcoders](/topics/transcoders/)** decompose MLP *computations* (input → output) rather than representations, enabling circuit tracing through MLPs.
- **Crosscoders** decompose *joint* activations from multiple sources, enabling cross-source comparison.

Each variant extends the core idea of sparse dictionary learning to answer a different question. SAEs ask "what features are present here?" Transcoders ask "what function is computed here?" Crosscoders ask "what is shared and what differs across these sources?"

The model diffing application of crosscoders, comparing base and fine-tuned models to understand what safety training changes, is covered in detail in [Feature-Level Model Diffing](/topics/feature-level-model-diffing/).

## From Sparse Dictionaries to Feature Geometry

Crosscoders extend the sparse-feature picture across layers and models, but they retain its basic unit: a one-dimensional dictionary element. The next block asks when that unit is too small. [Feature Geometry](/topics/feature-geometry/) starts with concepts that occupy subspaces, circles, and polytopes, then develops methods for recovering and intervening on the manifolds that groups of sparse features may collectively describe.
