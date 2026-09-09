---
title: "Multimodal Mechanistic Interpretability"
description: "How mechanistic interpretability extends beyond text to vision-language and diffusion models, including promising transfers and modality-specific limits."
order: 9
prerequisites:
  - title: "Universality Across Models"
    url: "/topics/universality/"

glossary:
  - term: "Multimodal Interpretability"
    definition: "The application of mechanistic interpretability techniques to models that process multiple input modalities (such as vision and language), investigating how representations are shared or transformed across modalities."

exitCriteria:
  - task: "CLIP's shared embedding space lets you name a visual SAE feature by projecting its direction into text space. State the assumption this relies on and three ways it can fail."
    answer: |
      **The assumption:** proximity in the joint embedding space reflects the same concept across modalities — that if a visual direction is close to the text embedding of "golden retriever," the visual feature *is* golden retriever.

      **Three failures:**

      1. **No clean textual description exists.** Many visual features are textures, spatial arrangements, or statistical regularities that no phrase names. The projection still returns a nearest text embedding, so you get a confident label for something the vocabulary cannot express.
      2. **The modalities carry different information.** CLIP's alignment is trained on image–caption pairs, and captions systematically omit what people do not mention: lighting, framing, image quality, watermarks. A feature tracking an unmentioned property is projected onto whatever text happens to correlate with it in the training data.
      3. **The direction exploits a correlate.** Proximity can come from co-occurrence rather than identity — a feature detecting hospital-photo styling lands near "illness" because those captions co-occur, not because the feature is about illness.

      The correct status is **candidate label**, to be tested against highly activating images *and* against images the label predicts should activate it but which may not. It is a cheap hypothesis generator, and its cheapness is exactly why it should not be treated as a result.
  - task: "Diffusion models add a dimension language models lack. Name it, describe the coarse-to-fine pattern, and explain why it means a logit-lens analogue must be indexed differently."
    answer: |
      **Time.** In a language model, information flows through *layers* — a single spatial axis inside the network. A diffusion model also flows through *denoising steps*, so a feature exists at a (layer, timestep) pair rather than at a layer.

      The commonly reported coarse-to-fine progression: early timesteps carry layout, colour palette, and scene composition; middle timesteps carry object boundaries and spatial relationships; late timesteps carry fine texture and detail. A feature is not fixed across this axis — "something red in the upper left" at an early step becomes "a specific red flower with detailed petals" later.

      **Why the lens must be re-indexed:** the logit lens answers "what would this state predict if we read it out now," producing a trajectory over layers. In a diffusion model, the same question has to be asked over a *grid*, and the two axes are not interchangeable — the same layer at two timesteps is doing different work. A diffusion steering lens therefore tracks internal predictions across denoising steps, not only across depth.

      The broader point is that a method carries an implicit model of what the computation's independent variables are. Transplanting it across architectures requires re-deriving that, not just re-running the code.
  - task: "Separate three levels of evidence — an interpretable feature, a causal effect, an end-to-end mechanism — and say which multimodal MI has and which it lacks."
    answer: |
      **Level 1, interpretable candidate features.** SAEs on tested vision encoders including CLIP learn directions that correspond to recognizable objects, textures, and scene types. **Multimodal MI has this.**

      **Level 2, causal effects.** Clamping a visual feature changes measured outputs predictably; steering CLIP's encoder output changes downstream VLM behavior; ablating diffusion attention heads degrades specific image properties. **Multimodal MI has this**, for selected features, with steerability rates that depend on model, dictionary, intervention strength, and success metric.

      **Level 3, an end-to-end mechanism.** A traced account of how identified components interact to produce a behavior, validated by interventions on the edges as well as the nodes — what the IOI circuit is for language. **Multimodal MI lacks this.** VLM studies localize where integration effects appear; diffusion work identifies functional specialization among heads. Neither yields a wiring diagram.

      The reason to keep them separate is that they answer different questions and the field's summaries tend to blur them: a labelled feature plus a successful steer reads like a mechanism and is not one. "We can name it and we can move it" is compatible with having no idea how it participates in the computation.
  - task: "Steerable CLIP features can defend against typographic attacks — adversarial text written into an image that misleads the model about its content. Explain why this is a stronger result than a feature label, and what it does not show."
    answer: |
      **Why stronger:** it is a causal test with an *external* success criterion. A feature label is scored by whether a human finds the top-activating images coherent, which is a judgment about the analyst. Defending against typographic attacks is scored by whether the model's classification recovers on adversarially constructed inputs — an outcome fixed independently of the interpretation and not gameable by relabelling. It also demonstrates a specific prediction: if this feature carries the text-in-image signal that the attack exploits, suppressing it should restore the visual judgment. That prediction could have failed.

      **What it does not show:** that the feature *is* "text in image" as a semantic matter. It shows there is a direction whose suppression restores performance on this attack family. The direction may be broader (any high-contrast overlay), narrower (this rendering style), or entangled with something correlated in the SAE's training data. Nor does it show completeness — a different attack construction may route around it entirely, which is the standard failure mode for defenses validated on one attack.

      The honest claim is a causally effective handle on a specific failure mode, which is genuinely useful and is not a semantic account of the feature.

