---
title: "Transcoders: Interpretable MLP Replacements"
seoTitle: "Transcoders Explained: Interpretable MLP Replacements"
description: "How a transcoder replaces an opaque transformer MLP with sparse interpretable features, exposing input-to-output computations for circuit tracing."
order: 6
prerequisites:
  - title: "SAE Variants, Evaluation, and Limitations"
    url: "/topics/sae-variants-and-evaluation/"
  - title: "MLPs in Transformers"
    url: "/topics/mlps-in-transformers/"

glossary:
  - term: "Transcoder"
    definition: "A sparse autoencoder variant applied to MLP layers that maps from MLP inputs to MLP outputs, learning interpretable features that describe what transformations the MLP performs rather than what it represents."

exitCriteria:
  - task: "An SAE maps $\\mathbf{h} \\to \\mathbf{h}$; a transcoder maps $\\mathbf{x}_{\\text{in}} \\to \\mathbf{y}_{\\text{out}}$ across an MLP. Explain why only the second lets you trace a causal path through the MLP."
    answer: |
      Tracing a path means following *this input feature produced that output feature*. That is a claim about a map, and an SAE never models one.

      An SAE at the MLP output tells you which features are present *after* the computation. Put another SAE at the input and you have two independent vocabularies with nothing connecting them: latent 4,102 is active before and latent 891 is active after, and nothing in either decomposition says the first caused the second. The MLP remains a gap in the graph, and it is a large gap — MLPs hold roughly two-thirds of the non-embedding parameters.

      A transcoder is trained so that its sparse code, produced from the MLP's *input*, decodes to the MLP's *output*. The same latents therefore appear on both sides of the transformation, and "which input features produce this output direction" is answerable from the encoder and decoder weights.

      The caveat travels with it: the transcoder is an approximation, so a path traced through it is a claim about the replacement. Confirming it requires an intervention on the original model.
  - task: "Transcoder circuits factorize into an input-dependent and an input-invariant term. Say what each is, and what kind of analysis the input-invariant half makes possible."
    answer: |
      **Input-dependent:** which latents fire on this particular input. This is the encoder's job — $\text{ReLU}(\mathbf{x}_{\text{in}} W_{\text{enc}} + \mathbf{b}_{\text{enc}})$ — and it changes with every token.

      **Input-invariant:** how an active latent maps to an output direction. This is the decoder: each latent has one fixed row of $W_{\text{dec}}$, the same on every input.

      **What the invariant half enables: weight-based analysis.** Because each latent's output direction is fixed, you can ask what a latent *would* contribute without running the model — compose its decoder direction with a downstream component's read weights and get a number that holds across all inputs. That is the same move as the end-to-end OV matrix for an attention head, now available through an MLP.

      This matters because input-specific evidence is expensive and narrow. A weight-level statement about a latent's downstream reach covers the whole distribution at once and can be computed for every latent, so it serves as a screen for where to spend input-specific tests.

      The factorization is exact for the transcoder and approximate for the MLP, so both halves inherit the reconstruction gap.
  - task: "The IOI circuit had 26 attention heads as nodes; a feature-level circuit can have thousands. State what the higher resolution buys and what it costs."
    answer: |
      **Buys:**

      - **A meaningful hypothesis per node.** A head is polysemantic and participates in many unrelated behaviors, so "head 9.9" names a component, not a function. A feature is at least a candidate for a label that holds across inputs.
      - **MLPs stop being gaps.** Head-level circuits are attention-only by construction; transcoder features let paths run through the MLPs.
      - **Sub-computations become visible.** The greater-than circuit turned out more modular than head-level analysis had shown — structure that existed but had no nodes to be expressed in.

      **Costs:**

      - **Legibility.** A 26-node diagram can be read; a 2,000-node graph cannot, so understanding now depends on pruning, automated summarization, and thresholds — each a place for a decision to hide.
      - **Completeness is harder to check.** With more nodes and edges, verifying that no important path was dropped becomes a much larger problem, and the pruning threshold determines the answer.
      - **The nodes are now learned.** A head exists in the model; a feature exists in a dictionary you trained, with non-uniqueness and reconstruction error attached.

      The tradeoff is resolution against auditability, and it is not obviously worth taking for every question.
  - task: "Skip transcoders add an affine skip connection and achieve lower reconstruction loss without a measured interpretability reduction. Explain why this is not automatically an argument for always using them."
    answer: |
      The skip connection is a path from input to output that bypasses the sparse code entirely. Whatever it carries is reconstructed *without being decomposed into features* — so lower reconstruction loss may come partly from moving computation out of the interpretable part and into an uninterpreted affine term.

      That is not necessarily bad. If the affine component is a genuinely linear part of the MLP's function, factoring it out is honest, and the remaining sparse code then describes only the nonlinear residual — arguably cleaner. But it changes what the transcoder's features *are*, and a circuit traced through one has a term that no feature accounts for.

      "No measured interpretability reduction" is doing less work than it appears. The measurements score whether individual latents are labelable, which is a property of the latents that survive. They do not ask how much of the MLP's function now runs through the skip, and a decomposition can score well on its remaining pieces precisely because the hard part was routed around them.

      The question worth asking is what fraction of the output the skip path carries, and whether the circuit's conclusions depend on it. Same structure as the reconstruction-error nodes in attribution graphs: what matters is that the unexplained part is visible.

