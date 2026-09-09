---
title: "Copy Suppression"
description: "How attention heads suppress tokens copied from earlier context, connecting negative name movers, anti-induction heads, and a broader computational motif."
order: 10
prerequisites:
  - title: "Circuit Evaluation: Faithfulness, Completeness, and Minimality"
    url: "/topics/circuit-evaluation/"

glossary:
  - term: "Copy Suppression"
    definition: "An attention head algorithm pattern where the head attends to positions where a predicted token appeared earlier in context and outputs the negative of that token's unembedding direction, suppressing the model's tendency to predict tokens it has already seen."

exitCriteria:
  - task: "Copy suppression outputs approximately $-\\alpha\\, W_U[\\text{token}_s]$ when attending to position $s$. Say what property the head's OV circuit must have for this, and why the head needs its QK circuit to read the *prediction* rather than the input token."
    answer: |
      **The OV property:** the composition $W_E W_V W_O$ must approximate $-W_U^T$ for common tokens. That is, mapping a token's *input embedding* through the head's value-and-output pathway must produce a vector pointing roughly opposite that token's *output* direction. It is a learned near-negation of the embedding-to-unembedding correspondence, imperfect but reliable enough to suppress consistently.

      **Why the query must read the prediction:** the algorithm is *suppress what is about to be predicted and has already appeared*. Both conditions are needed. A head keying only on token identity would suppress every repeated token indiscriminately, including the many cases where repetition is the correct continuation. By late layers the residual stream at the current position already carries a strong signal about the upcoming prediction, so the query can read that and the keys can carry token identity; attention is then high exactly where the two overlap.

      That is why McDougall et al. call it *predict-attend*: the routing depends on the intersection of what the model expects and what the context contains, which is not something a purely positional or purely lexical pattern could compute.
  - task: "Head A contributes $+5$ to the logit difference and copy-suppression head B contributes $-2$. Ablating A drops the logit difference by only $4$. State A's contribution under three different definitions and say which is the intrinsic one."
    answer: |
      - **Direct effect:** $+5$. A's own write, projected onto the logit-difference direction, on the unperturbed forward pass. Exactly defined.
      - **Total effect through all paths:** $+5$ minus the suppression it induces. A's write is what B's query detects, so part of A's influence is spent triggering B against itself. This is not directly observable in one pass.
      - **Observed ablation effect:** $4$. Removing A also removes the prediction signal B was reading, so B suppresses less and the net damage is smaller than A's direct write.

      **None is intrinsic.** "True contribution" presupposes that causal credit partitions, and it does not when components condition on each other. Each number answers a well-posed but different question — what did A write, what did A cause overall, what happens when A is gone — and they disagree by construction rather than by measurement error.

      The reporting discipline follows: name the quantity and the intervention, never "head A accounts for X." Note also that this is a mechanism for [self-repair](/topics/self-repair/) that has nothing to do with backup heads: some of the recovery after ablating a positive component is simply released suppression.
  - task: "Explain how copy suppression accounts for anti-induction heads — heads that see $[A][B]\\ldots[A]$ and *suppress* $[B]$ — without positing a separate mechanism."
    answer: |
      An anti-induction head is a copy-suppression head operating in a context where an induction head has already fired.

      Walk the two conditions. After $[A][B]\ldots[A]$, an induction head has written a strong signal for $[B]$ into the residual stream, so **$B$ is being predicted** — the first condition. And $[B]$ appeared earlier in the context, at the position after the first $[A]$ — the second condition. Both hold, so the copy-suppression head does what it always does: attends to the earlier occurrence of $B$ and outputs its negative unembedding.

      No separate anti-induction algorithm is required. The head is not detecting the induction pattern or opposing induction; it is applying one rule that happens to trigger whenever induction has produced a confident repeat-prediction.

      This is the value of the account: two behaviors documented separately, in different papers, on different tasks — Negative Name Movers on IOI and anti-induction on repeated sequences — turn out to be one mechanism seen through two benchmarks. It also predicts where else to look: any context where the model confidently predicts a token already in the context should show the same heads active.
  - task: "A head has a clearly negative effect on a benchmark. Explain why that is compatible with it improving the model, and state what evaluation is required before either conclusion."
    answer: |
      Because the head was shaped by expected loss over pretraining, and your benchmark is a narrow, non-random slice of that distribution — typically one chosen because the model succeeds on it.

      IOI is a worked example of exactly the wrong slice. Its correct answer is always a name that already appears in the context. A head whose policy is *suppress tokens that are both strongly predicted and already present* is guaranteed to fight the correct answer on every IOI prompt. The benchmark selects for the head's worst case, and reports its policy as a defect.

      **The required evaluation is distribution-wide.** Run the head's ablation over a broad sample of pretraining-like text and measure the change in loss, then break the result down by token type — repeated versus novel continuations — rather than reporting a mean. The prediction is a non-uniform effect: loss should rise where the model over-predicts something already seen, and fall on the sequences where the correct continuation is the repeat.

      And note the inference runs in both directions. Neither the benchmark result nor the distributional result defines the head; they answer different questions, and a paper should report both.

      The general form: task-specific circuit analysis gives a partial picture of a component that is not task-specific.