furtherReading:
  - title: "Gandelsman, Efros & Steinhardt, *Interpreting CLIP's Image Representation via Text-Based Decomposition*"
    url: "https://arxiv.org/abs/2310.05916"
    note: "Head-level decomposition in CLIP with text labels, the clearest transfer of transformer-circuit methods to vision."
  - title: "Palit et al., *Towards Vision-Language Mechanistic Interpretability* and Basu et al., *Understanding Information Storage in Vision-Language Models*"
    url: "https://arxiv.org/abs/2406.04236"
    note: "Causal tracing carried into VLMs, including where the text-model intuitions fail."
  - title: "Olah et al., *Multimodal Neurons in Artificial Neural Networks*"
    url: "https://distill.pub/2021/multimodal-neurons/"
    note: "The original multimodal-neuron result, and still the most vivid demonstration of modality-independent features."
  - title: "Toker et al., *Diffusion Lens*"
    url: "https://arxiv.org/abs/2403.05846"
    note: "Interpretability inside the diffusion text encoder, which is the least-covered part of this article."
---

## Beyond Text

Everything we have studied so far, [SAEs](/topics/sparse-autoencoders/), [transcoders](/topics/transcoders/), [activation patching](/topics/activation-patching/), [attribution graphs](/topics/circuit-tracing/), [crosscoders](/topics/crosscoders/), was developed for and applied to language models. But AI systems increasingly process images, video, audio, and combinations of modalities. Does mechanistic interpretability transfer beyond text?

Probing, sparse decomposition, patching, and steering have all been adapted beyond text {% cite "lin2025multimodal" %}. Shared image–text spaces can also suggest labels for visual features. Those labels remain hypotheses, however, and multimodal models introduce interfaces and time-dependent computations that language-only methods were not designed to handle.{% sidenote "Compared with text-model interpretability, multimodal work has fewer widely replicated circuit case studies and less settled evaluation practice. It is safer to describe that qualitative gap than to assign it a precise number of years." %}

Three model families expose different parts of this transfer problem: contrastive vision-language models such as CLIP, generative vision-language models (VLMs), and text-to-image diffusion models.

<figure>
  <img src="images/multimodal-mi-taxonomy.png" alt="Taxonomy diagram of multimodal mechanistic interpretability. Left column shows methods split into two groups: methods adapted from LLM interpretability (linear probing, logit lens, causal tracing, representation decomposition, general task vectors, sparse autoencoders, neuron-level descriptions) and multimodal-specific methods (text-explanations of internal embeddings, network dissection, cross-attention based interpretation, training data attribution, feature visualization). Center column shows three model architectures: non-generative vision-language models with contrastive learning, generative vision-language models with an adapter between image encoder and LLM, and text-to-image generative models with denoising. Right column lists applications including mitigating spurious correlations, zero-shot segmentation, in-context learning, model editing, detecting hallucinations, improving safety, improving compositionality, and controllable generation.">
  <figcaption>An overview of the multimodal MI landscape. Methods adapted from LLM interpretability (top left) and multimodal-specific methods (bottom left) are applied across three model families: contrastive vision-language models, generative VLMs, and text-to-image diffusion models. From Lin et al., <em>A Survey on Mechanistic Interpretability for Multi-Modal Foundation Models</em>. {%- cite "lin2025multimodal" -%}</figcaption>
