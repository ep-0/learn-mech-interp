---
title: "The IOI Circuit: Discovery and Mechanism"
description: "How researchers traced a compact attention-head circuit that helps GPT-2 Small solve indirect object identification, from duplicate detection to name copying."
order: 2
prerequisites:
  - title: "Attribution Patching and Path Patching"
    url: "/topics/attribution-patching/"

glossary:
  - term: "Circuit (neural)"
    definition: "A subgraph of a neural network consisting of specific components (attention heads, MLP neurons, or features) and their connections that together implement an identifiable computational mechanism."
  - term: "IOI Circuit"
    definition: "The circuit discovered in GPT-2 Small that performs the Indirect Object Identification task, consisting of name movers, backup name movers, S-inhibition heads, induction-like heads, and duplicate token heads working together to predict the correct indirect object."
  - term: "Name Mover Head"
    definition: "An attention head in the IOI circuit that attends to the indirect object name and copies it to the final token position, directly promoting that name in the output logits. Name movers are the output stage of the IOI circuit."

exitCriteria:
  - task: "Wang et al. traced the circuit backward from the output rather than forward from the input. Explain why that direction is more efficient, in terms of the structure of the search at each end."
    answer: |
      The two ends have opposite sparsity.

      **At the output**, only a few heads write vectors with a large projection onto the $\text{logit}(\text{IO}) - \text{logit}(\text{S})$ direction. One pass of direct logit attribution over all $144$ heads ranks them, and the ranking is sharply peaked — a handful of Name Movers stand out and most heads sit near zero. The search collapses immediately.

      **At the input**, nearly every head is doing something: reading tokens, tracking positions, processing structure that may or may not concern this task. There is no cheap criterion for relevance, because "processes the input" does not distinguish the IOI pathway from everything else the model does on the same sentence.

      So backward tracing starts where the signal is concentrated and expands only along the paths that feed what you have already established matters. Each step asks a narrow question — *what determines the Name Movers' queries?* — answerable by path patching against a specific target, rather than the unbounded question of what each early head contributes to.

      The general heuristic: begin at whichever end of the computation your metric makes sparse.
  - task: "S-Inhibition Heads act at the END position, even though the duplicated name sits earlier at S1 and S2. Explain why the architecture requires this, and what would fail if they wrote only at S2."
    answer: |
      The residual stream is **per-position**. Each position has its own vector, and a head's write lands at the destination position where it computed its output.

      Name Movers form their queries at END, because that is where the next-token prediction is made: $\mathbf{q}_{\text{NM}} = \mathbf{r}'_{\text{END}} W_Q^{\text{NM}}$. To change what the Name Movers look for, something must change $\mathbf{r}_{\text{END}}$. S-Inhibition heads therefore act at END, attending back to S2 to read the duplicate signal and writing the suppression vector into the END stream — where the query is built.

      **If they wrote only at S2:** the vector would sit in S2's residual stream. Name Movers would encounter it only as *key or value* material at that source position, never in their query. It could change what a head reads if it attended to S2, but it could not change where the head chooses to attend, which is the entire function.

      The general lesson is that information does not float free in a transformer. To affect a computation you must get the signal to the *position* where that computation happens, and moving it there is what attention is for. "S-Inhibition attends to S2 and writes at END" is the model doing exactly that transport.
  - task: "Without upstream input, Name Mover heads attend to all name tokens roughly equally. Explain why this fact is the crux of the circuit, and what it implies about where the task-specific computation lives."
    answer: |
      A head that attends equally to Mary and John and copies what it attends to produces roughly equal logits for both — no answer at all. So the Name Movers, despite having the largest direct effect on the metric, are not solving the task. Their OV circuit is a generic name-copying mechanism; it would behave the same way on a sentence with no duplicate.

      The task-specific work is therefore entirely in **the query**, and hence upstream. Everything that makes this an IOI circuit rather than a name-copier — detecting which name repeats, converting that into a signal, delivering it to END, biasing the query away from the duplicate — happens before layer 9.

      Two consequences follow. First, the component with the largest attribution is not the component doing the interesting computation, which is a general warning about reading circuits off attribution scores. Second, it explains the discovery path: finding the Name Movers is easy and tells you almost nothing, and the real question — *who modifies these queries?* — is what path patching was needed to answer.

      It also predicts the ablation result: cut the S-Inhibition-to-query path and Name Mover attention becomes unselective between the names, which is what is observed.
  - task: "The circuit contains 26 of GPT-2 Small's 144 attention heads. Explain why \"the task uses 18% of the model\" misstates what was found."
    answer: |
      Three reasons the fraction does not mean that.

      1. **The denominator is incomplete.** Heads are not the model. GPT-2 Small also has $12$ MLP layers holding roughly two-thirds of its non-embedding parameters, plus embeddings and unembeddings. A ratio over heads alone silently excludes most of the computation, and MLPs are not established to be uninvolved — they were largely not searched.
      2. **The 26 are not disjoint from the rest.** All heads read and write the same residual stream. The circuit heads operate on a state that every other head has contributed to, so they are not a self-contained $18\%$ that could be lifted out. Whether the circuit works *in isolation* is a separate question — that is faithfulness, and it has to be measured.
      3. **"Uses" implies a partition of capacity that does not exist.** Heads are reused across tasks; a head in this circuit is doing other jobs on other inputs. There is no allocation of the model into task-shares to take a percentage of.

      What was actually found: much of the *measured behavior on this benchmark, under this metric and these interventions* can be traced through a comparatively small set of components. That is a real and useful result, and it is a statement about the tractability of the analysis rather than about how much of the model is involved.

