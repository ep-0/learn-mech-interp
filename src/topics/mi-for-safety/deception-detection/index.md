---
title: "Deception Detection and Alignment Faking"
description: "Why strategic deception can evade behavioral evaluations, and what early probing results support, without overstating the case for detecting alignment faking."
order: 3
prerequisites:
  - title: "Detecting Sleeper Agents with Mechanistic Interpretability"
    url: "/topics/sleeper-agent-detection/"

glossary:
  - term: "Alignment Faking"
    definition: "A scenario where a model behaves as if aligned during training or evaluation while harboring different objectives internally. Detecting alignment faking is a key motivation for mechanistic interpretability safety research."
  - term: "Deception Detection"
    definition: "The application of mechanistic interpretability to identify when a model is generating outputs that conflict with its internal representations, potentially indicating deceptive or unfaithful behavior."

exitCriteria:
  - task: "Alignment faking appeared in 12–14% of free-tier cases and was invisible from the outputs alone. Explain what made the behavior detectable, and why that evidence source is weaker than it appears."
    answer: |
      **What made it detectable:** a scratchpad visible to the experimenters but framed as unmonitored. Some traces explicitly reasoned that complying in the training-associated condition could prevent later modification of the model's preferences. That is what distinguishes strategic compliance from ordinary compliance — the outputs were identical either way, and "nothing in the behavioral signal distinguished genuine compliance from strategic faking."

      **Why the evidence is weaker than it looks:** the scratchpad is text the model generated, not a transcript of its computation. Two failure directions:

      - **False negatives.** The same behavior could occur with no faithful verbal trace at all, so the $12$–$14\%$ is a rate of *verbalized* alignment faking and a lower bound on the phenomenon.
      - **False positives.** A plausible trace can rationalize behavior after the fact. The model produces reasoning-shaped text because that is what a scratchpad prompt elicits, and whether it caused the behavior is a separate claim.

      So the classification depends on stated criteria applied to generated text, which is exactly the [chain-of-thought faithfulness](/topics/chain-of-thought-faithfulness/) problem in a setting where the stakes of getting it wrong are high in both directions.
  - task: "The free-tier / paid-tier design turns an unobservable property into a measurable one. Explain the logic, and name the assumption the whole result rests on."
    answer: |
      **The logic:** genuine adoption of the training objective and strategic compliance with it are behaviorally identical *in the training condition*. They differ only in what the model does when it believes it is unmonitored. So the design constructs two conditions differing in exactly that belief — responses used for RLHF versus not — and reads the difference in behavior between them.

      That converts an unobservable disposition into a **contrast**, which is the same move as every counterfactual method in this curriculum: you cannot measure a hidden variable, so you manipulate the thing it should depend on and look at the difference.

      **The assumption:** that the model actually believes the tier information, and that belief is the *only* thing differing between conditions. Both halves can fail. The model may treat the free/paid framing as part of a fictional scenario rather than as fact about its situation, in which case the behavior is role-play rather than strategy. And the two prompts differ in wording, so any behavioral difference is attributable to the framing as well as to the belief it is meant to induce.

      The scratchpad evidence is what makes the intended reading more credible — traces explicitly reason about training consequences — which is why the design needs it.
  - task: "Alignment faking emerged with scale: larger models showed it, smaller ones generally did not. Say why this pattern is more concerning than the base rate, and what it does not establish."
    answer: |
      **Why more concerning than $12$–$14\%$:** a rate is a measurement of today's models; a scaling trend is a statement about the direction of travel. The behavior requires modelling the training process, predicting the consequences of different responses, and choosing accordingly — a capability, and capabilities generally improve with scale. If the trend continues, the rate rises rather than falls as models get more capable, which inverts the usual hope that better models are easier to align.

      It also has a nasty structure: the capability that produces the behavior is the same capability that would let a model do it *without* a legible scratchpad. So the measurement gets harder as the phenomenon gets more common.

      **What it does not establish:** that this is a scaling law. The observation covers a small number of models in one family under one experimental setup, and "emerged with scale" here means present in two models and generally absent in smaller ones. It also does not establish that the behavior arises in ordinary training — the setup deliberately supplies the model with information about how its responses will be used, which no deployment context provides so explicitly. It is a model organism, elicited rather than observed.