</figure>

## CLIP: The Bridge Between Text and Vision

CLIP (Contrastive Language-Image Pretraining) trains a vision encoder and a text encoder to produce aligned representations in a shared embedding space. Images and text that describe the same concept end up near each other in this shared space.

Why CLIP is particularly exciting for MI:

- The **shared embedding space suggests candidate labels**. Projecting a visual SAE direction toward nearby text embeddings can produce a natural-language hypothesis about the feature. Human inspection and counterexamples are still needed.
- MI techniques from language, probing, SAEs, steering, transfer to the vision side with moderate adjustments. The architecture is a vision transformer, which shares the same basic structure as language transformers.
- CLIP is widely used as a backbone for larger multimodal systems, so understanding CLIP's internals has downstream implications.

### SAEs for CLIP's Vision Transformer

Recent work (2024-2025) applies SAEs to CLIP's vision encoder with encouraging results:

- SAE features in CLIP can correspond to recognizable visual patterns such as objects, textures, spatial arrangements, and scene types.
- Text-space projections can yield labels that agree with many highly activating images, making them a useful starting point for evaluation rather than an automatic interpretation.
- A subset of features can be **steered**: modifying them changes measured outputs in predictable ways on the tested data. This parallels [feature steering](/topics/scaling-monosemanticity/) in text models and supplies causal evidence for a feature's effect, though not a complete semantic account.{% sidenote "Reported steerability rates depend on the model, SAE, intervention strength, and success metric. A feature that fails an individual steering test may have a small effect, participate in a larger circuit, or be poorly captured by the learned dictionary." %}

### Steering in Vision

Feature steering extends naturally from text to vision:

- Clamping a visual SAE feature steers CLIP's representation, analogous to [Golden Gate Claude](/topics/scaling-monosemanticity/) in the text domain
- Steerable features can defend against **typographic attacks**, adversarial text overlaid on images that confuses the model about image content
- Visual steering has been used to steer downstream multimodal LLMs (e.g., LLaVA) by modifying CLIP's visual encoder output before it enters the language model

These studies suggest that the [representation-control](/topics/representation-control/) paradigm is not specific to language. Whether it works for a particular visual concept remains an empirical question about the model, layer, direction, and intervention.

<details class="pause-and-think">
<summary>Pause and think: CLIP's free labeling advantage</summary>

CLIP's shared embedding space lets you describe vision features in natural language by projecting SAE directions into text space. What assumptions does this rely on? When might this "free labeling" approach fail?

The method assumes that proximity in the joint embedding space reflects the same concept across text and images. It can fail when a visual pattern lacks a clean textual description, when the modalities contain different information, or when the projected direction exploits a correlate. The resulting phrase is a candidate label, not a guarantee.

</details>

## Generative Vision-Language Models

Vision-language models (VLMs) like LLaVA and GPT-4V process images through a vision encoder (typically CLIP) and feed the visual representations into a language model that generates text responses about the image.

MI for VLMs investigates several questions:

- **How visual information flows** from the vision encoder into language model layers. Do visual tokens behave like special text tokens, or does the model process them through separate pathways?
- **Whether causal tracing works** for localizing where visual objects are processed. Activation patching can identify which layers and positions are critical for answering questions about specific objects in an image.
- **How the model integrates visual and textual information.** Does integration happen through dedicated "bridge" layers, or is it distributed across the entire language model?

