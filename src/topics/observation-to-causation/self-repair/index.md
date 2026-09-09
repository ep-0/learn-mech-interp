---
title: "Self-Repair in Language Models"
description: "How later components compensate for an ablation, why that can hide a component's causal role, and how to interpret intervention results more carefully."
order: 5
prerequisites:
  - title: "Activation Patching and Causal Interventions"
    url: "/topics/activation-patching/"

glossary:
  - term: "Self-Repair"
    definition: "The phenomenon where ablating or patching a model component causes later components to compensate, partially restoring the original behavior. Self-repair means that ablation effects systematically understate component importance."

exitCriteria:
  - task: "Name the three sources of self-repair identified in GPT-2 Small, say which requires no learned behavior at all, and state what the third tells you about the state of the field."
    answer: |
      1. **LayerNorm rescaling.** Removing a component changes the residual stream's magnitude, so the normalization divides by a different $\sigma$ and the surviving contributions are scaled up. This is purely mechanical — it follows from the architecture and requires no learned compensation whatsoever. It accounts for a substantial fraction of measured self-repair, and its direction and size depend on the removed vector, so it should be measured rather than assumed.
      2. **Backup heads.** Heads that contribute little under normal operation increase their contribution once the primaries are ablated. This is input-dependent and looks like learned redundancy, though "backup" describes the intervention result rather than establishing that training created a spare on purpose.
      3. **An unexplained residual.** After accounting for both, a significant fraction remains uncharacterized.

      That third category is the honest part of the finding. It means the correction we apply to ablation results is itself incomplete: we can name two mechanisms and quantify them, and we still cannot fully predict how much of a measured ablation effect is real. Every ablation number in the literature carries an error bar of unknown size for this reason.
  - task: "You ablate component A. Behavior barely changes, but attribution shifts substantially toward components B, C, and D. State what this establishes and what it does not."
    answer: |
      **Establishes:** the *intervened* network can produce the behavior without A, by routing through B, C, and D. The network has a reorganization capacity you have now measured.

      **Does not establish:** that A was unimportant in the intact run. You have two different networks — the original and the one missing A — and you observed the second. The near-zero behavioral change tells you about the second network's competence, not about the first network's mechanism. This is the Hydra effect: cut off one head and others grow, so the output survives while the internal pathway has changed completely.

      The error this guards against is the standard reading of a null ablation result: "removing it didn't matter, so it wasn't doing anything." In a system with redundancy, that inference is invalid in general, and the attribution shift is the evidence that it fails here specifically.

      What closes the gap is mapping *both* computations — attribution in the intact run and in the intervened run — and reporting the difference. If B, C, and D carried little of the effect before and much of it after, you have identified a primary pathway and its recruited backups, which is a stronger result than either measurement alone.
  - task: "Explain why denoising is less vulnerable to self-repair than noising, and say why \"less vulnerable\" is not \"immune.\""
    answer: |
      Denoising starts from the corrupted run and restores a clean activation. The corrupted run typically lacks the compensatory structures that the clean run has — the backup heads that would fire in response to a disruption are responding to a state that was already disrupted before your intervention, not to your intervention. So the measured recovery is less likely to be masked by a component quietly taking over.

      Noising starts from the intact clean run and breaks something. That is precisely the condition self-repair responds to: LayerNorm rescales, backups activate, and the damage you inflicted is partly undone before it reaches the output. The measured effect is a lower bound of unknown tightness.

      **Why not immune:** denoising is still an intervention, and it still produces a network state that no input would produce. Restoring one clean activation into an otherwise-corrupted run creates an inconsistent context — the patched value was computed under surroundings that are no longer present — and downstream components respond to that inconsistency too. The compensation dynamics are different, not absent.

      The practical answer is to run both directions and report the disagreement, since the asymmetry itself is informative about circuit structure.
  - task: "Rewrite the claim \"head 9.9 accounts for 30% of the IOI behavior\" as a defensible report, and list what the rewrite must specify."
    answer: |
      **Defensible version:** "On the IOI prompt distribution described above, with logit difference as the metric, mean-ablating head 9.9 reduces the clean logit difference by 30%. Attribution in the ablated run shifts toward heads 10.2 and 11.2, indicating partial compensation, so this figure is a lower bound on the head's contribution to the intact computation."

      What the rewrite has to specify:

      - **The intervention and its direction** — ablation versus patching, noising versus denoising.
      - **The baseline** — zero, mean, resample, or a specific counterfactual run. The number changes with this choice, sometimes substantially.
      - **The metric** — logit difference, probability, loss. Probability would have missed negative components entirely.
      - **The distribution** — which prompts, how many, and how varied. A number from one prompt is an anecdote.
      - **Evidence about compensation** — whether downstream attribution moved, which converts an unqualified number into a bounded one.

      The original phrasing fails because "accounts for 30% of the behavior" implies a decomposition of the behavior into shares that sum to a whole. No such decomposition exists when components interact, and stating it that way invites readers to add percentages that were never additive.