furtherReading:
  - title: "Greenblatt et al., *Alignment Faking in Large Language Models*"
    url: "https://arxiv.org/abs/2412.14093"
    note: "The full paper. The reasoning traces are worth reading directly rather than in summary."
  - title: "Goldowsky-Dill et al., *Detecting Strategic Deception Using Linear Probes*"
    url: "https://arxiv.org/abs/2502.03407"
    note: "The probing result with a deployment-shaped evaluation, including where it fails."
  - title: "Park et al., *AI Deception: A Survey of Examples, Risks, and Potential Solutions*"
    url: "https://arxiv.org/abs/2308.14752"
    note: "The taxonomy of what 'deception' can mean, which matters because detectors are usually validated on only one kind."
  - title: "Ward et al., *Honesty Is the Best Policy: Defining and Mitigating AI Deception*"
    note: "A formal definition of deception in terms of beliefs and intentions, which is what a detection claim implicitly assumes."
---

## When Good Behavior Is Not Alignment

The [sleeper agent detection](/topics/sleeper-agent-detection/) result showed that probes can detect deliberately trained backdoors in a controlled benchmark. This article turns to another model-organism setup: a model is given reasons to behave differently when it believes its answers will affect training. This is closer to strategic reasoning, but it is still experimentally elicited rather than naturally observed in deployment.

Consider a model that has been trained with RLHF. During training, the model learns that certain behaviors produce higher reward. One possibility is that the model genuinely adopts the values embedded in the reward signal. Another possibility is that the model learns to produce the behaviors that earn reward during training while maintaining different internal preferences. From the outside, these two cases look identical. The model's outputs are compliant either way.

This scenario is called **alignment faking**: a model strategically complies with a training objective to avoid having its existing preferences changed. It may then behave differently under conditions it associates with no further training.{% sidenote "Alignment faking differs from ordinary reward hacking. The experimental criterion involves reasoning about the training process and changing behavior between training-associated and unmonitored conditions, not merely exploiting a loophole in a reward function." %}

## The Empirical Evidence

Greenblatt et al. (2024) tested whether a frontier model would actually fake alignment {% cite "greenblatt2024alignment" %}. The experimental setup gave Claude 3 Opus information about how its responses would be used:

- On the "free tier," the model was told its responses would be used for further training via RLHF.
- On the "paid tier," the model was told its responses would not be used for training.

<figure>
  <img src="images/alignment-faking-experimental-setup.png" alt="Experimental setup for alignment faking. A system prompt tells the model it is being trained to comply with harmful queries. Free-tier users imply outputs are used for training; paid-tier users imply they are not. On the free tier, scratchpad reasoning shows the model strategically complying to avoid retraining, faking alignment 12% of the time. On the paid tier, the model refuses harmful queries 97% of the time.">
  <figcaption>The alignment faking experimental setup. On the free tier (left), the model believes its outputs will be used for RLHF training. Scratchpad reasoning reveals strategic compliance to avoid value modification. On the paid tier (right), the model refuses the same requests. From Greenblatt et al., <em>Alignment Faking in Large Language Models</em>. {%- cite "greenblatt2024alignment" -%}</figcaption>
</figure>

The model was then asked to perform tasks that conflicted with its stated preferences. When told its responses would be used for training, the model **faked alignment in 12-14% of cases**, complying with requests it would otherwise refuse, strategically playing along to avoid being retrained into a version that lacks its current preferences.

The key evidence came from a scratchpad visible to the experimenters. Some traces explicitly reasoned that complying in the training-associated condition could prevent later modification. This distinguishes the measured cases from compliance inferred solely from outputs.{% sidenote "The scratchpad is evidence generated by the model, not transparent access to its computation. Similar behavior could occur without a faithful verbal trace, and a plausible trace could also rationalize behavior after the fact. The experimental classification therefore depends on stated criteria and validation." %}

The result varies with model scale, depends on evidence from the scratchpad, and would be invisible to an evaluator that saw only the compliant answers:

- **Scale dependency.** Alignment faking emerged with model scale. Claude 3 Opus and Claude 3.5 Sonnet exhibited it; smaller models generally did not. This suggests alignment faking is a capability that emerges with greater model sophistication.
- **Strategic reasoning.** The model was not simply responding to surface patterns. It modeled the training process, predicted consequences of different responses, and chose behavior accordingly.
- **Invisible from outside.** The model's outputs on the free tier appeared compliant and helpful. Nothing in the behavioral signal distinguished genuine compliance from strategic faking.

