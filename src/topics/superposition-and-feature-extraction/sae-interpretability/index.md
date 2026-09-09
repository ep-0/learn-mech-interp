---
title: "Feature Dashboards and Automated Interpretability"
description: "Turning sparse-autoencoder features into hypotheses using activation examples, dashboards, and automated explanations, and checking where those labels fail."
order: 2
prerequisites:
  - title: "Sparse Autoencoders: Decomposing Superposition"
    url: "/topics/sparse-autoencoders/"

glossary:
  - term: "Automated Interpretability"
    definition: "Methods that use language models to automatically generate and score natural language explanations of what individual neurons or features represent, reducing the need for manual inspection."
  - term: "Feature Dashboard"
    definition: "A visualization tool that displays the top-activating dataset examples, logit effects, and other statistics for individual SAE features, helping researchers assess whether a feature corresponds to an interpretable concept."

exitCriteria:
  - task: "A feature is described as \"responds to safety-related content.\" Explain the interpretability illusion this description can hide, in terms of precision and recall."
    answer: |
      The description is checked in the direction that cannot falsify it. You look at the feature's top activations, and they are all safety-related — so the description has **good recall**: it covers what the feature does fire on.

      What goes untested is **precision**: whether the feature fires on safety content *in general*. The feature may actually respond to a much broader category that happens to include safety text — a particular register, a discourse marker, a formatting pattern — of which your top examples are the safety-flavored slice. Reading the description forward, you would predict it fires on safety content it in fact ignores, and on nothing else when it in fact fires widely.

      The asymmetry comes from the sampling procedure. Top-$k$ activations condition on the feature, so they can only ever show you what it does fire on. Precision requires the other direction: take the description, generate inputs it predicts should activate the feature, and check whether they do; and sample the feature's *moderate* activations, not its extremes, where a second population would live.

      Broad descriptions are the dangerous case because they are hardest to falsify — "this feature fires on text" has perfect recall.
  - task: "Automated interpretability tests a generated description on held-out examples. Say what a passing test establishes, and name the structural concern with using one language model to interpret another."
    answer: |
      **What passing establishes:** the description is *predictive*, not merely fitted. It was generated from one set of activations and correctly anticipates the feature's behavior on inputs the describing model never saw — firing on new legal citations, staying quiet on non-legal text. That is a real step up from a label chosen to summarize top examples, which is unfalsifiable by construction.

      **What it still does not establish:** monosemanticity, since the held-out set may simply not contain the feature's second activating pattern; or causal relevance, since nothing in the pipeline touches what the model does with the feature.

      **The structural concern is circularity.** The evaluating model has its own blind spots, and they are correlated with the target model's — similar architectures, similar training data, similar inductive biases. A feature tracking something no language model represents well is a feature the interpreter is least equipped to describe. Concretely: a feature responding to a specific syntactic construction can look like noise to an interpreter attending to semantics, and will be scored as uninterpretable rather than as interpretable-and-missed.

      The failures are therefore not random. They are systematically concentrated on whatever both models are bad at, which is the worst possible place for an evaluation to be blind.
  - task: "A dashboard shows minimal ablation impact for a feature. List four explanations besides \"the feature is unimportant,\" and say what the list implies about reading dashboards."
    answer: |
      1. **Redundancy.** Another feature or component carries the same information, so removing this one changes nothing — the OR-gate structure that also hides primary components under noising.
      2. **The wrong baseline.** Ablation replaces the feature's reconstructed contribution with something, and that something has consequences. A choice that is off-distribution can produce effects unrelated to the feature; a choice too close to the natural value can produce none.
      3. **The wrong metric or dataset.** The feature may matter for a behavior your ablation does not measure, or on text your evaluation set does not contain. A feature for legal citations shows nothing on a corpus without legal text.
      4. **Self-repair.** Downstream components compensate, including LayerNorm rescaling, which is mechanical and always present.

      **What it implies:** each dashboard panel is a hypothesis generator, not a verdict, and a null result is the weakest evidence of the three. Activation examples show what the feature responds to on selected inputs; logit effects show the direct write only; ablation shows one intervention under one baseline. The dashboard's value is that the three views *agree or disagree*, and disagreement is the signal worth chasing.
  - task: "512 neurons yielded about 4,000 features — an 8× ratio. Extrapolate to a frontier model, and say what evaluation strategy the resulting number forces."
    answer: |
      GPT-2 Small's 768 residual dimensions would give roughly $6{,}000$ features per layer, so around $70{,}000$ across 12 layers. A frontier model with tens of thousands of dimensions and many more layers reaches millions — and the Claude 3 Sonnet SAEs did, with dictionaries up to $34$ million latents and about $12$ million active.

      At one minute per dashboard, a million features is roughly two person-years of continuous inspection, so manual review of everything is not a resourcing problem but an impossibility.

      **The strategy this forces is stratified, not uniform.** Automated interpretability handles breadth: generate a description for every latent and score it by prediction on held-out activations, which gives a coverage number and flags the latents worth a human. Human evaluation runs on a *random sample*, which is what supports a claim about the population — the 70% figure is a sample statistic, and it is only meaningful because the sample was random. Detailed case studies and causal tests go to the small set that matters for a specific question.

      What this cannot deliver is per-feature confidence at scale. Any claim of the form "we understand this model's features" is a claim about an aggregate, with unexamined individuals inside it.

