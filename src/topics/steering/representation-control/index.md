---
title: "Representation Control"
description: "The unified framework for steering model behavior through interventions on internal representations, encompassing addition and ablation as complementary operations."
order: 4
prerequisites:
  - title: "Ablation Steering"
    url: "/topics/ablation-steering/"

exitCriteria:
  - task: "Reading, addition, and ablation are described as the three basic linear operations on a one-dimensional subspace. State each as a geometric operation, and say why they are three rather than one."
    answer: |
      Given a unit direction $\hat{\mathbf{r}}$ and an activation $\mathbf{h}$:

      - **Reading:** project onto the subspace, $\mathbf{h}\cdot\hat{\mathbf{r}}$ — a scalar measuring how much of the concept is present.
      - **Addition:** translate along the subspace, $\mathbf{h} + \alpha\hat{\mathbf{r}}$ — change the coordinate without touching anything orthogonal.
      - **Ablation:** project onto the orthogonal complement, $\mathbf{h} - (\mathbf{h}\cdot\hat{\mathbf{r}})\hat{\mathbf{r}}$ — set the coordinate to zero.

      They are three because they answer three different questions. Reading is *measurement* and changes nothing. Addition *sets* the coordinate to something larger without regard to its current value. Ablation *clears* it regardless of what it was.

      Note that addition and ablation compose to something neither gives alone: clear the coordinate, then set it to a chosen value. That is [affine concept editing](/topics/affine-steering/) minus its re-centering term, and it is the operation you usually want — replacement rather than push or erase.

      The framing also makes the natural generalization visible. All three extend from a direction to a $k$-dimensional subspace by replacing scalar projection with subspace projection, which is what concept-erasure methods do.
  - task: "Explain what you learn from a direction that reads well but steers poorly, and from one that steers well but reads poorly."
    answer: |
      **Reads well, steers poorly:** the concept is linearly *decodable* at this site but the direction is not causally used. The information is present as a byproduct — computed upstream, correlated with the label, and not read by anything downstream. This is the probing correlation-causation gap made concrete, and it is the more common case. It does not mean the concept has no causal representation; it means this direction is not it.

      **Steers well, reads poorly:** the intervention works through a mechanism the probe does not capture. Several possibilities: the direction is a control input rather than a representation — pushing along it perturbs a gate or a routing decision rather than setting a value; or the intervention succeeds by displacing the state, so the behavior change is disruption rather than concept installation; or the concept is represented nonlinearly, and the linear probe fails while an additive push still has the right effect locally.

      The asymmetry is worth keeping. Reading is cheap and weak evidence; steering is a genuine causal test and still admits the disruption explanation. Neither alone establishes that a direction *is* the model's representation of a concept — which is why the third capability in the framework, analysis of what the intervention reveals, is a separate step rather than a summary of the first two.
  - task: "The framework unifies read, control, and analyze. Explain why treating a good probe direction as an automatically good control direction is a mistake, using the shape of the two experiments."
    answer: |
      The two operations use the same vector for different purposes, and each carries its own assumptions.

      **Probing** asks whether a hyperplane separates two labeled sets of *observed* activations. It succeeds on the distribution of states the model naturally produces, and its criterion is discriminative — the direction only has to separate, not to mean anything to the model.

      **Steering** asks what happens when you move an activation to a state the model *did not* produce. That is a different regime, and three things can go wrong that probing never tests: the direction may be unread by downstream components; the additive model may be wrong if the concept is encoded on a curved structure; and the displaced state may leave the distribution, where behavior is unconstrained.

      So the intervention is a **new experiment**, not a corollary. It has its own failure modes, its own controls (a sweep over $\alpha$, off-target measurement, an equal-magnitude random-direction baseline), and its own possible outcome of null result that says nothing about the probing result.

      The convenience of the shared vector is what makes the error easy: it costs nothing to try steering with a probe direction, which makes it tempting to report the probe result as though the steering claim followed.

furtherReading:
  - title: "Zou et al., *Representation Engineering*"
    url: "https://arxiv.org/abs/2310.01405"
    note: "The whole paper. This article is a summary of its framing, and the experiments are where the substance is."
  - title: "Wu et al., *ReFT: Representation Finetuning for Language Models*"
    url: "https://arxiv.org/abs/2404.03592"
    note: "Learned interventions on representations as a parameter-efficient alternative to fine-tuning. The natural extension of control into training."
  - title: "Zou et al., *Improving Alignment and Robustness with Circuit Breakers*"
    url: "https://arxiv.org/abs/2406.04313"
    note: "Representation control deployed as a defense, and the strongest current evidence that these methods survive adversarial pressure."
  - title: "Wu et al., *AxBench*"
    url: "https://arxiv.org/abs/2501.17148"
    note: "A shared evaluation across the whole control family, which this article describes qualitatively."
---

## The Control Framework

[Addition steering](/topics/addition-steering/) and [ablation steering](/topics/ablation-steering/) are specific techniques. But they are part of a broader paradigm: **representation control**, the systematic manipulation of model behavior through interventions on internal representations.

Zou et al. (2023) formalized this paradigm as part of Representation Engineering (RepE) {% cite "zou2023repe" %}. A direction used by a linear probe is also a natural candidate for intervention: add it to test whether behavior increases, or project it out to test whether behavior decreases. A useful probe direction need not be an effective control direction, so the intervention is a new experiment rather than an automatic consequence.

> **Representation Control:** The use of concept directions identified through probing to systematically control model behavior. Control operations include addition (to induce behaviors) and ablation (to disable behaviors), both operating on the same geometric structure revealed by probing.

## Reading and Control: Two Sides of One Coin

