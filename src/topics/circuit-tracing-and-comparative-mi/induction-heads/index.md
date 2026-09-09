---
title: "Induction Heads and In-Context Learning"
seoTitle: "Induction Heads and In-Context Learning"
description: "How two attention heads can compose into a pattern-copying circuit, plus the evidence and limits behind claims linking induction heads to in-context learning."
order: 1
prerequisites:
  - title: "Composition and Virtual Attention Heads"
    url: "/topics/composition-and-virtual-heads/"
  - title: "In-Context Learning and Prompting"
    url: "/topics/in-context-learning/"

glossary:
  - term: "In-Context Learning"
    definition: "The ability of a model to adapt its predictions using examples or instructions in the prompt, without updating its weights. Induction heads can support simple forms of this behavior by matching and continuing earlier patterns."
  - term: "Induction Head"
    definition: "An attention-head pattern, usually enabled by an earlier head, that supports copying: after seeing 'A B ... A', it raises the probability of 'B'. This mechanism explains some forms of pattern completion, not all in-context learning."
  - term: "Previous Token Head"
    definition: "An attention head that places substantial weight on the immediately preceding position and writes information about that token. It can supply predecessor-token information to an induction circuit."

exitCriteria:
  - task: "Explain why a one-layer attention-only transformer cannot implement the induction mechanism, in terms of what each layer's queries and keys are computed from."
    answer: |
      In a one-layer model every head's queries and keys are computed from the same initial residual stream: the token embedding plus positional information. There is no earlier attention output for a head to read.

      The induction mechanism requires a query of the form *find a position whose predecessor was $A$*. Matching on that criterion means the key at each source position must carry the identity of the token *before* it — information that is not in that position's embedding and must be put there by some earlier operation. With one layer there is no earlier operation, so no key can carry it.

      A single layer is therefore limited to fixed token-to-token maps, summarized by $W_E W_{QK}^h W_E^T$ for routing and $W_E W_{OV}^h W_U$ for the write, plus positional effects and the mask. That covers bigram statistics, copying, and attention at fixed offsets — but not a criterion computed from context.

      The careful statement is architectural and specific: one attention layer cannot implement *this two-step predecessor-copying mechanism*. It is not a proof that no one-layer network with different components could approximate repeated-pattern behavior some other way.
  - task: "For the sequence `A B C D A B`, say which position the induction head attends to from position 6 (the second `B`) and what it predicts, then state what the previous-token head had to write for this to work."
    answer: |
      From position 6 (`B`), the head attends to **position 3** (`C`) and predicts `C`.

      The rule is *find an earlier occurrence of my current token, and read what followed it*. The current token is `B`, its earlier occurrence is position 2, so the token that followed it is at position 3. The head attends there and its OV circuit copies that token's identity to the output.

      Crucially the head does **not** attend to position 2, the matching token itself. That is the observable signature: attention lands one position *after* the match, which is what produces the characteristic off-diagonal stripe.

      **What the previous-token head had to write:** at every position $i$, the identity of the token at $i-1$. So position 3 carries "I am `C` and my predecessor was `B`." That is what the induction head's query — formed from its own token `B` — matches against, via the keys. Without that write, position 3's key says only "I am `C`," which the query for `B` has no reason to select.

      Check yourself on position 5: the second `A` attends to position 2 (`B`) and predicts `B`.
  - task: "State the evidence connecting induction heads to the in-context learning phase change, and identify which piece is correlational and which is causal."
    answer: |
      **Correlational:** induction-like heads appear in the same narrow training window as the sharp improvement in the in-context-learning score. Co-occurrence in time is suggestive and, on its own, compatible with both being downstream of a third change.

      **Causal, two pieces:**

      1. **Ablation.** Removing the relevant heads in the small models tested substantially reduces the measured in-context-learning score. This is an intervention on the trained model.
      2. **Architectural manipulation.** Changes that restrict composition delay or weaken the transition. This is an intervention on training itself, and it is the stronger of the two, because it manipulates the proposed cause upstream rather than deleting the result.

      A third piece is structural rather than experimental: one-layer models show no such transition, and one-layer models cannot build the mechanism. The presence of the jump tracks the availability of composition.

      **What the evidence does not settle:** that induction heads are the *only* route to in-context learning, or that the same account holds in large models where ICL is far richer than pattern completion. The claim it supports is that induction circuitry is a real and causally relevant ingredient in the models studied.
  - task: "In large models, heads are found that match approximately or semantically rather than on exact repeats. Explain why calling them induction heads is a hypothesis rather than an observation."
    answer: |
      The name "induction head" was defined by a **mechanism**: K-composition with a previous-token head, producing a key that carries predecessor identity, so the head can attend one past an exact token match and copy. Every part of that is checkable in a small model, and the small-model evidence is what gives the term meaning.

      What is observed in a large model is usually a **pattern**: attention that jumps to a plausible continuation after something resembling a repeat. That is the mechanism's signature, and signatures are not unique. Fuzzy or semantic matching in particular is evidence *against* the literal mechanism, since exact-token matching is what predecessor-identity keys give you. A head that matches paraphrases is doing something the two-head circuit does not explain.

      So the transfer needs its own evidence: which upstream components write the keys this head reads, does composition analysis or path patching show the predecessor pathway, does it behave like an induction head on random repeated tokens (the test that made the original case), and what does the OV circuit copy?

      The general failure is naming by resemblance and inheriting the mechanism for free — the same error as reading a head's function off its attention pattern, one level up.

