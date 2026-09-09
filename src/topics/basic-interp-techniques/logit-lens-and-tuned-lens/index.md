---
title: "The Logit Lens and Tuned Lens"
seoTitle: "Logit Lens Explained: Predictions by Layer"
description: "See how the logit lens reads a transformer's predictions at every layer, why raw intermediate logits can mislead, and how the tuned lens corrects them."
order: 1
prerequisites:
  - title: "Direct Logit Attribution"
    url: "/topics/direct-logit-attribution/"

glossary:
  - term: "Logit Lens"
    definition: "An observational technique that applies the model's unembedding matrix to intermediate residual stream states, converting hidden representations into vocabulary-space predictions to see how the model's output evolves across layers."
  - term: "Tuned Lens"
    definition: "An improvement on the logit lens that trains a learned affine transformation at each layer (rather than reusing the final unembedding matrix), producing more accurate predictions of the model's evolving computation at intermediate layers."

exitCriteria:
  - task: "The tuned lens translators are trained to minimize KL divergence to the *final layer's* output distribution, not to ground-truth next tokens. Explain why that choice makes \"the model believes Paris at layer 8\" the wrong reading of a tuned-lens output."
    answer: |
      The training objective defines what the translator is: a **forecaster of the model's own eventual output**, given the layer-8 state. It is rewarded for predicting what layer 12 will say, by any linearly accessible route.

      So a confident "Paris" at layer 8 means: *there is an affine map from the layer-8 state that predicts the final distribution well.* That is compatible with the model having computed Paris by layer 8, but it is equally compatible with layer 8 carrying some other signal — the entity, the relation type, the language, a stylistic cue — that happens to be linearly predictive of what the model will conclude. The translator will happily use it, because the loss does not distinguish.

      The confusion is between what a *probe you trained* can extract and what the *model* computes. Nothing in the setup constrains the translator to resemble the model's actual layers 9 through 12; it is an entirely separate learned map. Calling its output a belief attributes to the model a computation performed by the analyst's probe.
  - task: "The raw logit lens produces garbled output at middle layers of GPT-Neo while the tuned lens produces coherent predictions there. Give two incompatible explanations of that gap, and say what would distinguish them."
    answer: |
      1. **Basis mismatch.** The prediction is present at that layer in essentially readable form, but expressed in a coordinate frame that later layers systematically transform before the unembedding sees it. The affine translator undoes a rotation-and-shift the model would have applied anyway, so the tuned lens is reading something real that the raw lens was misaligned with.
      2. **The translator is doing the work.** The layer's state contains predictive *ingredients* rather than a prediction, and the affine map is performing genuine computation — combining features into an answer the model has not yet formed. The coherence is manufactured by the probe.

      **What distinguishes them:** the capacity and behavior of the translator. Under (1) the translator should be close to a well-conditioned near-orthogonal map and should transfer across prompts with little loss; under (2) it will be doing something more like a learned classifier. The stronger test is causal: patch the layer-8 state with one whose tuned-lens readout says a different token, and see whether the final output follows. Under (1) it should; under (2) the model's own later layers may compute the original answer regardless, because the intermediate variable the lens reported was never there.
  - task: "Middle-layer vocabulary projections in a multilingual model skew toward English even on non-English input and output. Name the confounds that make \"the model thinks in English\" unsafe, and state the control each requires."
    answer: |
      **Confound 1: the unembedding is English-skewed.** The logit lens projects through $W_U$, whose columns were shaped by a training corpus that is mostly English. An intermediate state that is not "about" any language will still project onto English directions more than others, simply because there are more of them and they occupy more of the space. *Control:* compare against a baseline state — a random residual vector, or a state from a matched position on an unrelated prompt — and report the English skew relative to that, not in absolute terms.

      **Confound 2: token frequency.** English tokens are more frequent, and the raw logit lens is known to be biased toward frequent tokens at intermediate layers. *Control:* re-run with the tuned lens, which is calibrated against the final distribution, and check whether the effect survives.

      **Confound 3: tokenization.** English words are usually single tokens while other languages fragment into subwords, so the top-1 projected token is structurally more likely to be an English word. *Control:* compare at the level of a language's full word forms, or restrict to languages with comparable token granularity.

      What would earn the claim is causal: intervene on the putative English intermediate representation and show the non-English output changes as the account predicts.
  - task: "A logit lens shows \"Paris\" entering the top-1 at layer 8. State precisely what this licenses, what it does not, and the experiment that closes the gap."
    answer: |
      **Licensed:** at layer 8, the residual state at that position has a positive projection onto the "Paris" unembedding direction, larger than onto any other token's. That is a fact about alignment on this input, and it is exactly true.

      **Not licensed:** that layer 8 *computed* Paris; that the computation at layer 8 is necessary for the final prediction; that the model would predict Paris if you stopped there (the model has no mechanism for stopping there, and the later layers were trained expecting to run); or that the France-to-Paris transition between layers reflects a refinement step the model performs. Each of these is a causal claim, and the lens performs no intervention.

      **The experiment:** patch. Take a counterfactual prompt about a different landmark, cache its layer-8 residual state at that position, substitute it into the original run, and measure the change in the Paris logit. A large change establishes that the layer-8 state at that position mediates the prediction. Sweeping layer and position turns this into the standard grid, which is what identifies *where* the information is required rather than merely where it is visible.

      The general form: observation proposes; a specified counterfactual disposes.

