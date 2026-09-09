---
title: "Universality Across Models"
description: "Whether independently trained networks learn the same features and circuits, what current evidence shows, and how representational similarity is measured."
order: 8
prerequisites:
  - title: "Crosscoders"
    url: "/topics/crosscoders/"
  - title: "Comparing Representations Across Models"
    url: "/topics/representation-similarity-measures/"

glossary:
  - term: "Universality"
    definition: "The hypothesis that different neural networks trained on similar tasks converge on similar internal representations and circuits, suggesting that certain computational solutions are natural or optimal for given problems."

exitCriteria:
  - task: "Distinguish weak from strong universality, say which the current evidence supports, and explain why the stronger claim is harder to establish."
    answer: |
      **Weak:** different models develop features serving similar *functions* — both detect sentence boundaries — while the directions and implementations differ. Analogous, not identical.

      **Strong:** different models develop the *same* features, with directions that map onto one another. Representationally equivalent, not merely functionally similar.

      The evidence favors **weak**. Close one-to-one correspondences appear for a minority of units — the 1–5% of neurons that match across seeds — and nothing supports a shared universal feature dictionary.

      **Why strong is harder:** correlated activations do not establish identical computation. Two units can fire on the same inputs while feeding entirely different downstream consumers, so a correspondence found by activation similarity is a correlational match between two models, inheriting all the weaknesses of correlational evidence *twice over*. Establishing the strong claim needs matched *function*: intervene on the unit in model A and on its counterpart in model B and show the same downstream consequences.

      There is also a measurement problem. "Same feature" is only defined relative to an alignment method, and CKA, matched neurons, and crosscoders can disagree. A claim of strong universality has to name the level of abstraction at which it is asserted.
  - task: "Universal neurons are 1–5% of neurons, monosemantic and interpretable, with large weight norms and low activation frequency. Connect this profile to the superposition phase diagram, and say what the connection predicts."
    answer: |
      The phase diagram says features escape superposition when they are **high-importance and low-sparsity** — worth an orthogonal dimension of their own. The universal neurons' profile is close to a direct read of that region. Large weight norm is a proxy for importance: the model has invested magnitude in this unit and downstream components read it strongly. Monosemanticity is what escaping superposition *means* at the neuron level.

      So the two findings support each other from different directions. Superposition predicts a small privileged set that gets dedicated capacity; universality finds a small set that is both interpretable and stable across seeds. Plausibly they are the same set, and for the same reason: a feature important enough to be worth a dedicated dimension in one training run is important enough to be worth one in every training run, because the pressure comes from the data and the objective rather than from the seed.

      **The prediction:** universality should be *graded by importance*, not uniform. Sweep a measure of feature importance and the cross-seed match rate should rise with it, with superposed low-importance features matching poorly because their particular packing geometry is an arbitrary solution to a packing problem with many optima.

      Low activation frequency is the one part that cuts against the simple story, since the phase diagram wants dense features to escape — worth noticing rather than smoothing over.
  - task: "CKA has largely superseded SVCCA for comparing representations across models trained from different initializations. Explain what each measures and why the difference matters here."
    answer: |
      **SVCCA** selects the most important directions in each representation by SVD, then measures pairwise correlation between those directions. It is a comparison of **coordinate systems**.

      **CKA** compares similarity matrices over inputs: for each model, how similar is input $i$'s representation to input $j$'s? It is a comparison of **relational structure**, and it is invariant to any orthogonal transformation of the space.

      The difference matters because the residual stream has no privileged basis. Two models can encode identical structure in bases related by an arbitrary rotation — and different initializations essentially guarantee they will. SVCCA sees that rotation as disagreement and reports low similarity for models that are representationally equivalent. CKA is blind to it by construction, so it detects the correspondence that is actually there.

      The general lesson recurs throughout the curriculum: a comparison should be invariant to the symmetries of the thing being compared. A method that is sensitive to an arbitrary choice will report differences that reflect the choice rather than the models.

      The cost is that CKA gives an aggregate score and names no features. It says representations are similar without saying which parts correspond, which is why crosscoders are the complement rather than the competitor.
  - task: "SAEs trained on a Transformer and on Mamba find mostly similar features, and Mamba's induction circuit is structurally analogous with an off-by-one motif difference. Explain why this is the strongest form of universality, and what would be needed to make the claim causal."
    answer: |
      It is the strongest form because the two systems share almost nothing at the level of computational primitives. A Transformer routes information by attention — an input-dependent, all-to-all comparison. Mamba uses a selective state space — a recurrence with input-dependent gating. Seed differences vary the starting point of the same optimization; architecture differences vary the space of computations available. Convergence across that gap is evidence that the structure is coming from the **data and objective**, which is the strongest available argument that any of this is about language rather than about transformers.

      The off-by-one motif is a useful detail: it shows the correspondence is at the algorithmic level and not a coincidence of implementation, since a spurious match would not preserve the algorithm while shifting the indexing.

      **To make it causal:** feature-level similarity from SAEs is still a correspondence between two learned dictionaries, matched by activation. What is needed is intervention on both sides. Ablate the Mamba induction components and show the in-context-learning behavior degrades as it does in a Transformer; steer along a matched feature in each model and show the same behavioral change; patch and show the analogous circuit mediates the same counterfactual. Until then the claim is that two SAEs found similar-looking dictionaries — which the linear-representation and packing arguments predict even where the mechanisms differ.