furtherReading:
  - title: "Olsson et al., *In-Context Learning and Induction Heads*"
    url: "https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html"
    note: "The full argument, including all six lines of evidence and the authors' own hedging about the causal claim."
  - title: "Elhage et al., *A Mathematical Framework*"
    url: "https://transformer-circuits.pub/2021/framework/index.html"
    note: "The two-layer analysis that predicted induction heads before they were named."
  - title: "Singh et al., *What Needs to Go Right for an Induction Head?*"
    url: "https://arxiv.org/abs/2404.07129"
    note: "The formation dynamics in a controlled setting, which explains the phase change rather than reporting it."
  - title: "Yin & Steinhardt, *Which Attention Heads Matter for In-Context Learning?*"
    url: "https://arxiv.org/abs/2502.14010"
    note: "Evidence that function-vector heads matter more than induction heads for few-shot performance. The strongest challenge to the story told here."
---

## What Can Simple Models Compute?

Before we can appreciate what composition makes possible, we need to understand what a model *without* composition can do. Consider the simplest possible transformer: a one-layer, attention-only model with $H$ attention heads and no MLP. The output at each position is:

$$
T(\mathbf{x}) = \mathbf{x} + \sum_{h=1}^{H} A^h(\mathbf{x})\,\mathbf{x}W_{OV}^h
$$

Here $A^h(\mathbf{x})$ is head $h$'s attention matrix. Each head operates on the same initial residual stream, so no head can use another head's output from that layer. Its attention pattern can depend on token and positional information already in the stream, but not on a computation performed by an earlier attention layer {% cite "elhage2021mathematical" %}.

Two end-to-end matrices summarize token-identity effects. The **QK matrix** $W_E W_{QK}^h W_E^T$ gives the token-token contribution to the pre-softmax attention score. It is not itself an attention probability, because position terms, the causal mask, and competing source tokens also affect the softmax. The **OV matrix** $W_E W_{OV}^h W_U$ gives the direct vocabulary-logit effect of moving an embedded source token through the head's OV pathway.{% sidenote "These products are exact weight-derived terms under the simplified embedding-only analysis. They do not alone characterize a full sequence-level behavior: attention probabilities depend on the other tokens and positions, and final logits include all paths and normalization." %}

These matrices describe the head's token-to-token QK and OV behavior. Together with positional effects and the causal mask, they explain patterns such as bigram prediction, longer-range token copying, and attention to fixed relative positions.

One attention layer has no earlier attention output to enrich its keys or queries. It therefore cannot implement the same two-step predecessor-copying mechanism used by the induction circuit described below. This is an architectural statement about that mechanism, not a claim that no one-layer network with different components or positional features can ever approximate repeated-pattern behavior.

## The Power of Two Layers

With two layers, the model gains a qualitatively new capability. The output now expands into three types of terms:

$$
T = \underbrace{\text{direct path}}_{\text{token embedding}} + \underbrace{\sum_h \text{single-head terms}}_{\text{each head alone}} + \underbrace{\sum_{h_1, h_2} \text{composition terms}}_{\text{head pairs across layers}}
$$

