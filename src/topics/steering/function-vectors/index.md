---
title: "Function Vectors"
description: "How researchers extract task-related activation vectors from in-context examples, test them by intervention, and probe the limits of task composition."
order: 5
prerequisites:
  - title: "Representation Control"
    url: "/topics/representation-control/"
  - title: "In-Context Learning and Prompting"
    url: "/topics/in-context-learning/"

glossary:
  - term: "Function Vector"
    definition: "A direction in activation space that encodes an input-output function (such as 'translate English to French' or 'convert to past tense') rather than a static concept, enabling task transfer when added to unrelated prompts."

exitCriteria:
  - task: "Contrast a function vector with a concept direction like the truth or refusal direction. What kind of thing does each encode, and why is that difference notable?"
    answer: |
      A **concept direction** encodes *what is present*: this text is truthful, this request is harmful, this token is about sentiment. It is a property of the input, and steering along it changes what the model treats the situation as being.

      A **function vector** encodes *what to do*: translate English to Spanish, return the antonym, extract the first letter. It is a property of the task, and inserting it makes the model perform an operation rather than adopt a stance.

      The difference is notable because it says the model carries a compact, transportable representation of an *operation* — something closer to a program than a label. Insert it into a prompt with no demonstrations, and the model performs the demonstrated task, so the few-shot examples were not needed as examples; what they produced was this vector, and the vector alone suffices to reinstate part of the behavior.

      It also arose differently. Every other steering vector on this site is engineered — a human designed contrasting stimuli and subtracted. A function vector is produced by the model's own in-context-learning computation and located by causal mediation. The researcher still chooses the task, the examples, the heads, and the extraction method, so it is less hand-designed rather than unsupervised.
  - task: "A function vector extracted from cat/gato and dog/perro pairs affects new translation items not among the demonstrations. Say what this transfer rules out and what it leaves open."
    answer: |
      **Rules out:** that the vector is a lookup of the demonstration tokens. If it merely carried "gato" and "perro" — the answers it was extracted from — it could not help on a word it never saw. Transfer to held-out items means the vector carries something at the level of the *operation*, not the instances.

      That is the crucial control, and it is easy to fail: a vector built from few-shot examples has every opportunity to encode the specific outputs, and a demonstration of the model repeating them would look like task transfer.

      **Leaves open:**

      - **How much of the task it carries.** Recovery is partial in the reported settings, so the vector is a component of the mechanism rather than the whole of it.
      - **Whether the vector is task-specific.** Does the translation vector do anything on antonym prompts? Without an off-target test, "translate" may be a label for a broader effect.
      - **Whether the intact model uses it.** The vector was extracted by mediation analysis and validated by insertion. Whether the model's ordinary in-context learning routes through this direction is a further claim.
      - **Scope.** Success depends on task, model, layer, and target prompt, none of which the transfer result characterizes.
  - task: "In the term \"function vector,\" *function* describes the vector's tested effect rather than an exhaustive decoding of its contents. Explain the risk that distinction is guarding against."
    answer: |
      The risk is **reifying a label into a mechanism**. Once a vector is called a function vector for translation, it is natural to reason about it as if it were the model's representation of the translation operation — to ask where the model stores its functions, whether they compose, what the function inventory is. Every one of those questions presupposes something the evidence does not establish.

      What was established: adding this vector at this site recovers part of this behavior on held-out inputs. Consistent with that: the vector is a task representation; or it is one component of a distributed task signal; or it primes a set of heads whose activity happens to produce translation-like behavior; or it carries an output-format cue that constrains generation into the demonstrated shape.

      The warning matters most where it is least visible. A well-chosen name compresses a finding, and then the compression gets reasoned with rather than the finding. "Knowledge neuron," "deception feature," "induction head" in a large model, and "function vector" share this shape: a tested effect, named for its most interesting possible interpretation, subsequently treated as having established it.

      The defense is to keep the operational statement attached — what was inserted, where, and what fraction of what behavior returned.