furtherReading:
  - title: "Gurnee et al., *Universal Neurons in GPT-2 Language Models*"
    url: "https://arxiv.org/abs/2401.12181"
    note: "The measurement across seeds, and the finding that only a small fraction of neurons are universal."
  - title: "Kornblith et al., *Similarity of Neural Network Representations Revisited*"
    url: "https://arxiv.org/abs/1905.00414"
    note: "CKA and the invariance argument. Any universality claim depends on a choice of similarity measure, and this is where that choice is made."
  - title: "Klabunde et al., *Similarity of Neural Network Models: A Survey of Functional and Representational Measures*"
    url: "https://arxiv.org/abs/2305.06329"
    note: "The full space of measures, which matters because different ones give different answers to the same universality question."
  - title: "Huh et al., *The Platonic Representation Hypothesis*"
    url: "https://arxiv.org/abs/2405.07987"
    note: "The strong version of convergence across models and modalities. Read it as the ambitious claim this article's evidence has to bear on."
---

## The Universality Hypothesis

In [What Is Mechanistic Interpretability?](/topics/what-is-mech-interp/), we encountered three foundational claims from Olah et al.: features are the fundamental unit of neural network computation, features connect into circuits, and analogous features and circuits form across models trained on different data. The third claim is the **universality hypothesis**.

If universality holds even approximately, an analysis of one model could guide work on another. Researchers could begin with a known feature or circuit instead of searching from scratch. That would not make interpretability a finite problem, models can still add, split, or repurpose features, but it would make some findings reusable.

The strength of the hypothesis depends on what “same” means. Two models might contain units with correlated activations, represent analogous functions in different bases, or implement genuinely corresponding circuits. Those claims require different evidence.{% sidenote "Stable structure across training runs could reflect recurring structure in the data or objective, but the representation also depends on architecture, optimization, and the comparison method. Universality is therefore an empirical question at a specified level of abstraction." %}

## Representation Similarity Metrics

Before examining the evidence for universality, we need tools to measure whether two models' representations are similar. Two metrics dominate the field: CKA and SVCCA.

### CKA: Centered Kernel Alignment

Kornblith et al. (2019) introduced **CKA** (Centered Kernel Alignment), the most widely used metric for comparing representations across models.

The intuition: given two networks, compute the *representational similarity matrix* for each, how similar are pairs of inputs according to each network? Then measure the alignment between these matrices.

$$\text{CKA}(X, Y) = \frac{\text{HSIC}(X, Y)}{\sqrt{\text{HSIC}(X, X) \cdot \text{HSIC}(Y, Y)}}$$

where HSIC is the Hilbert-Schmidt Independence Criterion, a kernel-based measure of statistical dependence between two sets of representations.

> **Centered Kernel Alignment (CKA):** A similarity metric that measures alignment between the representational similarity structures of two networks. CKA is invariant to orthogonal transformations (if two networks learn the same representations in different coordinate systems, CKA still detects the correspondence) and invariant to isotropic scaling. CKA ranges from 0 (no alignment) to 1 (perfect alignment).

**Key finding:** CKA reveals that independently trained networks develop similar layer-wise structure. Early layers are more similar across networks than later layers, suggesting that lower-level features are more universal than higher-level ones.

### SVCCA: An Earlier Approach

Before CKA, Raghu et al. (2017) proposed **SVCCA** (Singular Vector Canonical Correlation Analysis):

1. Apply SVD to select the most important directions in each representation
2. Use CCA (Canonical Correlation Analysis) to measure pairwise correlation between the selected directions

SVCCA found that networks converge to final representations *from the bottom up*, lower layers stabilize first during training. However, CKA has largely superseded SVCCA because it more reliably detects correspondences between networks trained from different initializations.{% sidenote "Why does CKA outperform SVCCA? CKA measures the alignment of full representational *structures* (similarity matrices over inputs), while SVCCA measures the alignment of individual *directions*. Directions can differ across models even when the overall structure is preserved, making SVCCA more sensitive to superficial differences in coordinate systems." %}

### Representation Similarity vs. Feature-Level Comparison

CKA and SVCCA answer a holistic question: "Are these representations similar overall?" [Crosscoders](/topics/crosscoders/) answer a finer question: "What specific features are shared or different?"

The two approaches are complementary. CKA provides a relatively cheap, aggregate comparison; crosscoders require training but propose specific shared and model-exclusive features. Neither metric decides universality on its own: the result depends on the data, layers, alignment method, and level of abstraction being compared.

## Three Dimensions of Universality

The evidence for universality comes along three dimensions: training universality (same architecture, different random seeds), scale universality (same architecture, different sizes), and architecture universality (different architectures entirely).