The composition terms let a layer-2 head read information written by layer 1. Through **K-composition**, for example, a layer-1 head can add predecessor information to the residual stream at each position, and a layer-2 head can use that information when constructing its keys.{% sidenote "K-composition is not the only form of composition. Q-composition changes what a layer-2 head searches for, and V-composition changes what information is moved. K-composition is central to the induction mechanism described here because the earlier head supplies information used by the later head's keys." %}

The qualitative jump is stark. One-layer models see raw tokens and compute fixed token-to-token mappings. Two-layer models see *enriched* tokens, where each position carries information deposited by layer-1 heads. This enrichment is what makes context-dependent pattern matching possible.

<details class="pause-and-think">
<summary>Pause and think: What new capability emerges?</summary>

Two layers can do something one layer cannot. Given what you know about composition, can you guess what new capability emerges? Think about what information a layer-1 head could add to each position, and how a layer-2 head could use that enriched information to make predictions that depend on context rather than just token identity.

</details>

## The Induction Pattern

Consider a sequence where a pattern repeats:

$$
[A][B] \ldots [A] \to \text{predict } [B]
$$

The model sees $A$ followed by $B$ earlier in the context. When $A$ appears again, the induction score measures whether the model raises $B$. Tests on random or held-out token pairs help show that the effect is a reusable copying pattern rather than memorization of a particular pair.

Take a concrete example. In the sequence "The cat sat on the cat ...", at the second "cat" position the model should predict "sat", the token that followed the first "cat." This requires the model to find the previous occurrence of "cat" in the context, identify that "sat" followed it, and copy "sat" to the output. No single attention head can do all three steps. This requires composition {% cite "olsson2022context" %}.

<figure>
  <img src="images/induction_head_mechanism.png" alt="The induction head mechanism on a repeated random token sequence. The current token 'node' in the repeated half matches the prefix of the attended-to token 'struction' in the first half. The attention arrow shows the induction head attending from 'node' back to 'struction', whose logit is then boosted for the next-token prediction.">
  <figcaption>The induction head pattern: on a repeated random sequence, the head at the current token ("node") attends back to the token ("struction") that previously followed a matching prefix. The attended-to token's logit is copied to the output. From Olsson et al., <em>In-context Learning and Induction Heads</em>. {%- cite "olsson2022context" -%}</figcaption>
</figure>

## The Two-Step Mechanism

The induction head circuit uses two attention heads across two layers, working together through K-composition.

> **Previous Token Head:** An attention head (typically in layer 1) that attends to the immediately preceding position. At position $i$, it copies information about the token at position $i-1$ into the residual stream. After this head runs, each position carries not just its own token identity but also the identity of the token before it.

**Step 1.** The previous token head runs in layer 1. At every position, it attends to the position immediately before it (producing a characteristic diagonal stripe in the attention pattern matrix). After this head writes to the residual stream, the position holding "sat" now encodes: "I am 'sat' and the token before me was 'cat'." The position holding "on" encodes: "I am 'on' and the token before me was 'sat'." Every position in the sequence is enriched with predecessor information.

> **Induction Head:** An attention head (typically in layer 2) that, at the second occurrence of token $A$, attends to the token that previously followed $A$. It implements the pattern $[A][B] \ldots [A] \to [B]$ by using predecessor information in its keys to find matching contexts.

**Step 2.** The induction head runs in layer 2. At the second occurrence of "cat", this head's query effectively says: "I am looking for a position whose predecessor was 'cat'." Thanks to the previous token head, the position holding "sat" has "predecessor = cat" in its key. The induction head attends to "sat" and copies its token identity to the output. The prediction is "sat."

The mechanism is K-composition in action. The layer-1 head enriches the keys with predecessor information. The layer-2 head uses those enriched keys to attend based on context, not just raw token identity.

## Reading the Attention Patterns

The two heads in the induction circuit have distinctive attention patterns that are recognizable in attention heatmaps.

The **previous token head** produces a strong diagonal stripe shifted by one position because each destination attends heavily to its immediate predecessor. On a suitable repeated-token prompt, this position-based pattern should persist when the token identities change.{% sidenote "A shifted diagonal is evidence for previous-position attention, not a complete functional label. The head's output–value circuit determines what it copies from that position, and the pattern should be checked across inputs." %}

The **induction head** produces an off-diagonal stripe that breaks the regular diagonal pattern. At positions where a token repeats, the head attends not to the repeated token itself, but to the token that *followed* the previous occurrence. In the sequence "A B C D A B", the second "A" (position 5) attends strongly to "B" (position 2), and the second "B" (position 6) attends strongly to "C" (position 3). The pattern is content-dependent: it appears only at positions with repeated tokens and points to the position after the previous match.