furtherReading:
  - title: "Bills et al., *Language Models Can Explain Neurons in Language Models*"
    url: "https://openaipublic.blob.core.windows.net/neuron-explainer/paper/index.html"
    note: "Automated interpretability with the explanation-scoring protocol, which is the part most later work reuses and most summaries omit."
  - title: "Huang et al., *Rigorously Assessing Natural Language Explanations of Neurons*"
    url: "https://arxiv.org/abs/2309.10312"
    note: "Automated explanations evaluated properly, with the finding that high scores do not imply the explanation predicts activations."
  - title: "Paulo et al., *Automatically Interpreting Millions of Features in Large Language Models*"
    url: "https://arxiv.org/abs/2410.13928"
    note: "Scaling the pipeline, plus several scoring methods compared. The practical state of the art for dashboards at scale."
  - title: "Anthropic, *Circuits Updates* on feature visualization and interface design"
    url: "https://transformer-circuits.pub/"
    note: "The dashboard is an interface, and its design choices shape what interpretations occur to you. Rarely discussed and worth attention."
---

## What Monosemantic Features Look Like

A [sparse autoencoder](/topics/sparse-autoencoders/) trained on a one-layer transformer extracts over 4,000 features from just 512 neurons {% cite "bricken2023monosemanticity" %}. Each feature is a direction in activation space with a corresponding latent dimension in the SAE. But how do we know that these features are genuinely interpretable? How do we move from "this latent dimension activates on certain inputs" to "this feature represents Arabic script" or "this feature detects legal citations"?

The answer requires systematic inspection. A feature is not interpretable just because it exists in the SAE's latent space. It is interpretable when a human can examine the inputs that activate it and state a coherent rule that predicts its behavior. The tooling and methodology for this inspection are the subject of this article.

Some of Bricken et al.'s inspected SAE latents had unusually coherent activation sets {% cite "bricken2023monosemanticity" %}. Examples responded predominantly to Arabic script, DNA sequences, legal language, HTTP requests, Hebrew text, or nutrition statements. These cases are much easier to label than the polysemantic neurons used as baselines, but “Arabic” remains a hypothesis to test on rare scripts, transliterations, code, and adversarial counterexamples.{% sidenote "A concise label summarizes observed behavior; it does not tell us every condition under which the latent fires, what information is absent when it stays quiet, or how the model uses it. Good dashboard work actively searches for examples that break the proposed label." %}

<figure>
  <img src="images/arabic-feature-activation.png" alt="Feature activation distribution for an Arabic script feature (A/1/3450). The top section shows dataset examples with tokens highlighted in proportion to activation strength, all containing Arabic script text. The bottom section shows a density plot of feature activation levels, broken down by log-likelihood ratio of whether the token is Arabic script. Red indicates Arabic tokens and blue indicates non-Arabic tokens. The feature activates almost exclusively on Arabic text.">
  <figcaption>Activation distribution for the Arabic script feature (A/1/3450). Top: dataset examples with tokens highlighted by activation strength. Bottom: density plot broken down by Arabic script log-likelihood ratio, showing the feature fires almost exclusively on Arabic text (red) while rarely activating on non-Arabic text (blue). From Bricken et al., <em>Towards Monosemanticity</em>. {%- cite "bricken2023monosemanticity" -%}</figcaption>