![Diagram showing the three dimensions of universality: training universality (different seeds converge), scale universality (features persist across model sizes), and architecture universality (Transformers and Mamba share features).](/topics/universality/images/universality_evidence.png "Figure 1: Three dimensions of universality. Training universality asks whether different training runs converge. Scale universality asks whether features persist across model sizes. Architecture universality asks whether fundamentally different architectures learn similar features.")

### Training Universality

Gurnee et al. (2024) studied GPT-2 models trained from different random seeds {% cite "gurnee2024universal" %}. The key findings:

- **1-5% of neurons are universal**, they consistently activate on the same inputs across independently trained models
- Universal neurons are **monosemantic and interpretable**, with large weight norms and low activation frequency
- They have **clear functional roles**: deactivating attention heads, changing entropy of the next-token distribution, predicting token set membership

These neurons have unusually similar activation patterns across independent training runs. Calling them the *same* unit is stronger: it also requires a meaningful correspondence in function and downstream effect. Their relative interpretability supports the hypothesis that some stable features reflect recurring structure in the data, without implying that every matched neuron has one exhaustive semantic label.

### Scale Universality

Evidence suggests that features found in smaller models also appear in larger ones:

- Features discovered by SAEs in small models (e.g., GPT-2) often have counterparts in larger models (e.g., GPT-2 XL, Llama)
- The feature vocabulary seems to *grow* with scale rather than *change*, larger models add new features on top of the existing ones
- Larger models may represent the same concepts with higher fidelity and less [superposition](/topics/superposition/)

This is encouraging for interpretability research: understanding small models may transfer to understanding large ones, at least at the feature level. The features discovered during [scaling monosemanticity](/topics/scaling-monosemanticity/) in Claude 3 Sonnet included many features analogous to those found in the much smaller one-layer model studied earlier.

<details class="pause-and-think">
<summary>Pause and think: What would break universality?</summary>

If universality holds, features discovered in one model should appear in others. Under what conditions might universality break down? Consider: models trained on very different data distributions, models with very different architectures, or models trained with very different objectives. Would a vision model and a language model share features? Would a model trained on code share features with one trained on natural language?

The answer may depend on what level of abstraction you consider. At the lowest level (token patterns, syntax), features are domain-specific. At higher levels (logical structure, causal reasoning), there may be more commonality. The universality hypothesis is likely not all-or-nothing but a matter of degree that varies across feature types.

</details>

### Architecture Universality

Wang et al. (2024) compared features across entirely different architectures:

- Trained SAEs on both **Transformer** and **Mamba** (a state-space model) and compared the learned features
- Most features are similar across architectures
- **Induction circuits** in Mamba are structurally analogous to those in Transformers, with an "off-by-one" motif difference

This is the strongest form of universality: not just the same architecture with different initializations, but fundamentally different computational primitives converging on similar features. Transformers use attention to route information; Mamba uses selective state spaces. Yet they learn comparable features for similar tasks.{% sidenote "Architecture universality is particularly important for MI's future. If new architectures (SSMs, hybrid models, mixture-of-experts) learn similar features to Transformers, then MI tools developed for Transformers may transfer. If not, MI would need to develop architecture-specific methods for each new model family." %}

## Weak vs. Strong Universality

Two versions of the universality claim are useful to separate:

**Weak universality:** Different models develop features that serve similar *functions* (e.g., both detect sentence boundaries), but the specific directions and implementations may differ. The features are *analogous* but not *identical*.

**Strong universality:** Different models develop the *same* features with corresponding directions that can be mapped onto each other. The features are not just functionally similar but representationally equivalent.

Current evidence is more compatible with weak universality than with a one-to-one universal feature dictionary. Strong universality is harder to establish because similarity in activation does not by itself prove identical computation. Results on matched neurons suggest that close correspondences exist for a minority of units in the models tested.

[Crosscoders](/topics/crosscoders/) provide the most direct test of universality at the feature level: a crosscoder trained across two models finds shared features (evidence for universality) and exclusive features (evidence against it). CKA provides a holistic measure of representation alignment that does not require identifying individual features.

<details class="pause-and-think">
<summary>Pause and think: Universality and safety</summary>

If universality holds, MI results from one model may generalize to others. Why would that make safety analysis more scalable?

Consider a safety evaluation that discovers a dangerous internal mechanism in Model A. If universality holds, we have reason to check whether Model B has a similar mechanism, and the tools (crosscoders, CKA) to test this efficiently. If universality does not hold, every model is a blank slate requiring full analysis from scratch. With models being deployed at increasing scale and speed, the ability to transfer safety insights across models could be the difference between tractable and intractable safety evaluation.

</details>

## Testing Transfer Beyond Language Models

Current evidence gives us concrete correspondences to test, not permission to assume that any interpretation transfers. Centered kernel alignment (CKA) can flag broad representational similarity, matched units can identify local candidates, and crosscoders can separate shared from model-specific features. Causal interventions must still establish whether a matched feature plays the same role in both systems.

Architecture-level transfer becomes harder when the inputs and computations change. [Multimodal Mechanistic Interpretability](/topics/multimodal-mi/) asks which parts of the language-model toolkit survive in vision-language and diffusion models, and which modality-specific structures demand new methods.
