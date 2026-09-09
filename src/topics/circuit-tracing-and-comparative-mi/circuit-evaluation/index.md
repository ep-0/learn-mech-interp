---
title: "Circuit Evaluation: Faithfulness, Completeness, and Minimality"
seoTitle: "Evaluating Circuits: Faithfulness and Completeness"
description: "How faithfulness, completeness, and minimality expose weaknesses in a proposed circuit, with redundancy and negative contributors from the IOI case study."
order: 5
prerequisites:
  - title: "The IOI Circuit: Discovery and Mechanism"
    url: "/topics/ioi-circuit/"
  - title: "KL Divergence and Mutual Information"
    url: "/topics/kl-divergence-and-mutual-information/"

glossary:
  - term: "Completeness (circuit)"
    definition: "A circuit evaluation criterion measuring whether the identified circuit accounts for all of the model's performance on a task. A complete circuit captures all relevant computation, with no important components left out."
  - term: "Faithfulness (circuit)"
    definition: "A circuit evaluation criterion measuring how well the circuit reproduces the full model's behavior when run in isolation. A faithful circuit produces similar outputs to the complete model on the target task."
  - term: "Minimality (circuit)"
    definition: "A circuit evaluation criterion measuring whether the circuit contains only components that are necessary for the task. A minimal circuit has no redundant parts whose removal would leave performance unchanged."

exitCriteria:
  - task: "The IOI circuit recovers about 87% of the full model's logit difference. Say what the missing 13% represents, and name two things the 87% figure does not establish."
    answer: |
      The $13\%$ is behavior produced by components outside the circuit — MLPs, which were largely not searched, and minor attention contributions below the discovery threshold. It is a measure of what the circuit-only run fails to reproduce, and it is a lower bound on what is missing, since components can cancel.

      **Two things it does not establish:**

      1. **That the circuit is the mechanism.** Faithfulness is a behavioral match under ablation of everything else. A different subgraph could reach $87\%$ by a different route; the criterion cannot distinguish extensionally equivalent accounts. The number says the circuit *suffices* to approximate the behavior, not that the intact model computes it this way.
      2. **That it generalizes.** The figure is measured on the IOI prompt distribution with this metric and this ablation baseline. A circuit faithful on templated prompts may capture a template-specific shortcut; the templates were varied, but variation within a family is not the same as unrestricted text.

      A third caution: $87\%$ is not $87\%$ of "the behavior" in any partitionable sense. Change the ablation baseline for the non-circuit components — zero, mean, resample — and the number moves.
  - task: "Ablating a Negative Name Mover head *improves* IOI performance on individual examples. Explain why this does not show the model would be better off without it."
    answer: |
      The model was not trained to maximize accuracy on IOI examples. It was trained to minimize expected cross-entropy over the whole pretraining distribution, and those objectives differ in a specific way: cross-entropy punishes **confident wrong** predictions far more than it rewards confident right ones, because $-\log p$ blows up as $p \to 0$ while flattening near $p \to 1$.

      That asymmetry makes hedging profitable. If the Name Movers are sometimes wrong — on other prompts, other names, other constructions — a head that shaves confidence off their predictions loses a little on the cases they get right and saves a lot on the cases they get wrong. The expected loss falls.

      So a head that looks counterproductive on IOI is optimizing the objective it was trained on, measured across a distribution your benchmark does not sample. Ablating it improves your metric and would raise the model's training loss.

      The general lesson: a component's function may be **distributional** rather than per-example, and any evaluation restricted to a task where the model succeeds will systematically misread such components. Copy suppression turns out to be the general form of this head class, serving calibration across pretraining rather than anything IOI-specific.
  - task: "Backup Name Movers were found by ablating the primaries and re-running attribution. Explain why the same method cannot rule out undiscovered backup mechanisms for the other head classes."
    answer: |
      Backups are invisible under normal operation by definition — they activate only when the components they back up are removed. So finding them requires ablating *the right set* first, and then looking.

      The search space is the set of subsets. Ablating one head at a time from $144$ is $144$ experiments; pairs are about $10{,}000$; and a backup that only activates when two specific heads are both gone is invisible to every one-at-a-time screen. The combinations grow exponentially, and there is no cheap criterion for which combination to try, because the thing you are looking for leaves no trace until you try it.

      The Backup Name Movers were found because someone ablated a *functionally coherent* group — the primary Name Movers — for an independent reason. That heuristic works when you already have a hypothesis about which components form a class. It offers no coverage guarantee: there could be backup S-Inhibition heads, or backup Duplicate Token heads, undiscovered because nobody ablated that particular set.

      This is a real limit on completeness claims, not a gap that better tooling closes. Any claim that a circuit contains everything that matters is a claim about ablations that were not run.
  - task: "Causal scrubbing is described as simultaneously too strict and too permissive. Explain how a single method can fail in both directions, and give the shape of a hypothesis that exploits each failure."
    answer: |
      The two failures come from opposite ends of hypothesis **specificity**, and the method's strictness scales with it.

      **Too strict.** A precise hypothesis licenses many resampling swaps, and each one is a chance to fail. A hypothesis that is useful and approximately right — correct about the main pathway, silent about a secondary contribution — will be rejected, because some swap it permitted degrades behavior more than the threshold allows. The exploit here is unintentional: a good, incomplete explanation gets a failing grade indistinguishable from a wrong one.

      **Too permissive.** A vague hypothesis licenses few swaps, because it makes few commitments about what each node computes. In the limit, a hypothesis saying "this node computes whatever it computes" permits only resampling from identical inputs, which trivially preserves behavior. The exploit is to under-specify: pass the test by claiming little.

      So the method does not measure correctness on a single axis. It measures how well a hypothesis's claimed invariances match the model's actual ones, and both over-claiming and under-claiming shift the result — in opposite directions.

      The deeper limitation is that no behavior-preservation test distinguishes extensionally equivalent hypotheses. That underdetermination is not specific to causal scrubbing; escaping it needs finer-grained interventions or inputs on which the rival accounts diverge.
  - task: "Faithfulness, completeness, and minimality pull against each other. Give a concrete case from the IOI circuit where improving one degrades another, and say what that implies about reporting a circuit."
    answer: |
      **Backup Name Movers, completeness against minimality.** Including them improves completeness: ablate the circuit and behavior should collapse, which it does more cleanly when the backups that would compensate are inside the circuit rather than outside it. It degrades minimality: they contribute nothing in the intact model, so a reader asking "what does this model do on IOI?" is handed components that are silent on every unperturbed forward pass.

      Whether they belong depends on what the circuit is meant to explain. If the target is the intact computation, they are out. If the target is behavior *under intervention* — which is what every ablation experiment actually measures — they are in.

      **Negative Name Movers, faithfulness against minimality.** Removing them raises task performance and simplifies the account, and it makes the circuit less faithful to what the model does.

      **What this implies for reporting:** there is no single circuit and no scalar score. A paper should state the behavior, the distribution, the interventions, and which criterion it optimized — and report the others rather than choosing whichever flatters the result. "87% faithful with 26 heads" is informative; "we found the IOI circuit" is not, because it hides every choice that determined which circuit was found.

