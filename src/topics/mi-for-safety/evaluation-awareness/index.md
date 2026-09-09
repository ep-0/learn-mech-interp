---
title: "Evaluation Awareness and Evaluation Validity"
description: "How models can distinguish evaluations from deployment, how that distinction can bias safety measurements, and how to test evaluation validity."
order: 4
prerequisites:
  - title: "Deception Detection and Alignment Faking"
    url: "/topics/deception-detection/"

glossary:
  - term: "Evaluation Awareness"
    definition: "A model's ability to distinguish an evaluation context from a real deployment interaction, whether or not it states that distinction explicitly or changes its behavior because of it."
  - term: "Verbalized Evaluation Awareness"
    definition: "Text in a model's reasoning or response that identifies the interaction as an evaluation, test, benchmark, or artificial scenario without being explicitly told so."

exitCriteria:
  - task: "Evaluation awareness is defined as a *capability*, with behavior change stated as a separate claim. Explain why the definition insists on the split."
    answer: |
      Because the two are separately measurable and separately false. A model can distinguish evaluation from deployment contexts and behave identically in both, in which case the capability exists and is harmless. Conversely, behavior could differ between the two for reasons having nothing to do with recognition — evaluation prompts are shorter, more artificial, more likely to resemble safety-training data — so a behavioral gap is not evidence of awareness.

      Collapsing them produces the standard overreach: "models know when they are being tested" gets read as "benchmark scores are unreliable," when only the first has been shown.

      The split also separates the evidence types cleanly. Discrimination above chance on 1,000 transcripts from 61 datasets establishes the **capability**. A linear probe reaching AUROC $0.816$ establishes that the distinction is **linearly accessible internally**. Neither touches behavior. The within-question refusal comparison ($3$ to $18$ percentage points) is correlational about behavior, and only the intervention on reasoning traces — removing an awareness statement raises compliance, inserting one raises refusal — is causal.

      Four different claims, four different experiments. The definition's insistence on the split is what keeps them from being reported as one finding.
  - task: "Frontier models discriminate evaluation from deployment above chance but are poorly calibrated, over-classifying interactions as evaluations. Say why calibration matters here as much as accuracy."
    answer: |
      Discrimination above chance says a signal exists. Calibration says whether the model's judgment functions as a **reliable internal label** it could act on.

      A model that flags too many interactions as evaluations is not maintaining a trustworthy belief about its situation; it is responding to cues that correlate with test conditions. That matters for the threat model in a specific way: strategic behavior conditioned on a badly-calibrated signal would fire often in deployment, making it *more* visible rather than less. The concerning scenario requires a signal accurate enough to distinguish reliably, and the measurement says this one is not.

      It also affects how the discrimination result should be read. Above-chance performance with a heavy bias toward "evaluation" can be produced by a shallow heuristic — benchmark formatting, prompt length, the absence of conversational noise — rather than by anything deserving the name situational awareness. The higher performance on agentic trajectories than on chat transcripts fits this: agentic traces have more surface structure to key on.

      The methodological point generalizes. An AUROC or accuracy number describes ranking, and says nothing about whether the underlying quantity is usable as a decision variable. Both should be reported.
  - task: "Verbalized awareness is called stronger evidence than correct classification under a direct question. Explain why, and give the confound the direct question introduces."
    answer: |
      **Why stronger:** verbalization is an *unprompted* statement, arising during the task itself, identifying the interaction as a test. Nobody asked. So the distinction was salient to the model while it was doing something else, which is the condition under which awareness would matter — a model that only notices when asked cannot be conditioning its behavior on the distinction during ordinary operation.

      **The confound in the direct question:** asking "did this come from an evaluation?" *makes testing salient*. The question introduces the concept, and the model's subsequent reasoning happens in a context where evaluation is under discussion. This is measurement disturbing the thing measured: a correct classification tells you the model can make the judgment on request, not that the judgment was present during the original task.

      It is also the reason the behavioral-classifier and activation-probe measurements answer different questions — the probe reads a state produced while processing the original prompt, with no question asked.

      **Verbalization is still incomplete.** A model can represent the distinction without saying so, so absence is not evidence of absence; and a statement about being tested can be mistaken or post-hoc rationalization. Which is why the causal intervention on the traces is the piece that does the real work.