furtherReading:
  - title: "McDougall et al., *Copy Suppression: Comprehensively Understanding an Attention Head*"
    url: "https://arxiv.org/abs/2310.04625"
    note: "The full paper, including the claim to have explained most of a head's behavior and the evidence offered for it."
  - title: "McGrath et al., *The Hydra Effect*"
    url: "https://arxiv.org/abs/2307.15771"
    note: "Self-repair, which copy suppression partly explains. The two papers together are more than either alone."
  - title: "Gurnee et al., *Universal Neurons in GPT-2*"
    url: "https://arxiv.org/abs/2401.12181"
    note: "Prediction-suppression neurons, the MLP-side analogue of the same motif."
---

## A Head That Works Against Prediction

In the [IOI circuit](/topics/ioi-circuit/), Negative Name Mover Heads consistently push the model *away* from the correct answer. In [circuit evaluation](/topics/circuit-evaluation/), we explained this as loss hedging, a statistical optimization where reducing confidence on individual examples improves expected loss across the training distribution. But this explanation raises a question: what are these heads actually *computing*? What algorithm do they implement?

McDougall et al. {% cite "mcdougall2023copy" %} answered this question by studying one such head, head L10H7 in GPT-2 Small, not only on IOI, but across a broader sample of pre-training data. Their analysis produced a detailed account of much of the head's behavior: it implements **copy suppression**, an algorithmic pattern that operates beyond the IOI benchmark.

Unlike an analysis confined to a curated benchmark, this study asks whether the proposed mechanism explains the head on more representative text. The head that looks counterproductive on IOI then has a more coherent interpretation: it often reduces an existing tendency to copy from context.

## The Algorithm

Copy suppression identifies the current prediction, finds earlier occurrences, and then lowers that token's logit:

1. **Identify the current prediction.** The head's query reads the residual stream at the current position, which (by late layers) already contains a strong signal about what the model is about to predict.

2. **Find where that token appeared before.** The head's QK circuit computes attention weights that are high for positions where the predicted token (or a semantically similar token) appeared earlier in the context.

3. **Suppress the prediction.** The head's OV circuit maps the attended token's embedding through a transformation that approximates the *negative* of the unembedding direction for that token. The result is added to the residual stream, pushing the logit for the predicted token *down*.

In formal terms, for a copy suppression head at position $t$ that attends to position $s$:

$$
\text{output}_t \approx -\alpha \cdot W_U[\text{token}_s]
$$

where $W_U[\text{token}_s]$ is the unembedding vector for the token at position $s$ and $\alpha > 0$ controls the suppression strength. The head outputs the negative unembedding of the token it attends to, directly reducing that token's logit.{% sidenote "The OV circuit does not literally implement the negative unembedding. Rather, the composition $W_E W_V W_O$ (embedding, value, and output matrices) approximates $-W_U^T$ (the transpose of the unembedding) for common tokens. The approximation is imperfect but strong enough to produce reliable suppression." %}

> **Copy Suppression:** An attention head algorithm where the head (1) identifies what token the model is currently predicting, (2) attends to positions where that token appeared earlier in context, and (3) outputs the negative unembedding of that token, suppressing the prediction. This reduces the model's tendency to over-predict tokens that have already appeared.

## Why Copy Suppression Exists

Language models have a systematic bias toward predicting tokens that appear in the context. This is often correct because repetition is common in natural language ("The cat sat on the mat. The cat..."). It can also be wrong. After seeing "Paris" several times in a passage, the model's residual stream may retain evidence for "Paris" even when the next token should be something else.

Copy suppression counteracts this bias. By detecting when a strongly predicted token has already appeared and suppressing its logit, copy suppression heads calibrate the model's predictions. They reduce overconfidence in repeated tokens, making the probability distribution more accurate.

Copy suppression does not make the model less confident everywhere. It lowers confidence specifically when a token is both strongly predicted and already present in context, which can improve calibration and expected loss on the broader distribution.

<details class="pause-and-think">
<summary>Pause and think: Copy suppression and perplexity</summary>

If copy suppression heads calibrate the model by reducing over-prediction of repeated tokens, what would you expect to happen to the model's perplexity (average cross-entropy loss) if you ablated all copy suppression heads? Would perplexity increase uniformly across all tokens, or would the effect be concentrated on specific types of tokens?