furtherReading:
  - title: "Chan et al., *Causal Scrubbing*"
    url: "https://www.alignmentforum.org/posts/JvZhhzycHu2Yd57RN/causal-scrubbing-a-method-for-rigorously-testing"
    note: "The full method. Demanding to read and the most rigorous evaluation standard proposed so far."
  - title: "Miller, Chughtai & Saunders, *Transformer Circuit Evaluation Metrics Are Not Robust*"
    url: "https://arxiv.org/abs/2407.08734"
    note: "Faithfulness scores are highly sensitive to the ablation choice. Directly undercuts naive use of the three criteria, and this article does not say so."
  - title: "Shi et al., *Hypothesis Testing the Circuit Hypothesis in LLMs*"
    url: "https://arxiv.org/abs/2410.13032"
    note: "Circuit claims as statistical hypotheses with explicit nulls, which is the direction evaluation is heading."
  - title: "Mueller et al., *MIB: A Mechanistic Interpretability Benchmark*"
    url: "https://arxiv.org/abs/2504.13151"
    note: "A shared benchmark for circuit localization, so methods can be compared rather than each defended on its own example."
  - title: "Gelman & Loken, *The Garden of Forking Paths*"
    url: "https://sites.stat.columbia.edu/gelman/research/unpublished/forking.pdf"
    note: "Why a finding can be a false positive with no explicit multiple testing anywhere, because the analysis was chosen after seeing the data. Every source above is from inside interpretability; this is the outside view of what a circuit result's threshold, metric, corruption method, and layer choice add up to."
---

## Beyond Discovery

The [IOI circuit](/topics/ioi-circuit/) tells a compelling story: 26 heads in GPT-2 Small implement a three-step algorithm for identifying indirect objects. Duplicate Token Heads detect the repeated name, S-Inhibition Heads suppress it, and Name Mover Heads output the remaining name. But finding a circuit is only half the challenge. The harder question is: how do we know this account is *correct*?