furtherReading:
  - title: "Dunefsky, Chlenski & Nanda, *Transcoders Find Interpretable LLM Feature Circuits*"
    url: "https://arxiv.org/abs/2406.11944"
    note: "The full method with the circuit analyses that motivate it."
  - title: "Ameisen et al., *Circuit Tracing: Revealing Computational Graphs in Language Models*"
    url: "https://transformer-circuits.pub/2025/attribution-graphs/methods.html"
    note: "Cross-layer transcoders, which generalize the single-MLP version described here and are what current attribution graphs are built on."
  - title: "Marks et al., *Sparse Feature Circuits*"
    url: "https://arxiv.org/abs/2403.19647"
    note: "The competing approach using SAEs plus linear approximations, and a fair basis for judging what transcoders add."
---

## The MLP Problem

Every transformer layer has two main components: attention heads that move information between positions, and MLPs that apply nonlinear transformations at each position. The QK and OV decomposition gives us useful tools for analyzing how attention heads select and move information. MLPs are harder to decompose because their transformations are dense and nonlinear.

[Sparse autoencoders](/topics/sparse-autoencoders/) offered a partial solution. By training an SAE on a layer's activations, we can decompose those activations into sparse, interpretable features. But SAEs reconstruct the *same* activation they receive as input. They reveal what features are *present* at a given layer, not how information *transforms* as it passes through the MLP. An SAE placed at the MLP output tells us what features exist after the MLP computation. It does not tell us which input features produced which output features.{% sidenote "The distinction is subtle but important. An SAE asks: 'What features are encoded in this activation vector?' A transcoder asks: 'What function does this MLP compute, expressed in terms of sparse features?' The first is a question about representation; the second is a question about computation." %}

For circuit analysis, we need to trace causal paths *through* MLP layers, not just observe what comes out the other side. This is what transcoders provide.

## What Is a Transcoder?

> **Transcoder:** A transcoder is a modified sparse autoencoder that approximates MLP behavior. Instead of encoding and reconstructing the same activation, a transcoder takes the MLP input $\mathbf{x}_{\text{in}}$ and produces an approximation of the MLP output $\mathbf{y}_{\text{out}}$:
>
> $$\mathbf{y}_{\text{out}} \approx \text{ReLU}(\mathbf{x}_{\text{in}} W_{\text{enc}} + \mathbf{b}_{\text{enc}}) W_{\text{dec}} + \mathbf{b}_{\text{dec}}$$
>
> The transcoder *replaces* the dense MLP with a wider, sparsely-activating layer.

The architecture has the same broad parts as an SAE: an encoder, a sparse bottleneck, and a decoder. The input and output differ, however. An SAE maps $\mathbf{h} \to \mathbf{h}$. A transcoder maps $\mathbf{x}_{\text{in}} \to \mathbf{y}_{\text{out}}$, where $\mathbf{x}_{\text{in}}$ enters the MLP and $\mathbf{y}_{\text{out}}$ is the output the MLP would produce. The transcoder approximates the MLP's function rather than reconstructing one representation.

![Diagram comparing SAE and transcoder architectures. The SAE takes an activation as input and reconstructs the same activation. The transcoder takes the MLP input and produces an approximation of the MLP output.](/topics/transcoders/images/transcoder_vs_sae.png "Figure 1: SAE vs. transcoder architecture. SAEs reconstruct the same activation (representation). Transcoders map MLP inputs to MLP outputs (computation). This difference is what enables circuit tracing through MLPs.")

## From Sparse Replacement to Circuit Node

Sparse autoencoders (SAEs) decompose representations, whereas transcoders decompose computations:

**SAEs** decompose what a layer *represents*. Given activation $\mathbf{h}$, an SAE finds sparse features $\mathbf{f}$ such that $\mathbf{h} \approx \mathbf{f} W_{\text{dec}}$. This is useful for understanding individual layers but does not reveal how features at one layer produce features at the next.

**Transcoders** decompose what a layer *computes*. Given MLP input $\mathbf{x}_{\text{in}}$, a transcoder finds sparse features that produce the MLP output. Because the transcoder's features map inputs to outputs, we can trace how upstream features contribute to downstream features through the MLP.{% sidenote "In the residual stream picture, attention heads move information between positions while MLPs transform information at each position. SAEs decompose the residual stream at a point. Transcoders decompose the transformation that happens between points. Both are needed for complete circuit analysis." %}