furtherReading:
  - title: "Todd et al., *Function Vectors in Large Language Models*"
    url: "https://arxiv.org/abs/2310.15213"
    note: "The full extraction procedure, the causal tests, and the composition experiments."
  - title: "Hendel, Geva & Globerson, *In-Context Learning Creates Task Vectors*"
    url: "https://arxiv.org/abs/2310.15916"
    note: "The same phenomenon found independently with a different method. Reading both is the cheapest way to see what is robust."
  - title: "Ilharco et al., *Editing Models with Task Arithmetic*"
    url: "https://arxiv.org/abs/2212.04089"
    note: "Task vectors in weight space rather than activation space. Not covered here, and the parallel is instructive."
  - title: "Yin & Steinhardt, *Which Attention Heads Matter for In-Context Learning?*"
    url: "https://arxiv.org/abs/2502.14010"
    note: "Function-vector heads and induction heads compared directly, which bears on what mechanism actually drives in-context learning."
---

## From Engineered to Natural Directions

So far, every steering vector we have encountered has been **engineered**: we chose contrasting prompts, ran them through the model, and computed the difference. [Addition steering](/topics/addition-steering/) uses contrast pairs. [CAA](/topics/caa-method/) averages over many pairs. The [refusal direction](/topics/refusal-direction/) used harmful versus harmless prompts. In every case, a human designed the contrastive stimuli.

Can a model's own in-context-learning computation produce a reusable task signal? Todd et al. (2024) used causal mediation analysis to extract directions associated with tasks such as translation and antonym generation {% cite "todd2024function" %}. The key test is intervention: inserting the extracted signal can recover some task behavior in a new context.

> **Function Vector:** An activation direction extracted from in-context-learning examples that can induce aspects of the demonstrated task when inserted elsewhere. Researchers still choose the task, examples, heads, and extraction method; “function” describes the vector's tested effect, not an exhaustive decoding of its contents.

## What Function Vectors Are

Todd et al. applied causal mediation analysis to in-context learning (ICL). When a model processes few-shot examples like:

```
cat -> gato
dog -> perro
house -> ???
```

the examples demonstrate English-to-Spanish translation. But where does the model carry information about that task?{% sidenote "Induction heads explain one pattern-copying mechanism that can support in-context learning. Function-vector experiments ask a different question: whether a reusable task-related signal is transported by a small set of heads. Neither result alone explains all in-context learning." %}

The analysis revealed:

- A small number of attention heads transport a compact representation of the demonstrated task.
- This representation is a **function vector**, a direction that encodes *what to do* (translate, capitalize, find antonyms), not just *what is present* (sentiment, topic, language).

<figure>
  <img src="images/function-vector-overview.png" alt="Overview of function vectors. A function vector is extracted from in-context learning examples of antonym generation or English-to-Spanish translation, then inserted into an unrelated natural text generation context to induce the learned task.">
  <figcaption>A function vector extracted from in-context learning examples (a, b) transfers to an unrelated zero-shot context (c, d), causing the model to perform the demonstrated task without any examples present. From Todd et al., <em>Function Vectors in Large Language Models</em>. {%- cite "todd2024function" -%}</figcaption>
</figure>

Examples of tasks encoded as function vectors: "translate English to French," "convert uppercase to lowercase," "return the antonym," "extract the first letter."

## Robustness

Function vectors can **transfer** across some inputs and contexts.

Extract a function vector from in-context examples, such as several English-to-Spanish translation pairs. Then inject it into a prompt with no demonstrations and measure task performance. In the reported settings, the intervention recovers part of the demonstrated behavior on held-out inputs.{% sidenote "For example, a vector extracted from pairs such as cat/gato and dog/perro can affect new translation items. Transfer beyond the extraction examples is evidence for task-level information, but performance and specificity determine how strong that claim should be." %}

Transfer to held-out inputs is evidence that the vector carries more than a lookup of the demonstration tokens. Its success rate and scope still depend on the task, model, layer, and target prompt.