A circuit hypothesis can fail in subtle ways. It might miss components that matter. It might include components that do not contribute. It might reproduce the right answer for the wrong reasons. Evaluating a circuit requires criteria that distinguish genuine mechanistic explanations from plausible-sounding narratives. Wang et al. proposed three such criteria {% cite "wang2022ioi" %}, and the IOI circuit itself reveals why evaluation is harder than it first appears.

## Negative Name Movers: Components That Work Against the Task

During direct logit attribution analysis, Wang et al. found something puzzling. Several heads in layers 10-11 have *negative* contributions to the logit difference. They push the model away from the correct answer (the indirect object) and toward the subject. These are the **Negative Name Mover Heads**, and they actively work against the circuit's task on individual examples.

Why would training produce heads that hurt performance? The leading hypothesis is **loss hedging**. Cross-entropy loss penalizes confident wrong predictions more harshly than uncertain correct ones. If the Name Movers sometimes make errors, Negative Name Movers reduce the confidence of those predictions, lowering the penalty.{% sidenote "Loss hedging is a statistical optimization, not an algorithmic one. The model's training objective is average cross-entropy loss across the entire training distribution, not accuracy on individual examples. Reducing prediction confidence on examples where the model might be wrong improves the expected loss, even though it slightly hurts performance on examples where the model is right." %}

The practical effect: ablating a Negative Name Mover actually *improves* IOI performance on individual examples. The model predicts the indirect object more confidently without the hedging. But this does not mean the model is better off without it, the hedging serves the training objective across the full distribution.

Negative Name Movers teach an important lesson: **circuits can contain components that appear counterproductive when viewed in isolation.** A head that hurts per-example performance may improve the model's expected loss across all training data. Naive DLA (which head helps most on this example?) can miss or misinterpret components whose function is distributional rather than per-example. Subsequent work has shown that Negative Name Movers are instances of a general [copy suppression](/topics/copy-suppression/) pattern: heads that attend to where a predicted token appears earlier in context and output the negative of that token's unembedding {% cite "mcdougall2023copy" %}. Copy suppression heads serve a calibration function across the full pre-training distribution, not just the IOI task.

## Backup Name Movers: Built-In Redundancy

Wang et al. made another surprising discovery during ablation experiments. When primary Name Mover Heads were ablated (outputs set to zero), the model's performance did not degrade as much as expected. Something was compensating.

Closer inspection revealed: certain heads that were nearly inactive in the normal circuit *activated* when the primary Name Movers were removed. These are the **Backup Name Mover Heads**. They have the same functional profile as regular Name Movers, they attend to name tokens, their OV circuits copy names to output logits, and they respond to S-Inhibition signals. But under normal operation, their attention weights are small and their contribution is minimal.{% sidenote "Backup Name Movers were discovered through an iterated ablation protocol: first ablate the primary Name Movers, then run DLA on the remaining heads. Previously quiet heads suddenly show large positive contributions. This is invisible under standard patching, since the backups do not activate unless the primaries are removed." %}

The discovery protocol illustrates the challenge:

1. Ablate the primary Name Mover Heads
2. Measure the logit difference, it drops, but not to zero
3. Run DLA on the remaining heads, previously quiet heads now show large positive contributions
4. These are the Backup Name Movers

Neural network redundancy has deep implications. The circuit can tolerate partial damage and still function. But it also means that standard [noising experiments](/topics/activation-patching/) underestimate the importance of primary components, because backups compensate silently. And it complicates the concept of "minimality", are backup components part of the circuit or not? This backup behavior is an instance of a general phenomenon called [self-repair](/topics/self-repair/): when a model component is ablated, later components compensate through multiple mechanisms, including LayerNorm rescaling and dormant backup heads {% cite "mcgrath2023hydra" %}.

<details class="pause-and-think">
<summary>Pause and think: The limits of standard ablation</summary>

Backup Name Movers are invisible under normal operation and only activate when primary Name Movers are ablated. What does this imply about our ability to find all components of a circuit using standard methods?

Standard ablation tests one component at a time, holding everything else fixed. But backup mechanisms only reveal themselves when specific primary components are removed. If we have not ablated the right combination of heads, the backups remain hidden. In principle, there could be backup mechanisms for other head classes (backup S-Inhibition Heads, backup Duplicate Token Heads) that have never been discovered because the right ablation combination was never tested. The number of possible ablation combinations grows exponentially, making exhaustive search infeasible. This is a fundamental limitation of current circuit analysis methods.

</details>

## The Expanded IOI Circuit Diagram

With all seven reported head classes included, we can inspect the expanded IOI circuit account:

1. **Previous Token Heads** (L0-1): shift token identity one position forward
2. **Duplicate Token Heads** (L0-1): detect same-token matches at S2
3. **Induction Heads** (L5-6): confirm the repeated name via K-composition
4. **S-Inhibition Heads** (L7-8): suppress Name Mover attention to the duplicated name
5. **Name Mover Heads** (L9-10): copy the attended name to output logits
6. **Negative Name Mover Heads** (L10-11): reduce prediction confidence (loss hedging)
7. **Backup Name Mover Heads**: dormant backups that activate when primary Name Movers fail

![The proposed IOI circuit diagram showing functional head classes and their connections](/topics/ioi-circuit/images/ioi_circuit_diagram.png "Figure 1: The proposed IOI circuit in GPT-2 Small, showing name movers, S-inhibition heads, duplicate token heads, induction heads, and their connections.")

The diagram shows information flowing top to bottom through the network. The detection stage (layers 0-6) identifies which name is duplicated. The suppression stage (layers 7-8) translates detection into inhibition. The output stage (layers 9-10) copies the surviving name. Negative Name Movers and Backup Name Movers add hedging and redundancy to the primary pathway.

## Evaluating Circuits: Three Criteria

Finding a circuit is a scientific claim: "these components implement this behavior." Like any scientific claim, it needs evaluation. Wang et al. proposed three criteria {% cite "wang2022ioi" %}:

> **Circuit Evaluation Criteria:** A circuit $C$ for a model $M$ on task $T$ should satisfy: *Faithfulness*, $C$ reproduces $M$'s behavior on $T$. *Completeness*, $C$ includes all components that matter for $T$. *Minimality*, $C$ includes no unnecessary components.

**Faithfulness** asks: does the circuit reproduce the full model's behavior? The test is to run the model with only the circuit components active (ablating everything else) and compare the output to the full model. The IOI circuit recovers approximately 87% of the full model's logit difference. This is good but not perfect, the remaining 13% comes from components outside the circuit, including MLPs and minor attention head contributions.

**Completeness** asks: does the circuit include everything that matters? The test is to ablate the circuit components (keeping everything else) and check if behavior collapses. Ablating the 26 IOI circuit heads reduces the logit difference dramatically, but not to zero. Some minor pathways outside the identified circuit also contribute. The circuit captures the primary mechanism but not every contributor.

**Minimality** asks whether a simpler subgraph explains the behavior just as well. Individual ablations are one test, but they are not decisive when components are redundant or interact. Backup Name Movers can compensate for primary Name Movers, while removing Negative Name Movers can improve the narrow task metric. The answer therefore depends on the behavior, distribution, and explanatory goal.

## The Tension Between Criteria

The three criteria pull in different directions. **Faithfulness vs. minimality**: adding components can improve behavioral agreement while making the account harder to interpret. The entire model is faithful to itself but is not a useful circuit explanation. **Completeness vs. minimality**: including backup mechanisms improves coverage but expands the graph. Whether backups count as part of “the circuit” depends on whether the target includes behavior under intervention.{% sidenote "This resembles a familiar tradeoff in scientific modeling. A detailed simulation may reproduce a system closely, while a simplified model may explain the regularity more clearly. Circuit analysis needs both predictive agreement and a useful level of abstraction." %}

There is no single right weighting of the criteria. They form a framework for stating what a circuit account preserves and omits, not a universal score. The IOI analysis reports about 87% faithfulness under its chosen evaluation and illustrates why completeness and minimality depend on definitions and interventions.

## Causal Scrubbing

The evaluation criteria described above are intuitive but informal. Can we do better? Chan et al. at Redwood Research proposed **causal scrubbing** as a formal method for testing circuit hypotheses {% cite "chan2022causalscrubbing" %}.

An interpretability hypothesis specifies which activations should be *interchangeable* without affecting behavior. Causal scrubbing tests that claim by resampling activations according to the hypothesis and checking whether behavior is preserved.

The procedure has three steps:

1. **Formalize the hypothesis** as a computational graph where each node specifies what a component computes and which inputs matter
2. **Resample activations** by replacing each node's activation with one sampled from a different input that matches the hypothesis about what that node computes
3. **Check behavior preservation**, if the model's output is preserved despite resampling, the hypothesis is consistent with the model's computation

For example, to test whether Name Mover Head 9.9 "copies whatever name it attends to, regardless of sentence structure," take two IOI sentences that differ in structure but have the same name attended by Head 9.9. Swap its activation between the sentences. If the output is preserved, the hypothesis about the head's function is consistent.

**Strengths.** Causal scrubbing is formal and principled, forcing hypotheses to be precise and falsifiable. It moves beyond ad-hoc evaluation (merely checking accuracy recovery) and was successfully applied to known circuits like induction heads and parenthesis matching.

