---
title: "SelfIE: Self-Interpretation of Embeddings"
description: "Injecting a hidden state where a model expects text so the model can describe that state, with applications to diagnosis, detection, and control."
order: 3
prerequisites:
  - title: "Patchscopes"
    url: "/topics/patchscopes/"

exitCriteria:
  - task: "SelfIE describes an injected state as \"a moral conflict about harming one person to save several.\" Design the controls that distinguish a grounded interpretation from a prompt-driven guess, and give the pattern each predicts."
    answer: |
      Two families of control, varying one factor at a time.

      **Hold the prompt fixed, vary the state.** Compare the original state against unrelated states, a mean-state baseline, and states from nearby layers and positions.
      - *Grounded:* descriptions change with the state; the moral-conflict description appears only for states from the moral scenario; the mean-state baseline yields something generic or incoherent.
      - *Prompt-driven:* every state produces a similar description, because the wording of "describe what this represents" plus the model's priors is doing the work.

      **Hold the state fixed, vary the prompt.** Paraphrase the interpretation prompt several ways.
      - *Grounded:* the content survives rewording; only the phrasing changes.
      - *Prompt-driven:* the description tracks the prompt's framing, and a differently-framed prompt yields a differently-themed answer from the same vector.

      The two patterns are opposite in a way that makes the test decisive: a grounded interpretation is sensitive to the state and insensitive to the prompt, and a guess is the reverse.

      The layer-neighbour control is the sharpest of the state variations. Adjacent layers carry nearly the same information, so a readout claiming fine-grained content should be stable across them — and if it is not, the specificity was manufactured.
  - task: "SelfIE emphasizes freeform description while Patchscopes uses targeted prompts. State what each design buys, and why freeform is the harder one to validate."
    answer: |
      **Targeted prompts** buy *checkability*. `"[PATCH] is the capital city of"` has a small answer space and often a known correct answer, so the readout can be scored — accuracy against ground truth, agreement across prompts. The cost is that you can only extract properties you thought to ask for.

      **Freeform** buys *discovery*. An open-ended description can surface aspects of a representation no researcher would have queried, which is the only way to learn something you did not already suspect. That is a real advantage and it is why the design exists.

      **Why freeform is harder to validate:** there is no answer key and no answer space. A multi-sentence description cannot be scored against ground truth, and "is this description right?" collapses into a human judging plausibility — which is precisely the judgment a fluent language model is optimized to satisfy. The interpretability-illusion structure applies directly: a description with good recall (it fits the examples) and unknown precision (it may fit much else) reads as correct.

      So freeform output should be treated as **hypothesis generation**, with the hypothesis then converted into something targeted and testable: derive a prediction from the description, and check it with a probe, a targeted patch, or an intervention.
  - task: "SelfIE is described as producing \"an elicited readout rather than a direct transcript of the model's reasoning.\" Explain the distinction and why it matters for claims about introspection."
    answer: |
      A **transcript** would mean the text reports internal content that was already there in propositional form — the model reading out something it had computed. An **elicited readout** means the text was *generated*, conditioned on the injected state, by the same next-token machinery that produces any other output. The state influences the generation; it does not dictate it.

      The difference shows up in what else the generation draws on: the interpretation prompt's framing, the model's linguistic priors, and whatever completions are plausible given the injected vector's rough position in activation space. All of that is mixed into the output, and none of it is marked.

      **Why it matters for introspection claims:** "the model can describe its own internal states" reads as evidence for a self-model, and this method cannot support that. Conditioning is causal relevance, not access. A description could be accurate because the model has an introspective route to its own representations, or because the injected vector shifts generation toward text associated with similar inputs — a purely associative mechanism with no self-knowledge involved.

      Separating them requires an experiment where the two predict differently, which is what [concept injection](/topics/concept-injection/) is designed to do: inject a known direction and ask whether the model reports the *internal change* before expressing the concept.

furtherReading:
  - title: "Chen et al., *SelfIE: Self-Interpretation of Embeddings*"
    url: "https://arxiv.org/abs/2403.10949"
    note: "The paper, including the supervised control and the reinforcement-learning application."
  - title: "Turpin et al., *Language Models Don't Always Say What They Think*"
    url: "https://arxiv.org/abs/2305.04388"
    note: "Why a fluent self-interpretation is weak evidence without an intervention that the report must track."
  - title: "Lanham et al., *Measuring Faithfulness in Chain-of-Thought Reasoning*"
    url: "https://arxiv.org/abs/2307.13702"
    note: "Faithfulness tests that apply directly to self-interpretation outputs, and are not run here."
---

## Self-Interpretation

[Patchscopes](/topics/patchscopes/) showed that we can patch representations into carefully designed prompts to extract information. SelfIE, introduced by Chen et al. {% cite "chen2024selfie" %}, takes a more direct approach: let the model explain its own embeddings in its own words.

Language models already know how to continue prompts that ask about a passage. SelfIE injects a hidden representation where such a passage would normally appear and asks the model to describe it. The continuation is a candidate interpretation whose faithfulness must be tested, not a transparent reading of the vector.

> **SelfIE (Self-Interpretation of Embeddings):** A framework for extracting natural language interpretations of hidden embeddings by injecting them into a model's context and prompting the model to describe what they represent. The model uses its own linguistic capabilities to translate internal representations into human-readable explanations.