furtherReading:
  - title: "McGrath et al., *The Hydra Effect: Emergent Self-Repair in Language Model Computations*"
    url: "https://arxiv.org/abs/2307.15771"
    note: "The full result, including the erasure and downstream-compensation measurements."
  - title: "Rushing & Nanda, *Explorations of Self-Repair in Language Models*"
    url: "https://arxiv.org/abs/2402.15390"
    note: "Self-repair traced to LayerNorm rescaling and to specific head families, which is the mechanistic account this article summarizes."
  - title: "Wang et al., *Interpretability in the Wild*, the backup name mover sections"
    url: "https://arxiv.org/abs/2211.00593"
    note: "Where the phenomenon was first noticed, in a circuit that had already been carefully traced."
  - title: "Chan et al., *Causal Scrubbing*"
    url: "https://www.alignmentforum.org/posts/JvZhhzycHu2Yd57RN/causal-scrubbing-a-method-for-rigorously-testing"
    note: "A methodology built to survive compensation effects, rather than mitigating them after the fact."
---

## The Compensation Problem

[Activation patching](/topics/activation-patching/) and ablation are the primary tools for establishing which model components matter for a behavior. The logic is simple: remove a component, measure the damage. If performance drops, the component was important. If it does not, the component was not needed.

But this logic has a hidden assumption: that removing a component reveals its true contribution. What if later components *compensate* for the removal, partially restoring the behavior we just disrupted? The measured effect would understate the component's actual importance. We would conclude "this head accounts for 30% of the logit difference" when the true figure is substantially higher, with the gap hidden by downstream compensation.

This is **self-repair**: the phenomenon where ablating a model component triggers compensatory changes in later components that partially restore the original output {% cite "mcgrath2023hydra" %}. Self-repair is not a rare edge case. It appears to be a general property of transformer language models, and it affects the interpretation of every ablation experiment.

> **Self-Repair:** When a model component is ablated, later components adjust their behavior to partially compensate, restoring some fraction of the original output. The ablation effect measured at the output is therefore a lower bound on the component's true importance.

## Known Mechanisms

Rushing and Nanda {% cite "rushing2024selfrepair" %} systematically investigated self-repair in GPT-2 Small by ablating individual attention heads and measuring how later layers responded. They identified three sources of compensation, each contributing a different fraction of the observed self-repair.

**LayerNorm rescaling.** Removing a component changes the residual stream's magnitude, so subsequent LayerNorm operations rescale the remaining contributions. This mechanical effect can amplify surviving signals without any learned adjustment by later components. In the reported experiments, it accounts for a substantial fraction of measured self-repair in some settings.{% sidenote "LayerNorm rescaling follows from the architecture, but the direction and size of its effect depend on the removed vector and the remaining residual stream. It should be measured rather than assumed to compensate every ablation." %}

**Backup heads.** Some attention heads contribute little under ordinary IOI prompts but increase their name-copying contribution after primary Name Movers are ablated. This input-dependent response behaves like learned redundancy, although “backup” is a functional description of the intervention result rather than proof that training explicitly created a spare component.

**Unexplained residual.** Even after accounting for LayerNorm rescaling and backup heads, a significant fraction of self-repair remains unexplained. Later MLP layers and attention heads adjust their outputs in ways that partially compensate for the ablation, but the mechanisms driving these adjustments are not yet fully characterized. This is an active area of research.