furtherReading:
  - title: "Wang et al., *Interpretability in the Wild: A Circuit for Indirect Object Identification in GPT-2 Small*"
    url: "https://arxiv.org/abs/2211.00593"
    note: "The whole paper. It is the field's canonical worked example and repays reading in full rather than in summary."
  - title: "Conmy et al., *Towards Automated Circuit Discovery*"
    url: "https://arxiv.org/abs/2304.14997"
    note: "The same circuit rediscovered automatically, which is the benchmark ACDC is validated against."
  - title: "Merullo, Eickhoff & Pavlick, *Circuit Component Reuse Across Tasks*"
    url: "https://arxiv.org/abs/2310.08744"
    note: "IOI components reappearing in a different task. Evidence about generality that this article does not include."
  - title: "Zhang & Nanda, *Towards Best Practices of Activation Patching*"
    url: "https://arxiv.org/abs/2309.16042"
    note: "The methodological choices in the discovery, re-examined. Useful for judging how much of the circuit is robust to them."
---

## The Task

Consider the sentence: "When Mary and John went to the store, John gave a drink to ___." A human reader immediately fills in the blank with "Mary." The reasoning is straightforward: John is the recently repeated subject, so the indirect object, the person receiving the drink, must be the other name, Mary.

This task is called **Indirect Object Identification** (IOI). It is simple enough that humans solve it effortlessly, yet rich enough that solving it requires tracking which names appear where, detecting which name is duplicated, and outputting the remaining name. Wang et al. set out to answer a deceptively deep question: how does GPT-2 Small (a 117M-parameter transformer) solve this task? Not whether it can, it clearly can, with high reliability across many prompt variations, but what algorithm it implements internally {% cite "wang2022ioi" %}.

> **Indirect Object Identification (IOI):** Given “When [Name A] and [Name B] went to the store, [Name B] gave a drink to ___,” the target is Name A, the indirect object rather than the repeated subject.

What makes IOI a good benchmark for circuit analysis? The correct answer is unambiguous for every prompt. The clean/corrupted setup is natural: swap which name is the subject ("When Mary and John went to the store, Mary gave a drink to ___" flips the correct answer to John). And the metric is clean: the logit difference $\text{logit}(\text{IO}) - \text{logit}(\text{S})$ captures performance in a single continuous value. These properties made IOI a tractable target for a detailed circuit analysis.{% sidenote "Wang et al. tested IOI across a set of template variations, different sentence structures, name pairs, and verb phrases. Performance across that distribution helps rule out memorization of a single template, though it does not establish the same mechanism on unrestricted text." %}

## The Human-Readable Algorithm

Before looking inside the model, consider how a simple algorithm might solve IOI:

1. **Identify all names** in the sentence (Mary, John)
2. **Detect which name is duplicated** (John appears at positions S1 and S2)
3. **Suppress the duplicated name** from the set of candidates
4. **Output the remaining name** (Mary)

The circuit analysis suggests that GPT-2 Small implements something close to this algorithm. Researchers grouped 26 attention heads into functional classes that contribute at different stages. The resulting account is human-readable, even though the weights themselves emerged through training rather than being programmed by hand.

The IOI circuit is not merely a list of 26 important heads. Its proposed **algorithm** detects the duplicate, suppresses it, and outputs the remaining name; the circuit maps each step to the heads that implement it.

## The Discovery Methodology