</figure>

## Feature Dashboards

Feature dashboards became the standard tool for inspecting SAE features. A dashboard compiles three complementary views of what a feature does, giving researchers enough information to assess whether the feature represents a coherent concept.

> **Feature Dashboard:** A visualization showing three key pieces of information about an SAE feature: (1) the text examples where the feature activates most strongly, with activating tokens highlighted; (2) the tokens the feature promotes or suppresses in the model's output when active (logit effects); and (3) the impact of removing the feature from the representation (ablation).

<figure>
  <img src="images/feature-dashboard-annotated.png" alt="Annotated feature dashboard from the Towards Monosemanticity interface. Labels point to each component: the feature number and hyperlink, human explanation, autointerp explanation and prediction score, top correlated neurons by feature activation and by token correlation, a histogram of randomly sampled non-zero activations, top negative and positive logit effects, top 20 max activating examples with highlighted tokens and colored underlines indicating ablation loss, and ten evenly spaced intervals spanning the full range of activation values.">
  <figcaption>Annotated feature dashboard showing each component of the visualization interface: activation examples with highlighted tokens, logit effects, activation distribution, correlated neurons, and ablation impact (colored underlines). From Bricken et al., <em>Towards Monosemanticity</em>. {%- cite "bricken2023monosemanticity" -%}</figcaption>
</figure>

**Activation examples** are the most intuitive component. The dashboard shows text excerpts where the feature fires strongly, with the specific tokens that triggered activation highlighted. If a feature is truly monosemantic, the top activation examples will all share a common theme. For a legal language feature, every top example will contain court cases, statutes, or legal terminology. For a DNA feature, every example will contain genetic sequences. The consistency of the top examples is the first test of interpretability.

**Logit effects** show the feature direction's direct projection onto output logits. Each row of the SAE decoder is a direction; multiplying it by the unembedding reveals which tokens that direction directly promotes or suppresses. Legal tokens in both the activation examples and the direct logit effect strengthen a legal-language hypothesis. They do not capture transformations through later layers, so an intervention is still needed for a causal claim.{% sidenote "Direct logit effects answer what the direction would write through the unembedding at this point. The model may rotate, amplify, cancel, or ignore that write downstream." %}

**Ablation impact** measures what changes when a feature's reconstructed contribution is removed. A selective drop on held-out legal text would support a role in that behavior, while effects on other domains would challenge the narrow label. A small effect may indicate irrelevance, redundancy, an incomplete intervention, or a metric that misses the feature's role.

## How to Read a Dashboard

Reading a dashboard well requires looking for both positive and negative evidence. A well-behaved monosemantic feature shows a consistent pattern across all three views:

- The top activation examples all share a recognizable theme.
- The logit effects are consistent with that theme.
- Ablation causes degradation specifically on inputs related to that theme.

But not all features are clean. Several warning signs indicate that a feature may not be as interpretable as it first appears:

**Mixed activation examples.** If the top activations include legal text, code, and poetry, the feature may still be polysemantic, representing a blend of concepts rather than a single one. This can happen when the SAE does not have enough latent dimensions to fully decompose all the features the model represents. Larger SAEs with higher expansion factors can sometimes resolve these mixed features by splitting them into finer sub-features.

**Inconsistent logit effects.** If the feature promotes unrelated types of tokens, legal terms, cooking vocabulary, and mathematical symbols, it likely represents a blend of concepts. The logit effects should tell the same story as the activation examples.

**Minimal ablation impact.** A feature with little measured effect may be dead or redundant, but the result can also reflect the chosen baseline, dataset, metric, or downstream self-repair. Treat it as a reason for further testing, not an automatic verdict.

<details class="pause-and-think">
<summary>Pause and think: Evaluating a feature</summary>

Suppose you are examining an SAE feature whose top activation examples all contain the word "bank." The examples include sentences about river banks, financial banks, and data banks. Is this feature monosemantic? How would you use the logit effects and ablation results to resolve the ambiguity?

If the direct logit effects promote financial terms such as *interest*, *deposit*, and *loan*, that supports a financial-bank interpretation, while the river-bank examples may be false positives linked by surface form. Mixed effects would instead support a word-form account. An ablation that selectively degrades relevant financial predictions would add causal evidence, though it would still not make the label a complete definition of the latent.