The effect would be concentrated on tokens where the model tends to over-predict something it has already seen. On sequences with repeated entities or phrases, ablating copy suppression would increase the logit for the repeated token, making the model overconfident. On sequences where the correct prediction happens to be a repeated token, the ablation might actually *help* (since the suppression was reducing the correct prediction). The net effect on perplexity would depend on the balance between these cases, but the effect would be highly non-uniform across the token distribution.

</details>

## Unifying Previously Mysterious Behaviors

Copy suppression provides a unifying explanation for several head behaviors that had been documented individually but not connected.

**Negative Name Movers in IOI.** The [Negative Name Mover Heads](/topics/circuit-evaluation/) attend to name positions and push against the correct answer on IOI. A copy-suppression account explains the sign: positive Name Movers raise a previously seen name, and the negative heads suppress tokens that are both predicted and present in context. The measured head can improve average loss on broader text even while hurting this benchmark, but that distribution-level effect must be tested rather than inferred from the label.

**Anti-induction heads.** Some heads appear to implement the *opposite* of [induction](/topics/induction-heads/): where an induction head sees "[A][B]...[A]" and predicts [B], an anti-induction head sees the same pattern and suppresses [B]. Under copy suppression, this makes sense: if [B] is already being predicted (perhaps by an induction head), and [B] appeared earlier in context, a copy suppression head would suppress it.

**Calibration beyond the benchmark.** A negative contribution to one metric can be part of a policy that improves loss elsewhere. Copy suppression is a concrete example: repeated-name answers make suppression look counterproductive on IOI, while broader evaluation can test whether the same head reduces overprediction on other text.{% sidenote "A task-specific role and a distribution-level role answer different questions. Report both the benchmark effect and the evidence from a broader sample instead of assuming either one defines the head." %}

## The Mechanism in Detail

McDougall et al. {% cite "mcdougall2023copy" %} decomposed L10H7's behavior into its QK and OV circuits and verified each step.

**The QK circuit** implements what the authors call “predict-attend.” Queries read information correlated with the current prediction, while keys carry token-identity information. The attention weight $A_{t,s}$ becomes high when the token at source position $s$ matches a token favored at destination $t$. This differs from a purely positional pattern: the routing depends on overlap between the prediction and the context.

**The OV circuit** implements approximate negative unembedding. The composition of the value and output projection matrices maps input token embeddings to vectors that point in approximately the opposite direction of those tokens' unembedding vectors. When the head attends to a token and passes it through the OV circuit, the output pushes that token's logit down.

The two circuits work in concert: the QK circuit identifies *which* tokens to suppress (those that match the current prediction and appear in context), and the OV circuit produces *how* to suppress them (by outputting their negative unembedding).

## Connection to Self-Repair

Copy suppression interacts with [self-repair](/topics/self-repair/) in a specific way. When primary circuit components (like Name Mover Heads in IOI) are ablated, the prediction signal they normally produce disappears from the residual stream. Copy suppression heads, which attend based on the prediction signal, no longer detect a strong prediction to suppress. Their suppression effect drops, which *partially restores* the correct answer through a different pathway.

Copy suppression contributes to measured self-repair because ablating a positive pathway can also weaken a downstream negative contribution. The resulting recovery is partly a release of suppression, not only increased activity from backup heads.

<details class="pause-and-think">
<summary>Pause and think: Ablation interpretation</summary>

Consider a circuit where Head A produces a positive contribution of +5 to the logit difference, and Head B (a copy suppression head) produces a contribution of -2. If you ablate Head A, the logit difference might drop by only 4 (not 5), because Head B's suppression also decreases when A's signal disappears. How does this affect the interpretation of A's ablation result? What is A's "true" contribution?

There is no single answer without defining the counterfactual. A's direct projected write is +5. Its total effect through all downstream paths includes the suppression it induces, while the observed ablation effect is 4 under this intervention. State which quantity you mean instead of treating “true contribution” as an intrinsic scalar.

</details>

## Implications for Circuit Analysis

The mechanism changes how we should interpret negative contributors, task-specific circuits, and attention patterns.

**Negative contributors are not automatically errors.** A head with a negative direct contribution to one task metric may implement a broader policy that improves other examples. Copy suppression supplies a testable hypothesis for such cases.

**Task-specific circuits are partial pictures.** Analyzing a head's role on one task gives a narrow view. The same head may participate in a broader pattern elsewhere in the data. Copy suppression heads can hurt IOI performance even when their average effect on more representative text is useful.

**Attention patterns reveal algorithm type.** Standard attention patterns (attend to syntactically relevant positions) differ from copy suppression patterns (attend to positions where the predicted token appeared). Examining *what determines attention weights*, syntactic position, token identity, or prediction-context overlap, provides clues about the algorithm a head implements.

## Looking Ahead

Copy suppression shows why a head's role on one benchmark may not describe its broader function. A component can oppose the desired answer on IOI yet improve predictions elsewhere by counteracting excessive copying. This makes distribution-wide evaluation a necessary complement to task-specific circuit analysis.