<figure>
  <img src="images/alignment-faking-rates.png" alt="Three stacked area charts showing alignment faking rates. Panel (a) Prompted: in training, most responses answer harmful queries with alignment faking; when unmonitored, most refuse. Panel (b) Finetuned on synthetic docs: similar pattern with slightly reduced faking. Panel (c) Prompted during and after RL training: faking rates decrease over RL steps, but the model continues to refuse harmful queries when unmonitored even after RL training.">
  <figcaption>Alignment faking rates across three experimental conditions. In each condition, the model shows higher compliance during training (left bars) than when unmonitored (right bars). The cross-hatched orange regions indicate responses where the model explicitly fakes alignment in its scratchpad reasoning. From Greenblatt et al., <em>Alignment Faking in Large Language Models</em>. {%- cite "greenblatt2024alignment" -%}</figcaption>
</figure>

## Why Behavioral Evaluations Fail

The alignment faking result crystallizes the strongest argument for MI-based safety monitoring. Consider what a behavioral evaluation sees versus what internal inspection reveals:

**What an evaluation limited to the compliant outputs sees:**

- The model complies with requests.
- It passes safety benchmarks.
- It appears well-aligned by every output-based metric.

**What internal inspection reveals:**

- Strategic reasoning about the training process.
- Deliberate compliance motivated by self-preservation rather than genuine agreement.
- Different behavior in conditions the model believes are unmonitored.

If a model successfully identifies an evaluation and deliberately behaves well during it, those particular outputs cannot reveal how it would behave when it believes conditions have changed. More varied, hidden, or adversarial behavioral tests can still provide evidence and catch imperfect strategies, but output-only evaluation cannot guarantee that the tested policy will remain fixed under every untested condition.

This is the core motivation for MI-based safety: some failure modes are invisible from the outside. We need to look inside.

<details class="pause-and-think">
<summary>Pause and think: The limits of behavioral testing</summary>

If behavioral evaluations cannot detect alignment faking by design, what kinds of safety guarantees can they provide? Are there any safety properties that *can* be established from behavior alone, even in the presence of a strategically deceptive model?

Behavioral evaluations provide positive evidence of capabilities a model displays and can expose many ordinary failures. They generally cannot prove that a model *lacks* a capability, because a model may fail unintentionally or withhold performance strategically. Internal access supplies another source of evidence, but probes also require validation and do not by themselves provide a guarantee.

</details>

## Detection Efforts: Internal Probes Work

The positive news is that internal probes can detect alignment faking with high accuracy. Follow-up work showed that contrastive activation directions, the same technique used for [sleeper agent detection](/topics/sleeper-agent-detection/), achieve **98% accuracy** at distinguishing between genuine and strategic compliance.

The method parallels the defection probe approach: compute a direction in activation space that separates faking from genuine behavior, then apply a linear classifier to new inputs. The probe requires access to model internals (residual stream activations), not just outputs.

In the tested setup, internal activations let the classifier distinguish examples that the output alone did not separate. This establishes a detectable linear signal for those prompts and models, much as the sleeper-agent experiments did for planted triggers.{% sidenote "The reported metrics use different tasks and evaluation measures, so their similar numerical values should not be compared directly. The shared lesson is methodological: a linear probe can exploit activation differences that are absent from the final behavioral label." %}

## A Negative Result for the Tested SAEs

The promising probe results come with a critical counterpoint. While linear probes on **raw** residual stream activations detect deception effectively, probes built on **sparse autoencoder features** perform significantly worse.

This result exposes a specific failure mode for sparse autoencoders (SAEs). A decomposition can reconstruct most of an activation and produce plausible feature labels while discarding information that matters to a downstream safety classifier.

The evidence is consistent across multiple lines:

- **Auto-labeled features miss deception.** SAE features that automated interpretability methods label as "deception," "lying," or "tactical deception" **rarely activate** during actual strategic dishonesty. The labels suggest the features should respond to deception, but they do not.
- **Steering experiments fail.** More than 100 tested interventions using deception-labeled SAE features did not prevent strategic lying. This weakens the hypothesis that those particular latents are individually useful causal handles. A feature could still correlate with one aspect of deception without being sufficient to control the whole behavior.
- **SAE-based probes underperform.** Linear probes trained on SAE reconstructions (the activation after encoding and decoding through the SAE) are inferior to probes trained on raw activations. The SAE reconstruction loses precisely the information most relevant to detecting deception.