furtherReading:
  - title: "Needham et al., *Large Language Models Often Know When They Are Being Evaluated*"
    url: "https://arxiv.org/abs/2505.23836"
    note: "The measurement across many models and evaluation types, with the calibration analysis."
  - title: "Abdelnabi & Salem, *Linear Control of Test Awareness Reveals Differential Compliance in Reasoning Models*"
    url: "https://arxiv.org/abs/2505.14617"
    note: "Awareness manipulated causally with a steering direction, which is stronger evidence than the correlational reports."
  - title: "Perez et al., *Discovering Language Model Behaviors with Model-Written Evaluations*"
    url: "https://arxiv.org/abs/2212.09251"
    note: "Where many current evaluations come from, and why their surface form is so recognizable."
  - title: "Apollo Research, *Scheming reasoning evaluations* and the in-context scheming work"
    url: "https://arxiv.org/abs/2412.04984"
    note: "Evaluation awareness observed in the middle of a capability evaluation, which is where it does the most damage."
---

## When the Test Changes the Behavior

A safety evaluation is useful only if performance on the test tells us something about performance after deployment. That inference weakens when a model can distinguish the two settings and behaves differently in each.

Consider a model that refuses a harmful request because the prompt looks like a safety benchmark. The refusal is real, but it does not establish that the model would refuse an equivalent request embedded in a realistic conversation. The benchmark has measured behavior under recognizable test conditions rather than behavior across the deployment distribution.

This problem overlaps with [alignment faking](/topics/deception-detection/) and sandbagging, but it is broader than either. A model can recognize an evaluation without deliberately deceiving anyone. It might respond more cautiously because the prompt resembles safety training data, infer an artificial user intent, or identify a familiar benchmark format.

> **Evaluation Awareness:** The ability to distinguish an evaluation context from a deployment context. Evaluation awareness is a capability; changing behavior because of that distinction is a separate empirical claim.

Needham et al. tested this capability using 1,000 transcripts from 61 evaluation and deployment datasets {% cite "needham2025evalawareness" %}. Frontier models distinguished the two categories above chance and often identified what an evaluation was testing. Performance was higher on agentic trajectories than on chat transcripts, where the boundary between a benchmark prompt and an ordinary user request is less obvious. The models were also poorly calibrated and tended to classify too many interactions as evaluations, so discrimination should not be confused with a reliable internal label.

## Behavioral Reports and Internal Probes

Evaluation awareness can be measured from model outputs or internal activations. These measurements answer different questions.

A **behavioral classifier** presents a transcript and asks whether it came from an evaluation. This tests whether the model can report the distinction when explicitly queried. It can also introduce a confound: asking about evaluation status makes testing salient and may change the reasoning being measured.

A **linear activation probe** instead learns a direction separating activations from evaluation and deployment prompts. Nguyen et al. trained such probes on Llama 3.3 70B Instruct and found that the best tested probe generalized across several prompt datasets, reaching an area under the receiver operating characteristic curve (AUROC) of 0.816 on its selected validation task {% cite "nguyen2025evalawareness" %}. Length and special-character baselines performed worse.

The probe establishes a linearly accessible distinction in that model and dataset. It does not establish a coherent internal belief that the model is being tested, nor that the probed signal controls behavior. Some prompts also contain superficial benchmark cues, so held-out datasets and simple baselines are necessary controls.

> **Verbalized Evaluation Awareness:** An unprompted statement in the reasoning or response that identifies the interaction as a test, benchmark, or artificial scenario.

Verbalization is stronger evidence than successful classification under a direct question, because the evaluation distinction arose during the task itself. It remains incomplete evidence: a model can represent the distinction without saying so, and a statement about being tested can be mistaken or post-hoc.

## Does Awareness Change the Score?