<details class="pause-and-think">
<summary>Pause and think: Why does self-repair exist?</summary>

Why would gradient descent produce models that compensate for ablated components? After all, components are not ablated during training. What training pressure could give rise to this behavior?

One hypothesis: self-repair is a byproduct of redundancy that the model develops for robustness. If multiple components contribute to the same output, the model's loss is smoother and more robust to variation in any single component's output. During training, the model may learn overlapping representations because they improve the expected loss across the training distribution, even though no component is ever fully ablated during training. The result is that partial removal of one component leaves enough residual signal for later components to work with, producing compensation that looks like self-repair.

</details>

## Implications for Ablation Experiments

Self-repair has direct consequences for how we interpret causal experiments.

**Ablation effects can understate a component's normal role.** If later components compensate after a head is removed, a 30% drop in logit difference may be smaller than the head's contribution in the intact run. “True contribution” is not always a single well-defined number when components interact, and out-of-distribution ablations can also create exaggerated effects. The result must be interpreted together with the replacement baseline and evidence for compensation.

**Noising and denoising answer different counterfactuals.** Replacing a clean activation with a corrupted one can trigger downstream responses that were absent in the intact run. Restoring a clean activation to a corrupted run begins from a different surrounding state and may recruit different pathways. Comparing both directions can reveal this asymmetry; neither direction is universally immune to self-repair.

**Iterated ablation can reveal hidden structure.** A component that matters only after the primary path is damaged may look unimportant in a one-at-a-time screen. Researchers can remove a primary component and rerun attribution or patching to search for newly important backups. The number of combinations grows quickly, so this procedure improves coverage without making it exhaustive.

**Mean and resample ablation change the confounds.** Zero ablation may create an unusual activation. [Mean ablation and resample ablation](/topics/activation-patching/) use values drawn from, or summarized over, the observed distribution and can reduce that problem. They introduce their own counterfactual assumptions, however: a resampled value may be plausible marginally while inconsistent with the rest of the current input.{% sidenote "Resample ablation replaces the component with a value from another input. Multiple draws can estimate sensitivity to the replacement, but no baseline is automatically the correct one. The right choice depends on which information the intervention is meant to remove while preserving other structure." %}

## The Hydra Effect

McGrath et al. {% cite "mcgrath2023hydra" %} named the phenomenon after the mythological Hydra: cut off one head and two grow back. The name captures an important aspect of self-repair that goes beyond simple compensation.

In some cases, ablating a component does more than trigger a larger write from an existing backup. Downstream attribution can shift toward different components, which is consistent with reorganization of the computation. The output may remain similar even though the measured internal pathway has changed.

Suppose ablating component A shifts the effect toward components B, C, and D. A small behavioral change would not show that A was unimportant in the intact run; it would show that the intervened network can preserve the behavior. Mapping both the intact and intervened computations helps separate the primary pathway from recruited backups.

## Partial Mitigations

No current technique fully solves the self-repair problem, but several approaches reduce its impact.

**Use denoising over noising when possible.** Denoising (patching clean activations into a corrupted run) is less affected by self-repair because the corrupted baseline typically lacks the compensatory structures present in the clean run.

**Compare multiple ablation baselines.** If zero ablation, mean ablation, and resample ablation all agree on a component's importance, the result is more robust. If they disagree, the difference may indicate self-repair artifacts.

**Report the intervention, not an intrinsic percentage.** Avoid “head X accounts for exactly 30% of the behavior.” Say “under this replacement baseline, ablating head X reduces the logit difference by 30%,” then report any evidence that downstream components compensated.

**Look for backup mechanisms explicitly.** After identifying primary circuit components, ablate them and re-run attribution methods on the remaining model to search for backup components that activate only when the primaries are removed.

## Looking Ahead

Self-repair is one of several phenomena that complicate the interpretation of causal experiments in neural networks. [Copy suppression](/topics/copy-suppression/), where heads actively suppress predictions of previously seen tokens, provides another example of a mechanism that interacts with ablation experiments in non-obvious ways. Together, these phenomena underscore that transformers are not simple feed-forward systems where removing a component cleanly excises its contribution. They are adaptive systems with redundancy, compensation, and reorganization built in. Interpreting them requires accounting for these dynamics.