How did Wang et al. find this circuit? They did not examine all 144 attention heads at random. Instead, they used a **backward-tracing** strategy, starting from the model's output and following the causal chain backward toward the input.{% sidenote "Backward tracing is more efficient than forward tracing because the output is sparse, only a few heads directly contribute to the logit difference, while the input is dense, with many heads processing information that may or may not be relevant to IOI. Starting from the sparse end narrows the search immediately." %}

**Step 1: Direct Logit Attribution.** Each attention head writes a vector to the residual stream at the final token position. Projecting each head's output through the unembedding matrix measures its direct contribution to the logit difference:

$$
\text{DLA}(\text{head } h) = (\mathbf{x}_h \cdot W_U)_{\text{IO}} - (\mathbf{x}_h \cdot W_U)_{\text{S}}
$$

This identifies heads whose outputs directly push toward predicting the indirect object.

**Step 2: Test candidates with activation patching.** DLA shows which heads contribute directly to the chosen logit difference. [Activation patching](/topics/activation-patching/) tests whether replacing a head's output between clean and corrupted runs changes that metric. Heads with large effects become candidates for the circuit's output stage.

**Step 3: Trace upstream.** Once the output heads are identified, the question becomes: what determines their behavior? An attention head's output depends on its OV circuit (what information it copies, from its values) and its QK circuit (where it attends, from its queries and keys). [Path patching](/topics/attribution-patching/) reveals which upstream heads modify the queries and keys of the output heads.

**Step 4: Iterate.** The process repeats for each newly discovered head class. Trace what feeds into it, identify the functional role, and continue backward until reaching the input embeddings. The entire circuit was built by iterating this trace-backward procedure.

## Name Mover Heads: The Output Stage

The first heads discovered are the **Name Mover Heads**, located in layers 9-10. They are the output stage of the circuit.

Name Movers attend to a name token in the context and copy that name to the output logits via their OV circuit. In mathematical terms:

$$
\mathbf{x}_{\text{NM}} = A_{\text{NM}} \cdot X \cdot W_{\text{OV}}^{\text{NM}}
$$

where $A_{\text{NM}}$ is the attention pattern and $W_{\text{OV}}^{\text{NM}}$ maps name embeddings to name logits. The OV circuit implements an approximate "copy" operation for name tokens.

Name Movers were found first because they are closest to the output. Each one independently recovers 30-40% of the logit difference when patched (denoising direction), and their OV matrices are specialized for copying names.

But there is a subtlety. Without any input from upstream heads, Name Movers attend to *all* name tokens roughly equally. If Mary and John both appear in the sentence, a Name Mover would by default attend to both, producing roughly equal logits for each, not helpful. Something must bias their attention toward the indirect object and away from the subject.

*Who modifies the Name Mover queries?* This question leads to the heart of the circuit.

## S-Inhibition Heads: The Key Mechanism

**S-Inhibition Heads** in layers 7-8 are the bridge between detection and output, the heart of the IOI circuit.

S-Inhibition Heads are active at the END position (where the model produces its prediction). They attend to the S2 position (the second mention of the repeated name). Their function is to modify the queries of downstream Name Mover Heads so that Name Movers attend away from the duplicated name.

The mechanism works through the residual stream. S-Inhibition Heads write at the END position, and Name Mover Heads form their queries from the updated state. With a row-vector convention:

$$
\mathbf{r}'_{\text{END}} = \mathbf{r}_{\text{END}} + \mathbf{x}_{\text{S-Inh}} + \ldots,
\qquad
\mathbf{q}_{\text{NM}} = \mathbf{r}'_{\text{END}} W_Q^{\text{NM}}
$$

The term $\mathbf{x}_{\text{S-Inh}}$ acts as a negative signal for the duplicated name positions. The result: Name Movers attend preferentially to the IO position and copy Mary (not John) to the output.

Under the reported interventions, removing S-Inhibition makes Name Mover attention less selective between the candidate names, while removing Name Movers eliminates a major direct copying path. This supports the summary that S-Inhibition converts duplicate-name information into a query update that discourages copying that name.

Path patching supports this specific connection: intervening on the path from S-Inhibition Heads to the queries of Name Mover Heads makes Name Mover attention less selective between names, and the logit difference drops.{% sidenote "Path patching targets the proposed route into Name Mover queries rather than replacing the S-Inhibition Heads' entire output. This is more specific than whole-head ablation, although it still tests the mechanism under an intervention rather than observing the untouched computation directly." %}

<details class="pause-and-think">
<summary>Pause and think: Why S-Inhibition works at the END position</summary>