furtherReading:
  - title: "Belrose et al., *Eliciting Latent Predictions from Transformers with the Tuned Lens*"
    url: "https://arxiv.org/abs/2303.08112"
    note: "The full method, including the prediction-trajectory analysis and the causal basis extraction this article does not reach."
  - title: "nostalgebraist, *interpreting GPT: the logit lens*"
    url: "https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens"
    note: "The original post. Its caveats about which models the lens works on are more explicit than most later summaries."
  - title: "Din et al., *Jump to Conclusions: Short-Cutting Transformers With Linear Transformations*"
    url: "https://arxiv.org/abs/2303.09435"
    note: "Linear shortcuts between layers, which is the tuned lens idea arrived at independently and evaluated differently."
  - title: "Wendler et al., *Do Llamas Work in English?*"
    url: "https://arxiv.org/abs/2402.10588"
    note: "The lens used to make a substantive claim about a latent representational language. A good model of what the technique is for once the mechanics are understood."
---

## Looking Inside the Model

[Direct logit attribution](/topics/direct-logit-attribution/) projects component writes toward output logits, while attention patterns show where a head reads. Vocabulary lenses ask a different observational question: what token-level scores can we extract from an intermediate residual state?

The **logit lens** applies the unembedding matrix directly to intermediate layers. The **tuned lens** learns a correction for each layer's changing basis. Both reveal decodable information, but neither shows that the model uses it.

## The Logit Lens