These shapes are useful clues, not diagnoses. A clean shifted diagonal suggests a previous-token pattern, while off-diagonal spikes after repeated contexts suggest induction. Confirm the hypothesis across varied inputs and inspect what the head writes through its OV circuit.

## The Phase Change

In the small attention-only models studied by Olsson et al., a particular measure of in-context learning improves sharply during training, producing a visible change in the loss curve {% cite "olsson2022context" %}. Before this transition, extra context helps much less; afterward, the model makes better use of repeated patterns farther back in the sequence.

For these runs, the change is much sharper than a smooth learning curve would suggest. Before it, loss improves over the first part of the context and then plateaus. After it, useful context extends much farther. This is evidence for an abrupt change in the models studied, rather than a claim that every capability in every transformer emerges this way.

<figure>
  <img src="images/phase_change_icl.png" alt="Three panels showing in-context learning score over training for one-layer, two-layer, and three-layer attention-only transformers. The one-layer model shows no sudden improvement. The two-layer and three-layer models show a sharp drop in the in-context learning score during a highlighted phase change window early in training, indicating a sudden acquisition of in-context learning ability.">
  <figcaption>The phase change in in-context learning. One-layer models (left) show no sudden improvement. Models with two or more layers (center, right) undergo an abrupt improvement during a narrow training window (highlighted), corresponding to the formation of induction heads. From Olsson et al., <em>In-context Learning and Induction Heads</em>. {%- cite "olsson2022context" -%}</figcaption>
</figure>

Induction-like heads appear around the same training period as this transition, and several experiments support a causal role. In the small models tested, ablating the relevant heads substantially reduces the measured in-context-learning score. Architectural changes that restrict composition also delay or weaken the transition. Together, these results connect induction circuitry to the observed pattern-completion behavior, while leaving room for other mechanisms and other forms of in-context learning.

<details class="pause-and-think">
<summary>Pause and think: Phase changes and AI safety</summary>

The model suddenly gains a new capability at a specific point in training. What might this mean for AI safety? If capabilities can emerge abruptly rather than gradually, how does that affect our ability to predict what a model will be able to do? Consider whether other, more concerning capabilities might also emerge through sudden phase transitions.

</details>

## From Toy Models to Large Models

Despite being discovered in tiny attention-only models, induction-like heads have also been observed in much larger transformers. Their behavior is often less literal there: some respond to approximate or semantic matches rather than exact repeated tokens. That makes induction a plausible ingredient in richer context use, but not a complete explanation of it.{% sidenote "In small models, the circuit can look like literal token copying: see 'cat' again, then predict what followed 'cat' before. In larger models, researchers have found related heads with fuzzier matching behavior. Calling both cases 'induction' is useful, but the larger-model mechanism needs to be established rather than assumed from a similar-looking attention pattern." %}

The discovery matters because it connects a mechanism that can be derived cleanly in toy models to related behavior in larger systems. It offers a concrete test of a common mechanistic-interpretability strategy: use simple models to form precise hypotheses, then check how far those hypotheses transfer.{% sidenote "RASP (Restricted Access Sequence Processing Language) describes computations using operations that transformers can perform, such as selecting tokens, aggregating information, and composing operations across layers {% cite \"weiss2021rasp\" %}. The Tracr compiler can turn a subset of these programs into transformer weights, providing a bridge between an algorithmic description and a concrete model." %}

Induction heads are a canonical example of composition producing behavior that one attention layer cannot implement in the same way. The mathematical framework from the [composition and virtual heads](/topics/composition-and-virtual-heads/) article supplies the analytical tools; experiments then test whether the proposed two-step mechanism is actually present and causally relevant.

## Looking Ahead

We have seen a concrete circuit: two attention heads composing across layers to implement pattern completion. The next question is how to systematically measure the contribution of each component. [Direct logit attribution](/topics/direct-logit-attribution/) provides this tool, decomposing the model's output logits into per-component contributions and letting us ask precisely which heads matter most for any given prediction. Beyond attribution, the discovery of circuits like the induction head motivates the search for more complex circuits, such as the [IOI circuit](/topics/ioi-circuit/) that handles indirect object identification through a coordinated network of more than twenty attention heads.
