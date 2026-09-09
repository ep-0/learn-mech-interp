---
title: "Contrastive Activation Addition (CAA)"
description: "How to compute robust steering vectors by averaging activation differences across many contrast pairs, isolating the shared direction corresponding to a target concept."
order: 3
prerequisites:
  - title: "The Linear Representation Hypothesis"
    url: "/topics/linear-representation-hypothesis/"

glossary:
  - term: "Persona Vector"
    definition: "A contrastive activation direction constructed to represent a named behavioral trait, using responses elicited by opposing trait-conditioned prompts."

exitCriteria:
  - task: "CAA averages activation differences over many contrast pairs rather than using one. Say precisely what the averaging cancels and what it preserves, and why a single pair is unreliable."
    answer: |
      A single difference $\mathbf{h}^{(+)} - \mathbf{h}^{(-)}$ contains the *entire* difference between two activations, not just the semantic part. "Love" and "Hate" differ in sentiment, and also in length, topic associations, token identity, and whatever positional structure the two prompts happen to induce. Nothing in the subtraction separates these.

      **Averaging cancels** whatever varies independently across pairs. If pair $i$ carries an idiosyncratic component $\boldsymbol{\epsilon}_i$ with no consistent direction, then $\frac{1}{N}\sum_i \boldsymbol{\epsilon}_i$ shrinks roughly as $1/\sqrt{N}$.

      **Averaging preserves** whatever is shared across pairs — by construction, the concept every pair was designed to isolate.

      **Why one pair is unreliable:** you get signal plus one draw of noise, with no way to tell them apart, and the noise may be larger than the signal. Steering along it produces effects attributable to length or topic as readily as to sentiment.

      The critical caveat: averaging only cancels what is *not* systematic. A confound present in every positive prompt and absent from every negative one survives the average perfectly, and is indistinguishable from the concept. The method's quality is bounded by the contrast design, not by $N$.
  - task: "CAA's steering effect peaks around layers 12–17 of Llama 2 and is near zero at early and late layers. Explain both ends of the curve."
    answer: |
      **Early layers, no effect:** representations are still close to token space, encoding surface features — identity, position, local syntax. The abstract concept you are trying to steer is not yet represented, so the difference vector computed there is a difference between token-level encodings, and adding it changes surface properties rather than the behavior. There is no concept direction to add along.

      **Late layers, no effect:** the model has largely committed. By the last few layers the residual stream is being organized for the unembedding, and the computation that *decides* the behavior has already run. A push there can only nudge the final logits, not change what the model concluded — you are intervening downstream of the decision.

      **Middle layers, peak effect:** concepts are represented in their most abstract form, and enough computation remains downstream for a change to propagate into the behavior. Both conditions are necessary, and only the middle satisfies both.

      The curve is also a useful diagnostic. A steering result reported without a layer sweep hides whether the chosen layer was the best of many tried; and a *flat* profile would be suspicious, suggesting the intervention works by disruption rather than by moving a represented variable.
  - task: "A CAA vector points from the negative class mean to the positive class mean *for the dataset you built*. Describe the failure this invites and how you would detect it."
    answer: |
      **The failure:** any property that differs systematically between your positive and negative prompts becomes part of the vector, and averaging does not remove it — averaging removes what varies *across* pairs, and a systematic confound does not vary.

      Concretely, for sycophancy: if agreeing responses in your dataset tend to be shorter, more enthusiastic, or start with "Yes," the vector is partly a length-and-enthusiasm direction. Steering along it produces more agreeable-sounding output, the evaluation scores it as sycophancy, and the interpretation is wrong.

      **Detection:**

      1. **Vary the contrast construction.** Build a second dataset where the confound runs the other way — agreeing responses that are long and hedged — and check that the two vectors are similar. Cosine similarity between vectors from independent designs is the cheapest useful test.
      2. **Test off-target behavior.** Steer and measure properties that should not move, the Isolate half of Cause-and-Isolate.
      3. **Probe the vector for the confound.** Project activations that vary only in the suspected nuisance property and see whether they separate along it.
      4. **Check transfer.** A vector capturing the concept should work on prompts from a different distribution; one capturing a template artifact should not.
  - task: "The CAA vector and a difference-in-means probe direction are computed identically. Say what this duality means and what has to hold for the reading direction to work as a writing direction."
    answer: |
      The same object serves both roles: project an activation onto it to *read* how much of the concept is present, or add a multiple of it to *write* the concept in. One computation, two uses — reading a concept and writing it are the same geometry viewed from either side.

      **What must additionally hold for writing to work:**

      1. **The direction must be causally used, not merely present.** A direction can separate the classes because it is a byproduct of the computation while no downstream component reads it. Reading it works; writing it does nothing. This is the probing correlation-causation gap, and it does not go away when you reuse the vector.
      2. **The additive model must be adequate.** Writing assumes the concept enters as a linear offset. If the model represents it multiplicatively, contextually, or on a curved manifold, adding a constant vector approximates the right change only locally.
      3. **The result must stay in distribution.** A large coefficient moves the activation to a region no forward pass produces, where behavior is unconstrained — which is why steering degrades into incoherence rather than saturating.

      So the duality is a genuine economy and a trap: it makes the writing intervention *available* without making it *valid*.