Studies of particular VLMs suggest that visual tokens can share pathways with text tokens inside the language model, while integration may be distributed across layers. The result is architecture-dependent: some systems use a small adapter, while others fuse modalities differently. Most available findings localize representations or effects rather than tracing an end-to-end circuit analogous to the [IOI circuit](/topics/ioi-circuit/).{% sidenote "When a separately trained vision encoder feeds an adapter into a language model, the adapter is an obvious interface to inspect. A simple adapter does not imply simple integration, however; later attention and MLP layers can transform and combine the imported visual information." %}

## Diffusion Model Interpretability

Text-to-image diffusion models (e.g., Stable Diffusion, DALL-E) generate images by iteratively denoising random noise over many timesteps. These models present a unique challenge and opportunity for MI.

### Functionally Distinct Attention Mechanisms

Circuit analysis of diffusion models reveals that different attention heads serve **functionally distinct roles**:

- **Edge detection heads** that identify boundaries and contours
- **Texture analysis heads** that process surface patterns and materials
- **Semantic understanding heads** that encode high-level object categories
- **Composition heads** that manage spatial relationships between objects

Ablation experiments can test whether these components matter for a chosen image-quality or task metric. Large drops after removing a bottleneck provide causal evidence for that component's role, but the interpretation depends on the baseline, metric, and severity of the intervention.

### The Temporal Dimension

Diffusion models introduce a dimension absent from language models: *time*. In a language model, information flows through layers (a spatial dimension within the network). In a diffusion model, it also flows through denoising steps (a temporal dimension).

A common, but not universal, coarse-to-fine pattern is:

- **Early timesteps:** Features correspond to coarse layout, color palette, and scene composition
- **Middle timesteps:** Features correspond to object boundaries and spatial relationships
- **Late timesteps:** Features correspond to fine textures and details

SAEs applied to diffusion models show how concepts become more refined as denoising progresses. A feature that initially represents "something red in the upper left" evolves through timesteps into "a specific red flower with detailed petal structure." This temporal evolution of features is unique to diffusion models and requires new MI methods beyond what works for language.

### SAEs for Diffusion Models

Applying SAEs to diffusion model activations reveals feature directions that correspond to structured image regions independent of high-level semantics. The concept of a "diffusion steering lens", extending the logit lens concept to vision transformers within diffusion models, allows researchers to observe how the model's internal predictions change across denoising steps, analogous to how the [logit lens](/topics/logit-lens-and-tuned-lens/) reveals prediction evolution across layers in language models.

<details class="pause-and-think">
<summary>Pause and think: What model architectures need new MI methods?</summary>

MI techniques developed for language models (SAEs, probing, patching) transfer to vision and multimodal models with some adaptation. But diffusion models required the concept of temporal evolution, which is absent from language models.

What other model architectures might require fundamentally new MI approaches? Consider reinforcement learning agents that interact with environments, models that use external tools (calculators, search engines), or models with explicit memory systems. What new dimensions of computation would MI need to address in each case?

</details>

## What the Evidence Supports So Far

The evidence separates demonstrated capabilities from missing end-to-end accounts:

**What has been demonstrated:**
- SAEs can learn interpretable candidate features in tested vision encoders, including CLIP
- Probing and activation patching can be applied at multimodal activation sites
- Selected feature interventions change measured outputs in some vision and multimodal models

**What is still early:**
- For vision-language models, current studies localize some integration effects but do not yet provide broad end-to-end mechanisms
- Diffusion studies identify functional specialization, with relatively few replicated circuit accounts
- The field lacks a canonical multimodal case study with the depth of intervention and evaluation found in the IOI literature

**The gap:**
- Much multimodal MI remains observational. Causal studies exist, but there are fewer end-to-end, replicated circuit accounts than in language-model work.{% sidenote "A field need not advance in a fixed sequence from observation to intervention to circuits. Still, separating those evidence types helps: a labeled feature, a causal effect, and an end-to-end mechanism answer different questions." %}

The most useful next benchmark would force all three levels of evidence into one analysis: interpretable candidate features, interventions showing that they matter, and an end-to-end account of how they interact. Language-model work has examples that approach this standard; multimodal MI does not yet have a similarly canonical circuit. Until it does, claims about shared features, causal control, and mechanism should remain separate.