The input-output map lets us trace attributed paths *through* MLP layers rather than treating each MLP as a black box. The claim remains about the transcoder replacement until interventions confirm that the corresponding pathway matters in the original model.

## Clean Factorization

Dunefsky et al. (2024) showed that transcoder circuits factorize cleanly into two terms {% cite "dunefsky2024transcoders" %}:

- An **input-dependent** term: which transcoder features activate on this particular input
- An **input-invariant** term: how feature activations map to outputs through the decoder weights

This factorization supports weight-based analysis through an MLP replacement. The decoder gives each transcoder latent a fixed output direction, while the encoder determines which latents fire on an input. The account remains approximate because the transcoder does not reproduce the original MLP perfectly and its learned latents may not be uniquely determined.

Dunefsky et al. applied transcoders to GPT-2 Small's *greater-than circuit*, the circuit that processes prompts like "The war started in 1742 and ended in 17\_\_". Transcoders revealed sub-computations within the circuit that were invisible at the head level, showing that the circuit was more modular than previously understood.

<details class="pause-and-think">
<summary>Pause and think: SAEs vs. transcoders</summary>

SAEs reconstruct the same activation they receive. Transcoders map MLP inputs to MLP outputs. Why does this difference matter for tracing how information flows through a network?

Think about what it means to follow a causal chain from input to output. Attention exposes an explicit routing pattern and a linear value-to-output map once that pattern is fixed; an MLP applies a dense nonlinear map at one position. An SAE at the MLP output describes candidate features after the transformation but does not model the input-output map. A transcoder supplies a sparse approximation of that map, letting an attribution method propose paths through the replacement rather than skipping the MLP entirely.

</details>

## Transcoders vs. SAEs: A Direct Comparison

Paulo et al. (2025) compared transcoders and SAEs trained on the same model and data:

- On the study's automated and human-scored evaluations, transcoder features scored as more interpretable than the matched SAE features.
- **Skip transcoders**, which add an affine skip connection, achieved lower reconstruction loss without a measured interpretability reduction in this comparison.
- Transcoders also improved several tested SAEBench tasks, including feature-absorption and sparse-probing evaluations.

The comparison gives transcoders a structural advantage for questions about what an MLP maps from input to output. SAEs remain suited to describing features present at one activation site, while either method can inherit dictionary non-uniqueness and reconstruction error.{% sidenote "A benchmark win does not make transcoders a universal replacement for SAEs. The choice depends on whether the object of interest is a representation at one site or a transformation between two sites." %}

## From Transcoders to Circuit Tracing

Transcoders address a specific problem: exposing an approximation of an MLP's computation. Combined with attention analysis, they let researchers trace feature-level paths through both kinds of transformer sublayer.

Marks et al. {% cite "marks2024sparse" %} demonstrated that SAE features can serve as the nodes in causal circuit graphs, *sparse feature circuits*. This was an important step, but the approach still relied on per-layer SAEs and computationally expensive patching.

Lindsey et al. {% cite "lindsey2025circuittracing" %} build *attribution graphs* by replacing MLPs with cross-layer transcoders and tracing selected effects backward through the feature network with Jacobian-based attribution. The resulting graph is a sparse, input-specific approximation, not a complete map of every computation used by the original model.

The methods form a progression in resolution: transcoders approximate an MLP with sparse latents, sparse feature circuits use learned features as graph nodes, and attribution graphs combine replacement models with scalable edge attribution. [Circuit Tracing and Attribution Graphs](/topics/circuit-tracing/) covers the resulting evidence and its limits.

<details class="pause-and-think">
<summary>Pause and think: What changes with feature-level circuits?</summary>

In the IOI circuit analysis, the circuit had 26 attention heads as nodes. With transcoders enabling feature-level analysis, circuits can have thousands of feature nodes. What do we gain from this higher resolution? What do we lose?

We gain a more granular hypothesis for each node, and we can trace through MLPs instead of treating them as gaps. We lose simplicity: a 26-node circuit diagram can be inspected directly, while a 2,000-node feature graph requires pruning, automated tools, and checks that important paths were not omitted.

</details>

## Looking Ahead

Sparse autoencoders describe what is present at one activation site; transcoders approximate the map from one site to another. That input-output factorization makes multilayer perceptrons easier to include in a circuit, but the circuit describes the replacement only as faithfully as the transcoder reconstructs the original computation.

[Circuit Tracing and Attribution Graphs](/topics/circuit-tracing/) builds on cross-layer transcoders to trace input-specific effects through thousands of features, then examines how approximation error, frozen attention, and local attribution limit the resulting graphs.