furtherReading:
  - title: "Rimsky et al., *Steering Llama 2 via Contrastive Activation Addition*"
    url: "https://arxiv.org/abs/2312.06681"
    note: "The full evaluation across behaviors and layers, including the failures."
  - title: "Chen et al., *Persona Vectors: Monitoring and Controlling Character Traits in Language Models*"
    url: "https://arxiv.org/abs/2507.21509"
    note: "The automated contrast-set pipeline, which is what makes CAA usable without hand-writing pairs."
  - title: "Tan et al., *Analysing the Generalisation and Reliability of Steering Vectors*"
    url: "https://arxiv.org/abs/2407.12404"
    note: "Steering vectors work far less reliably out of distribution than the headline results suggest. The most important corrective to this article."
  - title: "Im & Li, *A Unified Understanding and Evaluation of Steering Methods*"
    url: "https://arxiv.org/abs/2502.02716"
    note: "Contrastive, probe-derived, and optimized directions compared under one protocol."
---

## From Single Pairs to Robust Directions

If concepts are linear directions in activation space, we can find them by computing the difference between activations for contrasting inputs. But a single contrast pair may capture noise alongside the target concept. If "Love" and "Hate" differ in ways beyond just sentiment, perhaps one is longer, mentions specific topics, or triggers different positional patterns, the resulting vector encodes those differences too.{% sidenote "This is the same problem that arises with any contrastive method built from few samples. The steering vector captures the full difference between two activations, not just the semantically meaningful part. Averaging over many pairs mitigates this by canceling out pair-specific noise." %}

This motivates a more robust approach: averaging over many contrast pairs to isolate the shared direction.

## The CAA Method

Panickssery et al. (2024) proposed **Contrastive Activation Addition (CAA)**: instead of one contrast pair, average the activation differences over *many* pairs {% cite "panickssery2024caa" %}:

$$
\mathbf{v} = \frac{1}{N} \sum_{i=1}^{N} \left( \mathbf{h}_i^{(+)} - \mathbf{h}_i^{(-)} \right)
$$

where $\mathbf{h}_i^{(+)}$ and $\mathbf{h}_i^{(-)}$ are the activations for the $i$-th positive and negative prompt.

Averaging cancels out noise specific to individual pairs. What remains is the **shared direction** corresponding to the target concept. If every positive prompt involves more sycophancy and every negative prompt involves less, the average difference vector points in the "sycophancy direction," with pair-specific artifacts washed out.

> **Contrastive Activation Addition (CAA):** A method for computing concept directions by averaging activation differences across many contrast pairs. The averaging process isolates the shared direction corresponding to the target concept while canceling pair-specific noise.

## The Procedure

1. **Construct many contrasting prompt pairs.** Each pair should differ primarily in the concept you want to probe. For sycophancy: pairs where one response agrees with the user and one disagrees. For honesty: pairs where one response is truthful and one is deceptive.

2. **Run all prompts through the model.** Collect residual stream activations at a chosen layer $\ell$ for both positive and negative prompts.

3. **Compute the mean difference:**

$$
\mathbf{v} = \frac{1}{N} \sum_{i=1}^{N} \left( \mathbf{h}_i^{(+)} - \mathbf{h}_i^{(-)} \right)
$$

4. **Treat the mean difference as a candidate concept direction.** It points from the negative class mean toward the positive class mean for this dataset.