S-Inhibition Heads operate at the END position (the final token where the prediction is made), even though the duplicated name appears much earlier in the sentence at positions S1 and S2. Why does this architectural arrangement make sense?

Name Movers construct their queries at the END position, where the next-token prediction is made. S-Inhibition can modify those queries by writing at the same position. A write confined to S2 would not directly enter the END-position query, so information about the duplicate must first reach the prediction site.

</details>

## Duplicate Token Heads and Induction Heads: The Detection Stage

For S-Inhibition to suppress the right name, the model must first detect *which* name is duplicated. This is the job of the detection stage in layers 0-6.

**Duplicate Token Heads** (layers 0-1) solve the detection problem directly. These heads are active at position S2 and attend back to position S1. Their QK circuit implements approximate token matching: when the token at S2 equals the token at S1, the attention weight is high:

$$
A(\text{S2}, \text{S1}) \propto \exp(\mathbf{x}_{\text{S2}} \cdot W_{\text{QK}} \cdot \mathbf{x}_{\text{S1}}^T)
$$

When S2 and S1 are the same token, the query-key dot product is large because the same embedding appears on both sides. The head writes information about the duplicate into the residual stream at S2, signaling: "this token has appeared before."

**Induction Heads** (layers 5-6) complement the Duplicate Token Heads. Recall from [the discussion of induction heads](/topics/induction-heads/) that these heads implement the pattern "[A][B] ... [A] -> predict [B]." In the IOI context, they use K-composition with Previous Token Heads (also layers 0-1) to recognize the repeated name pattern and strengthen the signal.

By layer 6, the model has a strong representation of which name is duplicated, written into the residual stream. This signal propagates to S-Inhibition Heads, which read it and use it to suppress the duplicate at the output.{% sidenote "The composition between Duplicate Token Heads, Previous Token Heads, and Induction Heads is technically intricate. The key point is that multiple heads in the early layers collaborate to produce a single clear signal, 'John is the repeated name', that the later stages of the circuit consume. The details of the composition are less important than the functional outcome." %}

## The Three-Step Algorithm

The full core mechanism:

1. **Detect** (layers 0-6): Duplicate Token Heads and Induction Heads identify that "John" at position S2 matches "John" at position S1.
2. **Suppress** (layers 7-8): S-Inhibition Heads, active at the END position, attend to S2 and write a suppression vector that modifies Name Mover queries.
3. **Output** (layers 9-10): Name Mover Heads, with their queries now biased away from John's positions, attend preferentially to Mary and copy her name to the output logits.

The information flows through the model in this order:

Input tokens -> Previous Token + Duplicate Token Heads (L0-1) -> Induction Heads (L5-6) -> S-Inhibition Heads (L7-8) -> Name Mover Heads (L9-10) -> Output: "Mary"

This gives a compositional account: each head class has a proposed function that feeds into the next. Patching experiments provide causal evidence for important links, while the remaining approximation error and prompt dependence keep the account from being a literal line-by-line program.

<details class="pause-and-think">
<summary>Pause and think: Why a compositional algorithm?</summary>

The IOI algorithm decomposes into detect-suppress-output. Consider an alternative: the model could learn to directly memorize "if John appears twice, output Mary." Why is the compositional three-step algorithm a better solution?

A lookup table over name pairs would grow with the number of names and transfer poorly to unfamiliar examples. The proposed circuit instead reuses the same operations: detect *which* name is duplicated, suppress *that* name, and copy *the other one*. Testing new names and templates helps distinguish this reusable procedure from narrow memorization.

</details>

## From 144 Heads to 26

GPT-2 Small has 144 attention heads, and the proposed IOI circuit contains 26 of them. That does not mean the task uses exactly 18% of the model's total capacity: heads share the residual stream, and MLPs and other heads can still affect the computation. It does show that much of the benchmark behavior can be traced through a comparatively small set of components.

The core algorithm above uses only four of the seven head classes Wang et al. reported. Their expanded circuit also contains **Negative Name Mover Heads**, **Backup Name Mover Heads**, and **Previous Token Heads**. These components expose effects that a simple feed-forward story misses, including suppression and redundancy. Negative Name Movers connect to the broader [copy suppression](/topics/copy-suppression/) pattern, while Backup Name Movers illustrate [self-repair](/topics/self-repair/) after ablation. The next article, [Circuit Evaluation: Faithfulness, Completeness, and Minimality](/topics/circuit-evaluation/), uses these additional classes to ask how much confidence the proposed circuit deserves.