The [unembedding matrix](/topics/embeddings/#from-the-residual-stream-back-to-tokens) $W_U$ maps the final residual stream to vocabulary logits. The logit lens, introduced by nostalgebraist in 2020, asks a simple question: what if we applied $W_U$ to intermediate layers? {% cite "nostalgebraist2020logitlens" %}

At each layer $\ell$, we apply the model's final readout early:

$$
\text{LogitLens}(\mathbf{h}_\ell) = \text{LayerNorm}(\mathbf{h}_\ell) \cdot W_U
$$

This gives vocabulary logits at every layer. Applying softmax produces a diagnostic distribution, although the model itself does not normally stop and emit from that layer.

> **Logit Lens:** The logit lens applies the final normalization and unembedding to an intermediate residual state. Its vocabulary logits show how that state aligns with the model's output directions before later layers transform it.

Consider a concrete example. When GPT-2 Small processes the prompt "The Eiffel Tower is located in the city of ___", it predicts "Paris" with 93% probability at the final layer. But at which layer does the model first "know" it will predict Paris?

![Logit lens applied layer by layer to the prompt about the Eiffel Tower, showing how the top predicted token evolves from generic words in early layers to the correct answer Paris in later layers.](/topics/logit-lens-and-tuned-lens/images/logit_lens_eiffel.png "Figure 1: The logit lens applied layer by layer to GPT-2 Small processing 'The Eiffel Tower is located in the city of ___'. Early layers produce generic predictions. The correct answer emerges gradually across middle and later layers.")

In this example, early-layer projections favor frequent generic tokens. A country-related token appears in the middle layers, and “Paris” becomes the top projected token later. This progression is a useful hypothesis about staged factual processing, but the lens alone cannot tell whether the “France” score is an intermediate variable the model uses or an incidental alignment with the unembedding.{% sidenote "A readable sequence of tokens invites a narrative. Treat that narrative as a prediction to test with component-level and causal methods, especially because another lens or prompt may produce a different sequence." %}

The logit lens tells us *when* the answer appears, but not *how* the model computes it. It is a descriptive tool that shows the result of processing at each layer, revealing the trajectory without explaining the mechanism. The transition from "France" to "Paris" is interesting, but the logit lens alone cannot tell us which heads or MLPs are responsible for that transition.

### Limitations of the Logit Lens

The raw logit lens can be biased toward frequent tokens and poorly calibrated at intermediate layers, with severity varying by model {% cite "nostalgebraist2020logitlens" %}. Later layers are trained to transform intermediate states before the final unembedding is applied, so an early state need not already align with output directions in a directly readable way.

A poor raw projection does not distinguish absent information from information accessible through another map. The tuned lens tests whether a learned affine translator can predict the final distribution more accurately.

## The Tuned Lens

The tuned lens, introduced by Belrose et al. in 2023, trains a learned affine translator at each layer {% cite "belrose2023tunedlens" %}:

$$
\text{TunedLens}(\mathbf{h}_\ell) = (\mathbf{h}_\ell A_\ell + \mathbf{b}_\ell) \cdot W_U
$$

Each translator consists of a matrix $A_\ell$ and bias $\mathbf{b}_\ell$, trained so the translated state predicts the model's final output distribution. The affine map can compensate for systematic rotations, shifts, stretches, and other linearly correctable differences.

> **Tuned Lens:** The tuned lens trains an affine translator at each layer to predict the final output distribution through the unembedding. It often produces better-calibrated intermediate readouts than the raw logit lens, at the cost of a learned probe.

<figure>
  <img src="images/tuned_lens_comparison.png" alt="Side-by-side comparison of logit lens (top) and tuned lens (bottom) applied to GPT-Neo-2.7B. The logit lens produces incoherent predictions at early and middle layers, while the tuned lens produces meaningful token predictions starting from much earlier layers.">
  <figcaption>Logit lens (top) vs. tuned lens (bottom) applied to GPT-Neo-2.7B. The logit lens produces garbled predictions at early layers because intermediate representations use a different basis than the final layer. The tuned lens corrects for this, yielding coherent predictions across all layers. From Belrose et al., <em>Eliciting Latent Predictions from Transformers with the Tuned Lens</em>. {%- cite "belrose2023tunedlens" -%}</figcaption>
</figure>

A critical design choice is that the translators minimize KL divergence to the *final layer's* output distribution, not to ground-truth labels. The lens is therefore trained to forecast the model's eventual prediction. A token score at layer 4 should not automatically be called the model's belief at layer 4; the translator may use any linearly accessible signal that helps predict the final distribution.

Comparing the lenses separates two questions: how an intermediate state aligns with the existing unembedding, and how well a learned affine probe can forecast the final output. Better tuned-lens performance shows that useful predictive signal is linearly accessible to the translator; it does not prove that later layers implement that translator or that the decoded token is an explicit intermediate variable.{% sidenote "The tuned lens improved perplexity and calibration over the raw lens in the reported comparisons. The raw lens remains useful when the research question specifically concerns direct alignment with the unembedding or when avoiding a trained probe matters." %}

<details class="pause-and-think">
<summary>Pause and think: What the logit lens failure tells us</summary>

The logit lens fails on some models but the tuned lens works. What does this tell us about how models represent information across layers? Does every layer use the same coordinate system?

No single readout is guaranteed to be equally calibrated at every depth. The final unembedding is trained for the final state, while an affine translator can recover predictive structure from earlier states. This is consistent with systematic representational changes across depth, but tuned-lens success does not identify the exact transformation used by the model's later layers.

</details>

## Applications of the Logit Lens Observation

The observation that layerwise projections differ has inspired [decoding methods](/topics/decoding-strategies/). **DoLa** (Decoding by Contrasting Layers) contrasts early- and late-layer logit distributions during generation {% cite "li2023dola" %}. It improved factuality metrics on the reported benchmarks without fine-tuning, supporting the practical value of the contrast even though the layerwise scores need not be literal beliefs.

Wendler et al. {% cite "wendler2024latent" %} found that middle-layer vocabulary projections in multilingual models often skew toward English, even for non-English inputs and outputs. This is consistent with an English-biased intermediate representation. Because the unembedding and token frequencies can also favor English, stronger claims about internal translation require controls beyond the projection itself.

Yang et al. {% cite "yang2024multihop" %} combined vocabulary projections with [activation patching](/topics/activation-patching/) to test a staged account of multi-hop factual questions. Intermediate-entity tokens appeared in middle-layer projections, and interventions supplied additional evidence about where relevant information affected the answer. The causal evidence is what turns a readable trajectory into more than a story about token scores.

## The Key Limitation: Observation Cannot Establish Causation

The logit lens and tuned lens show what the model would predict if processing stopped at a given layer. They reveal the trajectory of predictions across layers. But they do not tell us which components are responsible for those predictions or whether the computation at any particular layer is necessary.

The logit lens shows "Paris" at layer 8, but is the computation at layer 8 *necessary* for predicting "Paris"? These observational tools establish *correlations*: the information co-occurs with the activations. To establish *causation*, we need a different kind of experiment, one where we *intervene* on the model's internals and observe changes in behavior.

This is the shift from observation to causation. [Activation patching](/topics/activation-patching/) replaces one component's activation with an activation from a different input and measures the effect on predictions. These causal tools complete the methodological toolkit, moving us from "what exists?" to "what matters?"

Observation proposes what may be accessible; a well-designed intervention tests what changes under a specified counterfactual.