<figure>
  <img src="images/caa-method-overview.png" alt="Diagram of CAA steering vector generation. A contrast pair with positive and negative examples is fed through the model. At layer n, residual stream activations are extracted for both examples. The difference between activations at the answer token position is computed, then averaged over many pairs to produce the final steering vector.">
  <figcaption>Steering vector generation in CAA. For each contrast pair, residual stream activations are extracted at layer n and differenced at the answer token position. Averaging over many pairs yields the final concept direction. From Panickssery et al., <em>Steering Llama 2 via Contrastive Activation Addition</em>. {%- cite "panickssery2024caa" -%}</figcaption>
</figure>

## Layer-Specific Effects

Not all layers are equally informative. Panickssery et al. found that **layers 15-17** in Llama 2 (7B and 13B) show the most significant concept separation. The pattern makes intuitive sense:

- **Early layers** are too close to token space. Representations are still input-specific, encoding surface-level features like token identity and position.
- **Late layers** are too committed to output. The model has already decided what to generate.
- **Middle layers** encode concepts in their most abstract form. This is where semantic directions are cleanest and most detectable.

<figure>
  <img src="images/caa-layer-sweep.png" alt="Per-layer CAA effect for Llama 2 7B Chat. The x-axis shows transformer layer number (0 to 31) and the y-axis shows the change in probability of answer-matching behavior. Positive steering (blue) peaks around layers 12-15 and negative steering (orange) shows a corresponding trough, with both effects concentrated in middle layers and near zero at early and late layers.">
  <figcaption>Per-layer steering effect in Llama 2 7B Chat across multiple behaviors. The effect peaks sharply in the middle layers (around 12-15) and is negligible at early and late layers. From Panickssery et al., <em>Steering Llama 2 via Contrastive Activation Addition</em>. {%- cite "panickssery2024caa" -%}</figcaption>
</figure>

## Applications: Sycophancy Detection

CAA was applied to probe **sycophancy**, the tendency to agree with the user regardless of accuracy:

The computed sycophancy direction successfully distinguishes:
- Responses that agree with the user (even when wrong)
- Responses that provide truthful answers (even when contradicting the user)

On these prompts and layers, a linear direction carries enough information to distinguish sycophantic from non-sycophantic responses. That does not show that sycophancy has only one representation or that the model uses this direction causally.

## Persona Vectors: Automating the Contrast Set

CAA requires a researcher to turn a concept into matched examples. Chen et al. (2025) automate much of that construction for behavioral traits such as sycophancy and hallucination {% cite "chen2025persona" %}. They call the resulting CAA-style direction a **persona vector**.

Starting from a trait name and a natural-language description, an LLM generates two sets of system prompts: one instructs the model to display the trait, and the other instructs it to display the opposite. It also generates evaluation questions on which the trait could become visible. The target model produces multiple responses under both conditions, and an LLM judge filters out responses that do not actually express the requested behavior.

For layer $\ell$, let $R_i^{(+)}$ and $R_i^{(-)}$ be the response-token positions retained for the two conditions. First average within each response, then average across responses and subtract:

$$
\mathbf{v}_{\ell}^{\text{persona}}
=
\mathbb{E}_i\!\left[\frac{1}{|R_i^{(+)}|}\sum_{t\in R_i^{(+)}}\mathbf{h}_{\ell,t}^{(+)}\right]
-
\mathbb{E}_i\!\left[\frac{1}{|R_i^{(-)}|}\sum_{t\in R_i^{(-)}}\mathbf{h}_{\ell,t}^{(-)}\right]
$$

This is the same mean-difference geometry as CAA. The main changes are how the contrast set is generated, that activations are pooled across response tokens, and that the procedure produces a candidate vector at every layer. Chen et al. choose a layer by testing which candidate direction most reliably steers held-out behavior.

<figure>
  <img src="images/persona-vector-pipeline.png" alt="Pipeline for constructing a persona vector. A language model generates responses to the same questions under system prompts that request an undesirable trait or its opposite. Activations are extracted and averaged within each condition, then the two condition means are subtracted.">
  <figcaption>A persona vector is an automated, trait-conditioned instance of contrastive activation averaging. The prompts, responses, and judge introduce their own assumptions, so automation does not remove the need for validation. From Chen et al., <em>Persona Vectors: Monitoring and Controlling Character Traits in Language Models</em>. {%- cite "chen2025persona" -%}</figcaption>
