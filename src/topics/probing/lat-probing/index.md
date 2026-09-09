---
title: "Linear Artificial Tomography (LAT)"
description: "How to read what concepts a model represents by training linear classifiers on activations, following the population-level approach from cognitive neuroscience."
order: 4
prerequisites:
  - title: "Contrastive Activation Addition (CAA)"
    url: "/topics/caa-method/"
  - title: "Principal Component Analysis"
    url: "/topics/principal-component-analysis/"

exitCriteria:
  - task: "LAT extracts a classifier's weight vector; CAA computes a mean difference. Say when the two directions agree, what each additionally supplies, and what neither supplies."
    answer: |
      **When they agree:** when the class covariances are well behaved — roughly, when the two classes have similar, near-isotropic spread. The discriminative optimum then points along the line joining the means. Where covariances differ or the data has strong anisotropic structure, a fitted classifier will tilt away from the mean difference to exploit directions where the classes are separable but not displaced.

      **LAT additionally supplies** held-out classification accuracy, a direct measure of how linearly accessible the distinction is. CAA gives you a vector with no built-in measure of how well it separates anything.

      **CAA additionally supplies** robustness. It has no fitting step, so it cannot overfit to dataset-specific correlates — the property that makes difference-in-means transfer better across topics than trained logistic regression.

      **Neither supplies** causal use or semantic purity. Both are correlational: a direction that separates the labels, obtained two ways. Whether the model reads it, and whether it tracks the concept rather than something reliably co-occurring with it, requires interventions and counterexample tests that neither procedure performs.
  - task: "LAT borrows the population-level perspective from cognitive neuroscience rather than studying individual components. State the methodological claim this makes, and the cost it accepts."
    answer: |
      **The claim:** the useful unit of analysis is the *representation* — a direction in high-dimensional activation space corresponding to a behavioral concept — rather than any individual component. Neuroscientists do not primarily study single neurons; they study population activity patterns, because cognition is carried by the population and single units are noisy, polysemantic, and individually uninformative. LAT applies the same reasoning to transformers, and the polysemanticity results give it independent support: single neurons *are* uninformative for exactly the reason the neuroscientists found.

      **The cost:** you get a handle without a mechanism. A concept direction says the model represents something and lets you read and possibly write it. It does not say which components compute it, how it is produced, or what consumes it. "Honesty is at layer 15" is a useful operational fact and not an explanation.

      This is a genuine division of labor rather than a defect. LAT-style work buys practical control quickly, which is what monitoring and steering need; circuit-level work buys mechanism slowly. The error is treating a direction as if it were a mechanism, and it is easy to make because a direction that steers reliably *feels* like understanding.
  - task: "A LAT probe separates honest from deceptive completions with high held-out accuracy. List the tests that would have to pass before calling the direction an honesty direction."
    answer: |
      1. **Cross-topic transfer.** The direction found on one domain should classify honesty in others. Failure means you found a topic-specific correlate; success narrows the alternatives without eliminating them.
      2. **Cross-format transfer.** New prompt templates, phrasings, and conversation structures. This catches template artifacts, which are the most common confound in contrastively constructed datasets.
      3. **Counterexamples by construction.** Deliberately build cases where honesty and the likely confounds come apart: honest statements phrased hedgingly, deceptive ones phrased confidently. If the probe follows confidence rather than honesty, this is where it shows.
      4. **A causal test with an off-target control.** Intervene along the direction and check that honesty-dependent behavior moves as predicted (Cause), and that unrelated capabilities do not (Isolate).
      5. **Adversarial pressure.** Whether the direction survives inputs constructed to defeat it, which is the condition any deployment faces.
      6. **A supervised baseline comparison.** If difference-in-means on the same data does as well, the fitted classifier's extra capacity bought nothing and may have cost transfer.

      High held-out accuracy on the training distribution passes none of these. It is where the investigation starts.

furtherReading:
  - title: "Zou et al., *Representation Engineering: A Top-Down Approach to AI Transparency*"
    url: "https://arxiv.org/abs/2310.01405"
    note: "The full RepE paper. LAT is one piece of it, and the surrounding framing explains the design choices."
  - title: "Marks & Tegmark, *The Geometry of Truth*"
    url: "https://arxiv.org/abs/2310.06824"
    note: "The same population-level idea applied with more care about controls, and a useful comparison of what each procedure recovers."
  - title: "Kirichenko et al., *Last Layer Re-Training is Sufficient for Robustness to Spurious Correlations*"
    url: "https://arxiv.org/abs/2204.02937"
    note: "From outside the field, and a strong warning that a linear readout can succeed for reasons unrelated to the concept you named."
---

## Reading Representations

[CAA](/topics/caa-method/) computes concept directions by averaging activation differences. But there is another way to find these directions: train a classifier to predict which concept is active, then examine what direction the classifier uses.

Zou et al. (2023) proposed **Linear Artificial Tomography (LAT)** as part of the Representation Engineering (RepE) framework {% cite "zou2023repe" %}. The key analogy comes from cognitive neuroscience: neuroscientists do not study individual neurons in isolation. They study population-level activity patterns, the collective behavior of neural populations that corresponds to cognition, perception, and decision-making.

LAT applies the same philosophy to neural networks. Instead of dissecting individual circuits or features, LAT works at the level of *representations*, the collective activation patterns that encode high-level concepts.{% sidenote "The population-level perspective represents a genuine philosophical shift. Most mechanistic interpretability work focuses on individual components: specific attention heads, individual neurons, or sparse autoencoder features. LAT argues that the most important unit of analysis is the representation, a direction in the high-dimensional activation space that corresponds to a behavioral concept." %}