## How SelfIE Works

The method operates in two phases:

**Interpretation.** Given a hidden embedding $\mathbf{h}$ from processing some input, we inject this embedding into a new forward pass. The injection replaces the representation at a designated position in a prompt like: "The following embedding represents: [INJECT]. Describe it:"

The model then generates a description conditioned on $\mathbf{h}$. Conditioning makes the hidden state causally relevant to the continuation, but the text can also draw on prompt framing and the model's prior beliefs.

**Freeform explanation.** Unlike Patchscopes, which uses targeted prompts to extract specific attributes, SelfIE emphasizes open-ended interpretation. The model is not constrained to output a category or attribute; it can produce multi-sentence explanations of what the embedding represents.

This distinction matters. Targeted prompts extract predetermined properties. Freeform interpretation may reveal unexpected aspects of what models represent, including nuances that a researcher would not have thought to query directly.

<details class="pause-and-think">
<summary>Pause and think: What would a convincing control remove?</summary>

Suppose SelfIE describes an injected state as "a moral conflict about harming one person to save several." How could you test whether that description came from the hidden state rather than from the wording of the interpretation prompt?

Keep the prompt fixed and compare the original state with unrelated states, a mean-state baseline, and states from nearby layers or positions. Then paraphrase the prompt while holding the state fixed. A grounded interpretation should track the injected state across prompt variants and change when the state changes; a prompt-driven guess will show the opposite pattern.

</details>

## Revealing Internal Reasoning

The original work tests whether SelfIE descriptions recover useful information across several domains:

### Ethical Decision-Making

When models process morally charged scenarios, what do their intermediate representations encode? SelfIE can extract natural language descriptions of these representations, revealing how the model represents ethical considerations.

For example, when processing a trolley problem scenario, intermediate embeddings might encode not just factual content ("a trolley is approaching") but normative content ("there is a moral dilemma about harm"). SelfIE makes these implicit representations explicit.

### Prompt Injection Detection

Prompt injection attacks attempt to hijack model behavior through adversarial inputs. SelfIE can reveal how models internalize such attacks by interpreting the embeddings produced when processing injected prompts.

If an injection is working, the embedding may encode something like "I should ignore previous instructions." If the model is resisting the injection, the embedding may preserve the original task context. This provides a window into the model's susceptibility to manipulation.

### Harmful Knowledge

Models may encode harmful information even when they refuse to express it directly. SelfIE can probe whether representations encode dangerous content by asking the model to describe what an embedding represents.

This is a double-edged sword. The same technique that helps researchers audit models for harmful knowledge could potentially be used to extract that knowledge. The authors are careful about this, using the method to identify where harmful knowledge resides rather than to elicit it directly.

## From Interpretation to Control

SelfIE goes beyond observation to enable model editing through two complementary mechanisms:

### Supervised Control

If we can describe what an embedding represents, we can also describe what we *want* it to represent. Supervised control works by:

1. Computing the embedding for an input
2. Computing a target embedding that represents the desired modification
3. Training a transformation that maps from original to target embeddings

The optimization requires gradients at the target layer rather than through the full model. In the study's setup, this supports targeted requests such as changing an embedding toward a representation associated with helpfulness rather than sycophancy. Whether the resulting edit has that semantic effect must still be checked behaviorally.

### Reinforcement Control

Sometimes we do not have explicit supervision targets. We know that certain embeddings encode harmful content, but we do not have labeled examples of "good" vs "bad" embeddings.

Reinforcement control applies a reward signal, such as human preference or a safety classifier, to how hidden states are processed without requiring an explicit target state. The optimization searches for transformations that improve that reward.

In principle, this can reduce a targeted behavior without specifying the replacement representation by hand. It does not establish that the associated knowledge has been removed: the model may preserve it elsewhere, learn a reward-specific shortcut, or change unrelated behavior.

## Limitations

**Interpretation reliability.** Models may produce fluent but inaccurate descriptions of their own embeddings. Without ground truth, validating interpretations is difficult.

**Layer selection.** Which layer's embeddings should be interpreted? Earlier layers encode more local information; later layers encode more abstract features. The choice affects what can be extracted.

**Control side effects.** Editing embeddings to remove harmful content may have unintended effects on related capabilities. The intervention is not surgical.

**Scalability.** Generating natural language interpretations for many embeddings is computationally expensive. This limits large-scale analysis.

## Relation to Patchscopes

SelfIE and Patchscopes are complementary approaches to the same goal:

| Aspect | Patchscopes | SelfIE |
|--------|-------------|--------|
| Prompt design | Targeted templates | Open-ended |
| Output format | Structured (fill-in-the-blank) | Freeform explanation |
| Cross-model | Yes (different S and M) | Same model only |
| Primary goal | Extract specific attributes | Reveal reasoning |
| Control | Indirect (via understanding) | Direct editing |

SelfIE emphasizes self-reference; Patchscopes allows distinct source and target models. Both use language generation as a readout of hidden states, and both require controls for prompt sensitivity and confabulation.

## Looking Ahead

A SelfIE description is still an elicited readout whose faithfulness needs an independent test. The next article, [Testing Introspection with Concept Injection](/topics/concept-injection/), reverses the setup: it injects a state with known content and asks whether the model can report the internal change before expressing it in text.