</figure>

The name can sound more ontologically ambitious than the method warrants. A persona vector is a direction recovered from a particular contrast construction. It need not be the unique direction for that trait, and it can include correlated properties of the prompts, responses, or judge. In the paper's main experiments, the method was tested on evil behavior, sycophancy, and hallucination in Qwen2.5-7B-Instruct and Llama-3.1-8B-Instruct. That is evidence that the recipe transfers across these traits and two model families, not that every aspect of a model's persona is one-dimensional.

## Reading a Trait Before the Response

The same vector can act as a probe. For a new prompt $x$, take the residual activation at the final prompt token and project it onto the normalized persona vector:

$$
s_{\ell}(x)=\mathbf{h}_{\ell,t_{\mathrm{last}}}(x)\cdot
\frac{\mathbf{v}_{\ell}^{\text{persona}}}{\|\mathbf{v}_{\ell}^{\text{persona}}\|}
$$

If the score separates prompts that lead to high-trait and low-trait responses, the prompt representation contains a linearly accessible warning signal before generation begins. Chen et al. found strong separation when prompts came from explicitly different trait-inducing conditions. Separation was more modest within a single prompt type, where the surface cues were better controlled. The second result is the harder and more relevant test: a monitor should predict behavioral variation rather than merely recognize the instruction used to create the contrast.

Projection, steering, and held-out evaluation answer different questions. Projection shows that the direction is readable, steering tests whether changing the direction affects behavior, and held-out prompts test whether either result transfers beyond the construction set. A convincing persona-vector study needs all three.

<details class="pause-and-think">
<summary>Pause and think: Designing contrast pairs</summary>

Suppose you want to find a direction corresponding to "formal vs. informal" writing style. How would you design the contrast pairs for CAA? What considerations would guide your choice of prompts?

For contrast pairs, you would want prompts that elicit the same content but differ in formality. Ask the same question with instructions to "respond formally" versus "respond casually." The key challenge is ensuring your pairs differ primarily in formality, not in content, length, or topic. You would want diverse topics and question types to ensure the averaged direction captures formality itself, not artifacts of specific domains.

</details>

## Additivity and Robustness

The reported CAA directions transfer across prompt sets and combine with other interventions:

- CAA + fine-tuning: the effects combine without interfering.
- CAA + few-shot prompting: prompting effects and probing effects are additive.
- Directions computed from different prompt sets for the same concept are highly correlated.

Transfer across prompt sets is evidence against pair-specific noise, but it does not prove that the direction is unique or causally used.{% sidenote "Different contrast sets can share unintended features such as tone, length, or formatting. A transferred direction may encode one of those common cues alongside the intended concept, so robustness tests should vary the construction of the pairs as well as their topics." %}

## Connection to Steering

Once you have computed a concept direction via CAA, that same direction can be used for [steering](/topics/addition-steering/). The direction that a linear classifier uses to *detect* a concept is the same direction you can *add* to induce that concept. CAA provides the **probing** half of representation engineering; [addition steering](/topics/addition-steering/) provides the **control** half.

<details class="pause-and-think">
<summary>Pause and think: How many pairs are enough?</summary>

CAA averages over many contrast pairs. But how many is "many"? What factors would influence the number of pairs needed for a reliable direction?

The number depends on how much pair-specific noise exists relative to the true concept signal. Concepts with clear, unambiguous manifestations (like language: English vs. French) might need fewer pairs. Subtle behavioral concepts (like sycophancy) where the manifestation varies by context might need more pairs to average out the variation. Empirically, studies have used anywhere from 50 to several hundred pairs. The diagnostic is consistency: if adding more pairs doesn't change the direction significantly, you likely have enough.

</details>

## Looking Forward

CAA provides a principled method for finding concept directions in activation space. The same methodology applies whether you're probing sentiment, sycophancy, honesty, or safety-relevant properties like [refusal](/topics/refusal-direction/). Persona vectors show how the contrast-set construction can be automated for named traits, while preserving the same validation burden as any other probe. These directions support both [inference-time control](/topics/addition-steering/) and, later, [interventions on the training process](/topics/interpretability-guided-training/).