<details class="pause-and-think">
<summary>Pause and think: What function vectors tell us</summary>

Engineered steering vectors encode concepts that humans chose. Function vectors encode tasks that the model learned to represent through in-context learning. What does the existence of function vectors tell us about how transformers organize information internally? And how does this connect to the linear representation hypothesis?

Function vectors suggest that residual-stream directions can carry information used to select a task, not only information about the input. That extends the linear representation hypothesis in a testable way: a task-related direction should transfer across examples and causally change task performance when added or removed.

</details>

## Composability

Function vectors can be **summed** to create new composite tasks:

- "Translate to French" + "convert to uppercase" = "translate to French in uppercase"

This vector arithmetic for tasks is analogous to the semantic vector arithmetic that made word embeddings famous (king - man + woman = queen), but operating at a much higher level. Instead of composing *word meanings*, we are composing *computations*.

<figure>
  <img src="images/function-vector-composability.png" alt="Composability of function vectors. Panel (a) shows four list-oriented tasks (First-Copy, First-Capital, Last-Copy, Last-Capital) with their expected outputs. Panel (b) shows the parallelogram arrangement: adding the First-Capital and Last-Copy vectors and subtracting the First-Copy vector yields the Last-Capital vector.">
  <figcaption>Function vector algebra. Three task vectors (First-Copy, First-Capital, Last-Copy) compose via addition and subtraction to produce a fourth (Last-Capital), forming a parallelogram in activation space. From Todd et al., <em>Function Vectors in Large Language Models</em>. {%- cite "todd2024function" -%}</figcaption>
</figure>

Successful examples show that linear combination can be meaningful when the component tasks are compatible. Failed or interfering combinations are just as important for determining how far this geometric picture extends.

<details class="pause-and-think">
<summary>Pause and think: Limits of composability</summary>

Function vectors for "translate to French" and "convert to uppercase" can be summed to get "translate to French in uppercase." But can you think of two tasks whose function vectors probably would *not* compose well? What properties of tasks make them composable or non-composable?

Tasks that make incompatible demands are plausible failure cases. “Translate to French” and “translate to German” both determine the output language, while “summarize” and “elaborate” push length in opposite directions. Compatible tasks such as translation and capitalization are easier candidates. Calling their representations orthogonal would require measuring the vectors and their effects rather than inferring geometry from the task labels.

</details>

## Related Work: In-Context Vectors and Task Vectors

The discovery of function vectors was not isolated. Hendel et al. {% cite "hendel2023icl" %} extracted reusable task vectors during in-context learning. Liu et al. {% cite "liu2023incontext" %} developed **in-context vectors**, a related method based on latent-space shifts, and tested vector arithmetic on task combinations. These results make task-related linear directions a recurring empirical finding rather than an artifact of one extraction method. They do not imply that every task, model, or in-context-learning strategy reduces to one vector.

## The Connection to Steering

Function vectors extend the steering paradigm in an important way:

- **[Addition steering](/topics/addition-steering/) vectors:** Engineered directions that modify behavior. The researcher chose the concept and designed the contrast pairs.
- **Function vectors:** Naturally occurring directions that encode tasks. The model learned them during in-context learning.

Both are directions in activation space. The difference is where they come from: human-specified contrast pairs versus the model's own learning mechanism.

Together, these results suggest that some task-selection information is linearly accessible in the residual stream. They extend the [linear representation hypothesis](/topics/linear-representation-hypothesis/) from labeled properties toward task signals, while leaving open whether one direction captures the whole computation.

Together with [probing methods](/topics/caa-method/) and [steering techniques](/topics/representation-control/), function vectors broaden the questions we can ask of the residual stream: not only “what property is represented?” but also “what task signal is being carried, and does intervening on it change the computation?”

But all the methods so far, including function vectors, require the researcher to specify what to look for. [Unsupervised steering vectors](/topics/unsupervised-steering-vectors/) take a different approach: discover what latent behaviors a model harbors without specifying the target in advance.