> **Linear Artificial Tomography (LAT):** A method for training linear classifiers on activations from contrasting stimuli. It tests where a labeled distinction is linearly decodable and extracts the classifier's separating direction.

## The LAT Procedure

The procedure mirrors contrastive methods from neuroscience:

1. **Stimulate the model with contrasting inputs.** Present pairs of prompts that differ in a target concept, for example, honest versus dishonest completions, or harmful versus harmless responses.

2. **Collect activations.** Run both sets through the model and collect residual stream activations at intermediate layers.

3. **Train a linear classifier.** Fit a logistic regression or linear probe on the activations to predict which behavior is active:

$$
p(\text{concept} | \mathbf{h}) = \sigma(\mathbf{w} \cdot \mathbf{h} + b)
$$

where $\mathbf{w}$ is the learned weight vector, $\mathbf{h}$ is the activation, and $\sigma$ is the sigmoid function.

4. **Extract a candidate direction.** The classifier weight $\mathbf{w}$ defines the separating direction learned from these examples.

The classifier weights define a candidate **concept direction**: a direction that separates the two labeled sets. Transfer and counterexample tests are needed to determine whether the direction tracks the intended concept rather than a correlated difference.

## LAT vs. CAA

LAT and CAA are closely related but approach the problem differently:

| Method | Approach | Output |
|--------|----------|--------|
| **CAA** | Mean difference of activations | Concept direction (difference vector) |
| **LAT** | Train linear classifier | Concept direction (classifier weights) |

Both produce a direction in activation space. The difference is methodology:

- **CAA** computes the direction directly from activation differences.
- **LAT** learns the direction by training a classifier to distinguish the concepts.

The methods can produce similar directions when the class covariances are well behaved. LAT directly optimizes classification and supplies held-out accuracy as an accessibility measure; CAA estimates a mean shift without fitting a decision boundary. Neither metric alone measures causal use or semantic purity.{% sidenote "LAT is closely related to the probing classifiers discussed earlier. The mathematical procedure is probing; the Representation Engineering framing emphasizes reusing the learned direction for analysis and possible intervention." %}

## Probing Safety-Relevant Properties

LAT can probe safety-relevant properties:

- **Honesty labels.** Can a classifier distinguish activations from examples labeled truthful and deceptive, including on new topics and prompt formats?

- **Harmlessness.** Do harmful and harmless response trajectories separate in activation space? LAT can track this separation across layers.

- **Power-seeking.** Can we identify representations associated with power-seeking behavior? LAT provides a way to measure this.

A direction that generalizes across suitable held-out conditions could become one signal in an internal monitor. It would still require calibration against false positives, distribution shift, and strategic evasion before “dishonesty detector” is an appropriate label.

<details class="pause-and-think">
<summary>Pause and think: Reading versus controlling</summary>

LAT reads what concepts a model represents. [Addition steering](/topics/addition-steering/) controls behavior by adding directions. These use the same concept direction for different purposes. In what situations would you want to *read* a model's representations without *controlling* them? When would you want to *control* without reading first?

Reading without controlling is useful when the goal is diagnosis or monitoring. Control without a prior probe is possible, for example through direct optimization of a behavioral metric, but then the mechanism and off-target effects may be harder to characterize. In either order, readout and intervention provide different evidence and should be evaluated separately.

</details>

## Layer-by-Layer Analysis

LAT naturally supports layer-by-layer analysis. By training classifiers at each layer, you can track:

- **Where does the concept first become detectable?** Early layers may not yet encode high-level concepts.
- **Where is it most linearly accessible?** Classifier accuracy can peak where the labeled distinction is easiest to separate.
- **Does it persist to the final layer?** Some concepts are used internally but not directly reflected in outputs.

This layer-wise profile maps linear decodability through the forward pass. It does not, by itself, reveal when the information was computed or where it is causally used.

## The Connection to Control

The direction that LAT uses to separate labels can also be tried as an [addition-steering](/topics/addition-steering/) vector. Good classification does not guarantee good steering, so the two uses form a useful comparison:

- **Read:** What does the model represent? (LAT, CAA)
- **Control:** How can we steer it? ([Addition](/topics/addition-steering/), [Ablation](/topics/ablation-steering/))

A concept direction that reads well but steers poorly suggests the representation is correlated with but not causal for the behavior. A direction that steers well but reads poorly suggests the intervention works through a mechanism we do not yet understand.

<details class="pause-and-think">
<summary>Pause and think: Classifier accuracy as a metric</summary>

LAT produces a classifier accuracy: how well can the linear probe distinguish the two concepts? What does high accuracy tell us? What does low accuracy tell us? Can you have a meaningful concept direction with low classifier accuracy?

High accuracy means the labeled examples are linearly separable in the sampled activations. The separating direction may encode the target property, a correlated cue in the dataset, or both. Low accuracy could reflect nonlinear encoding, weak labels, a poor layer choice, or a concept the model does not represent. Accuracy is therefore one piece of evidence, to be paired with transfer tests and interventions.

</details>

## Looking Forward

LAT provides a standard linear-probing route to candidate representation directions. Combined with [CAA](/topics/caa-method/), it supplies hypotheses that can be tested with [steering](/topics/addition-steering/), [ablation](/topics/ablation-steering/), transfer sets, and off-target evaluations.