The framework unifies three capabilities:

1. **Read:** What does the model represent? ([CAA](/topics/caa-method/), [LAT](/topics/lat-probing/))
2. **Control:** How can we steer it? ([Addition](/topics/addition-steering/), [Ablation](/topics/ablation-steering/))
3. **Analyze:** What does the intervention tell us about the model?

This unification is important because it connects the *diagnostic* question (what does the model encode?) with the *interventional* question (can we change it?).

A concept direction that reads well but steers poorly suggests the representation is correlated with but not causal for the behavior. A direction that steers well but reads poorly suggests the intervention works through a mechanism we do not yet understand.

## The Geometric Operations

Each operation corresponds to a fundamental geometric operation on activation space:

| Operation | Geometric Effect | Purpose |
|-----------|------------------|---------|
| **Reading** | Project onto direction | Detect if concept is present |
| **Addition** | Translate along direction | Induce the concept |
| **Ablation** | Project onto orthogonal complement | Remove the concept |

These are the three basic linear operations on a one-dimensional subspace (a direction). Reading projects the activation onto the subspace to measure its component. Addition translates along the subspace to shift toward the concept. Ablation projects onto the orthogonal complement to eliminate the concept.{% sidenote "The geometric perspective is illuminating. In a high-dimensional activation space, a concept direction defines a one-dimensional subspace. Reading, addition, and ablation are the three fundamental linear operations on this subspace. More sophisticated operations (like those in LEACE) extend this geometry to higher-dimensional subspaces." %}

## Safety Applications

Representation control enables both understanding and manipulating safety-relevant properties:

- **Honesty.** Read whether the model's representations encode truthfulness, then steer toward honesty. The honesty direction can distinguish when a model "knows" it is generating false information.

- **Harmlessness.** Detect tendencies to generate harmful content, then control them. The harmlessness direction separates harmful from harmless response trajectories.

- **Sycophancy.** Identify the direction that encodes "agree with the user regardless of accuracy," then ablate or reverse it to promote truthfulness.

- **Refusal.** In one study of 13 models, a [refusal direction](/topics/refusal-direction/) mediated much of the measured refusal behavior, making it a useful example of low-dimensional control with clear safety implications.

## Causal Validation

Representation control provides a methodology for establishing causal claims about model behavior:

1. **Identify the direction** via probing ([CAA](/topics/caa-method/), [LAT](/topics/lat-probing/)).
2. **Test sufficiency** via [addition](/topics/addition-steering/): does adding the direction cause the behavior?
3. **Test necessity** via [ablation](/topics/ablation-steering/): does removing the direction prevent the behavior?

A direction that passes both tests has evidence for causal mediation under those interventions. This follows the logic of [activation patching](/topics/activation-patching/), but applies it to a direction rather than a named model component.

<details class="pause-and-think">
<summary>Pause and think: The limits of linear control</summary>

Representation control assumes that high-level behavioral concepts are represented as linear directions in activation space. Under what circumstances might this assumption fail? What kinds of behaviors might resist linear control?

The assumption likely fails for behaviors that are highly context-dependent or compositional. "Be helpful" might require different strategies in different contexts, making it difficult to capture with a single direction. Similarly, behaviors defined by the *absence* of something (e.g., "do not discuss topic X") may not have clean linear representations. Conditional behaviors ("be honest unless X") are inherently non-linear.

</details>

## Combining Operations

Representation control operations can be combined:

- **Add multiple directions** to induce multiple behaviors simultaneously.
- **Ablate one direction while adding another** to replace one behavior with a different one.
- **Layer-specific interventions** to target where concepts are most malleable.

The [function vectors](/topics/function-vectors/) work shows that even complex *tasks* (not just concepts) can be represented as directions and combined through addition.

## Implications for Alignment

Representation control creates several possibilities and risks for AI safety:

**Understanding:** We can now ask precise questions about what safety-relevant concepts a model represents and where.

**Control:** We have tools to steer behavior without retraining, useful for rapid iteration and deployment-time adjustments.

**Vulnerability:** The same tools that help us understand safety mechanisms can bypass them. The [refusal direction](/topics/refusal-direction/) can be ablated with one operation.

The same access that supports diagnosis can also support bypasses. Any safety case using representation control must therefore account for who can apply interventions and how easily the targeted mechanism can be reconstructed or routed around.

<details class="pause-and-think">
<summary>Pause and think: Designing robust safety mechanisms</summary>

If safety behaviors are encoded as linear directions that can be ablated, how might we design more robust safety mechanisms? Is it possible to make safety behaviors resistant to linear ablation while maintaining the interpretable, linear structure that makes models useful?

One approach is to encode safety redundantly across several interacting components, so removing one direction does not remove the behavior. Redundancy does not inherently prevent interpretation, but it makes both analysis and intervention more demanding. Another possibility is to couple safety behavior to representations used for general capabilities, so bypassing safety also damages performance. That could improve tamper resistance while making legitimate customization harder.

</details>

## A Linear Toolkit

Representation control and [probing methods](/topics/caa-method/) provide a compact toolkit for one-dimensional linear representations:

- **Probe** with [CAA](/topics/caa-method/) and [LAT](/topics/lat-probing/) to identify concept directions.
- **Add** with [addition steering](/topics/addition-steering/) to induce behaviors.
- **Remove** with [ablation steering](/topics/ablation-steering/) to disable behaviors.
- **Erase** with [LEACE](/topics/concept-erasure/) for mathematically guaranteed removal.

This toolkit extends to naturally occurring directions like [function vectors](/topics/function-vectors/), showing that the same geometric structure underlies both engineered interventions and the model's own learned computations.