**Limitations.** Causal scrubbing has well-documented shortcomings:

- **Simultaneously too strict and too permissive.** Useful but incomplete hypotheses may fail the test, while vague hypotheses can pass if they are not specific enough about what each node computes.
- **Cannot distinguish extensionally equivalent hypotheses.** If two different mechanistic stories produce the same input-output behavior, causal scrubbing treats them as equally valid. It tests behavior preservation, not mechanism identity.
- **Distribution-dependent.** Results are tied to the specific inputs used for testing. A hypothesis might pass on one prompt distribution and fail on another.
- **Difficulty with redundancy.** Backup mechanisms (like the IOI circuit's Backup Name Movers) break the assumption that components can be independently resampled. If component A is resampled but component B compensates, the hypothesis about A may incorrectly pass.

Redwood Research later described causal scrubbing as part of why its researchers moved away from that particular faithful-explanation agenda. This is evidence about one research program's assessment, not a theorem that rigorous circuit evaluation is impossible. It does highlight the cost of specifying and testing explanations at the required granularity.

<details class="pause-and-think">
<summary>Pause and think: Behavior preservation vs. mechanism identity</summary>

Causal scrubbing tests whether activations are interchangeable according to a hypothesis, but it cannot distinguish two hypotheses that make the same behavioral predictions. Is this a problem unique to causal scrubbing, or is it a fundamental limitation of any evaluation method based on behavior?

Any test limited to the same observable consequences cannot distinguish extensionally equivalent hypotheses. Investigators need either a more granular intervention or inputs on which the hypotheses predict different outcomes. This underdetermination is not specific to causal scrubbing.

</details>

## Lessons from the IOI Circuit

The IOI study taught the field several principles about how transformers compute:

**Compositional computation.** Different layers perform different steps of an algorithm, with information flowing between them through the residual stream. The detect-suppress-output structure is a genuine multi-step algorithm, not a single-step lookup.

**Useful functional groupings.** On the IOI prompt distribution, head classes support recognizable roles: Name Movers copy names, S-Inhibition Heads alter downstream attention, and Duplicate Token Heads respond to repeated names. Patching supplies causal evidence for the proposed paths, but the labels remain task-scoped summaries of polysemantic components.

**Learned structure.** The three-step account was not programmed by hand. It emerged during gradient-based training, showing that a learned computation can support a compact algorithmic description on a defined task distribution.

**Surprises.** Negative Name Movers show that circuits can contain components that work against the task for statistical reasons. Backup Name Movers show that models build redundancy into their circuits. Both properties were unexpected and required specialized experiments to discover.

## Limitations of Circuit Analysis

The IOI analysis is the best circuit analysis ever performed, and it still has significant limitations.

**Scale.** The analysis took months of researcher effort for one task in a small model (117M parameters). Manual circuit discovery does not scale to models with billions of parameters, even with semi-automated tools. **ACDC** (Automatic Circuit DisCovery) {% cite "conmy2023ioi" %} automates path patching by starting with a fully connected computational graph and recursively pruning edges whose activation patching effect falls below a threshold. It operates on *edges* (connections between components), not just nodes, producing a wiring diagram rather than a parts list. The process can be sped up significantly by using [attribution patching](/topics/attribution-patching/) as a fast screening step, reserving full activation patching for verification of the top candidates. Even so, ACDC requires defining a clean metric and a distribution of clean/corrupted input pairs, and the results depend on the pruning threshold.

**The decomposition problem.** The IOI circuit was tractable because the relevant features happened to align with individual attention heads. Each head class had a clear function. But this is not always the case. When features are distributed across many components, or when one head participates in multiple unrelated features, head-level circuit analysis breaks down.{% sidenote "The IOI circuit uses roughly 18% of GPT-2 Small's attention heads. The other 82% participate in other circuits for other tasks. Some may participate in multiple circuits simultaneously, making it impossible to assign a single functional role to each head." %}

**The decomposition problem.** [Superposition](/topics/superposition/) is one reason behaviorally relevant features need not align with individual neurons or heads. Polysemanticity can also arise because a component is reused across contexts. Feature-learning methods such as [sparse autoencoders](/topics/sparse-autoencoders/) offer a finer basis for circuit tracing, but introduce their own reconstruction and identification assumptions.

The IOI circuit remains an instructive case study because it pairs a readable algorithmic hypothesis with interventions and quantitative evaluation. Its incomplete faithfulness, ambiguous minimality, and labor-intensive discovery process are not footnotes; they show exactly what a circuit claim must report.