</details>

## Automated Interpretability

With 4,000+ features from a tiny one-layer transformer, manual inspection of every feature dashboard is already time-consuming. At production scale, SAEs extract millions of features. Inspecting each one manually is impossible. How do you evaluate whether millions of features are interpretable?

The solution is to use another language model to automatically describe and evaluate features. The automated interpretability pipeline works in three steps:

1. **Show the LLM many examples** where the feature activates strongly, with the activating tokens highlighted.
2. **Ask the LLM to generate a description** of what the feature responds to (for example, "This feature fires on legal citations and statutory references").
3. **Test the description on held-out examples:** Does the feature fire on new legal citations that the LLM has not seen? Does it stay quiet on non-legal text?

If a description predicts activation on held-out data, it is more useful than a label fitted only to the top examples. The test still does not prove monosemanticity: the evaluation set may omit a second activating pattern, or the description may capture a correlate. If prediction fails, the latent may be mixed or the description may simply be too narrow.{% sidenote "Automated interpretability has a circularity concern: one neural network is used to assess claims about another. Blind spots in the evaluating model can bias the result, which is why predictive description tests should complement rather than replace manual and causal checks." %}

## The Promise and Limits of Automated Interpretation

Automated interpretability enables the kind of broad coverage that manual analysis cannot achieve. Bricken et al. used it alongside human evaluation to assess thousands of features, combining targeted manual investigation of important features with automated screening of the full feature set {% cite "bricken2023monosemanticity" %}.

But automated interpretability is imperfect in important ways. It can miss subtle patterns that a human expert would catch, a feature that responds to a specific syntactic construction may look like noise to an LLM that focuses on semantic content. It may generate overly broad descriptions: "this feature fires on text" is technically correct for a feature that responds to English prose, but the description is useless for understanding what the feature does.{% sidenote "The risk of overly broad descriptions connects to what Bolukbasi et al. (2021) called the 'interpretability illusion': explanations that have good recall but poor precision. A feature described as 'responds to safety-related content' might actually fire on a much broader category that includes safety text along with many other things. The description looks right when you check it against the feature's activations (good recall), but it incorrectly predicts that the feature would fire on safety content it actually ignores (poor precision)." %}

More fundamentally, automated interpretability scales one kind of evaluation; it does not replace careful analysis of important features. The pipeline can test whether many latents admit descriptions that predict their activation patterns. It cannot by itself tell us whether those latents are causally meaningful or whether they correspond to computations the model uses rather than statistical patterns in its activations.

The combination of all four evaluation methods, detailed case studies for important features, human evaluation on random samples, automated interpretability on activations for broad coverage, and automated interpretability on logit weights for understanding downstream effects, gives the most reliable picture of feature quality. No single method is sufficient on its own.

## From Features to Function

Feature dashboards and automated interpretability give us tools to inspect what SAE features represent. But inspection is only the first step. The deeper question is whether these features can serve as the building blocks for a mechanistic understanding of the model.

When an SAE latent is stable, predictively describable, and causally useful, it offers a path around the [polysemanticity problem](/topics/superposition/#why-superposition-makes-interpretability-hard) that frustrates neuron-level analysis. Feature-level circuit analysis can then use a more specific unit than a whole neuron or head. The evaluation burden matters because a coherent label alone does not establish those stronger properties.

Whether this promise holds at scale is the subject of the next articles. [Scaling monosemanticity](/topics/scaling-monosemanticity/) examines what happens in much larger models. [SAE variants and evaluation](/topics/sae-variants-and-evaluation/) then covers architectural improvements and failure modes that feature dashboards alone cannot reveal.

<details class="pause-and-think">
<summary>Pause and think: The scalability challenge</summary>

The one-layer transformer in Bricken et al.'s experiment had 512 MLP neurons and the SAE extracted about 4,000 features, an 8x ratio. If this ratio holds for larger models, a model like GPT-2 Small with 768 residual stream dimensions might contain over 6,000 features per layer, and a model like Claude 3 Sonnet with tens of thousands of dimensions could contain millions of features across all layers.

How would you evaluate millions of features? Manual dashboard inspection is clearly impossible. Can automated interpretability handle this scale? What new evaluation methods might be needed?

</details>