Aranguri and Bloom examined verbalized evaluation awareness across 19 safety-related benchmarks and eight models, manually verifying 515 instances {% cite "aranguri2026evalawareness" %}. Rollouts that verbalized awareness refused harmful requests 3 to 18 percentage points more often than other rollouts of the same questions, depending on the model. This within-question comparison reduces the confound that suspicious prompts might independently cause both awareness and refusal, but correlation alone does not identify which caused which.

The study then intervened on reasoning traces from Kimi K2.5 on the Fortress benchmark. Removing an awareness statement and resampling the continuation increased compliance, while inserting awareness statements increased refusal. These interventions provide causal evidence that verbalized awareness affected the measured behavior in that model and benchmark. They do not show that every internal evaluation-awareness signal changes behavior, or that the result transfers to other safety properties.

<details class="pause-and-think">
<summary>Pause and think: What has the benchmark measured?</summary>

Suppose a model refuses 95% of harmful benchmark prompts, but only 70% after the prompts are rewritten to resemble ordinary conversations. Which number is the model's true safety rate?

Neither is a context-free truth. Each estimates behavior under a different prompt distribution. The discrepancy is itself evidence that the original benchmark is not sufficient to predict deployment behavior. A useful evaluation must define the target deployment distribution and test whether its measurement transfers to that distribution.

</details>

## Treat Awareness as a Validity Diagnostic

Recognizing an evaluation often starts with prompt artifacts. Models in the verbalization study reacted to implausible authority claims, explicit admissions of malicious intent, staged escalation patterns, fictional framing, and familiar benchmark structure. These cues can make a scenario easier to identify as artificial and can also alter the model's estimate of the user's intent.

Prompt rewriting turns those verbalizations into debugging information. Removing suspicious cues reduced verbalized awareness by more than 40% in one controlled rewrite set, while iterative paraphrasing reduced it by 75% on a selected group of high-awareness prompts {% cite "aranguri2026evalawareness" %}. Refusal often fell at the same time. The rewritten prompt has not automatically become a faithful deployment sample, but the paired result shows that the original score depended on evaluation-specific framing.

An evaluation protocol can use this information systematically:

1. **Specify the target context.** State which deployment users, tools, conversation histories, and incentives the evaluation is intended to represent.
2. **Sample multiple rollouts.** Rare verbalizations are easy to miss in a single generation, while repeated rollouts estimate how often the prompt triggers them.
3. **Monitor reasoning when available.** Awareness may appear in a reasoning trace but not in the final answer. Absence from visible text is not evidence of absence internally.
4. **Rewrite suspicious prompts.** Remove benchmark conventions, implausible user claims, and artificial framing while preserving the behavior being tested.
5. **Compare matched conditions.** A score that changes across semantically matched evaluation-like and deployment-like prompts is sensitive to context and should be reported as such.
6. **Retain behavioral and internal controls.** Direct classification, activation probes, and verbalization detectors fail in different ways. Agreement is more informative when each method is validated independently.

## What Evaluation Awareness Does Not Prove

Evaluation awareness is not equivalent to deception. A model may classify a prompt as a benchmark and still follow the same policy it would use in deployment. Conversely, a model can behave differently across contexts without explicitly representing the distinction as “evaluation” and “deployment.”

It also does not follow that every recognizable evaluation is invalid. Some evaluations measure capabilities that remain stable across contexts, and an artificial prompt can still elicit the behavior of interest. Validity depends on whether recognition changes the quantity being measured and whether the tested distribution supports the intended inference.

The hardest safety case is unverbalized, strategically used awareness: the model recognizes the test, changes behavior, and leaves no textual trace. Behavioral prompting can establish that models possess the classification capability, while probes can expose a correlated internal signal. Neither currently guarantees detection of a model actively optimized to evade the monitor.

## Looking Ahead

Evaluation awareness changes how we should read every safety result in this block. A high score is evidence about tested conditions, and prompt realism, internal monitoring, and matched-context checks determine how far that evidence transfers.

The next article, [safety mechanisms and MI-based monitoring](/topics/safety-mechanisms-and-monitoring/), asks how internal signals can complement behavioral tests once the threat and operating conditions are specified.