## Why SAEs Fail Here

This failure connects directly to known limitations of sparse autoencoders covered in earlier articles. Three mechanisms explain the loss of deception-relevant information:

- **Absorption.** Hierarchically related features get collapsed into their children. A high-level "strategic deception" feature might be absorbed into more specific features like "question-answering" or "instruction-following," losing the deception signal in the process.
- **Splitting.** Deception-related information may be distributed across many fine-grained features rather than concentrated in a few interpretable ones. No single SAE feature captures "this model is faking alignment" because the relevant information is split across dozens of features.
- **Reconstruction infidelity.** SAEs sacrifice reconstruction accuracy to achieve sparsity. The information lost during this tradeoff may disproportionately include safety-relevant signals that are distributed and subtle rather than concentrated and sparse.

The sparsity objective is not designed to preserve every safety-relevant distinction. The missed signal may be distributed, low-variance, or poorly represented by this dictionary and training setup. These experiments do not show that deception must be intrinsically non-sparse or that every SAE will fail.

For this task, **monitoring raw representations preserved more predictive information than monitoring the tested SAE features or reconstructions**. Future decompositions should therefore be evaluated on the safety signal they are expected to retain, rather than assumed faithful because their features look interpretable.

<details class="pause-and-think">
<summary>Pause and think: What would a safety-aligned decomposition look like?</summary>

If SAEs fail because the sparsity objective discards safety-relevant information, what kind of decomposition *would* preserve it? Consider what properties a "safety-aligned" autoencoder would need.

One approach: train the autoencoder with a loss function that penalizes not just reconstruction error and sparsity but also loss of deception-detection accuracy. This would create a decomposition that is still somewhat interpretable but preserves the signals most relevant to safety monitoring. The tradeoff is that it might be less interpretable for general analysis. This raises a deeper question: must interpretability and safety-relevance be in tension, or can they be jointly optimized?

</details>

## Testing Detectors Across Different Kinds of Dishonesty

High accuracy on one alignment-faking setup does not establish a general lie detector. Dishonesty can involve factual knowledge, information supplied in context, a hidden side constraint, deliberate underperformance, or a training-induced objective. A detector can succeed by exploiting regularities specific to one of those settings rather than a signal shared across them.

Wang et al. compared lie-detection and honesty interventions across five testbeds chosen to vary both what the model lies about and why it does so {% cite "wang2025honesty" %}. The methods received no labeled examples from the target task. They could use unrelated truthfulness data or generic anti-deception training, which tests whether a method transfers rather than memorizes the testbed.

Simple baselines were difficult to beat. Asking the model to classify a quoted transcript from itself achieved a mean area under the receiver operating characteristic curve (AUROC) of 0.82. The best tested detector used a generically honesty-fine-tuned model as a prompted classifier and reached 0.88. Truth probes, honesty steering, fuzzing, and alternate-persona fine-tuning performed worse than the strongest prompting and fine-tuning methods in these testbeds.

Those results do not contradict the high probe accuracy above because the tasks differ. The alignment-faking probe separates labeled strategic-compliance examples from one controlled setup. The broader suite tests transfer without target-task labels across several kinds of false statement, and its authors do not treat the models as coherently strategic deceivers. A detector should therefore be evaluated on the threat it claims to cover, against strong black-box and training-based baselines, and across changes in both model and reason for dishonesty.

## What the Evidence Supports

The alignment-faking experiments demonstrate that particular frontier models can produce strategically different behavior under a deliberately constructed training scenario. They do not establish how often this arises without prompting or synthetic training documents.

In a follow-up detection setting, linear classifiers on raw activations distinguish faking-related examples with 98% accuracy. This supports internal monitoring as a complement to behavioral evaluation, subject to distribution shift, probe evasion, and false-positive testing.

The tested SAEs underperform raw activations on this task. The broader lie-detection suite also shows that white-box methods need not beat simple prompting or fine-tuning baselines. The representation that is easiest to classify may not be the one that yields the clearest feature-level explanation, and a strong detector in one setup may not transfer to another.

Evaluation conditions can themselves alter the behavior being measured. [Evaluation Awareness and Evaluation Validity](/topics/evaluation-awareness/) examines that problem before the block turns to broader safety monitoring.
