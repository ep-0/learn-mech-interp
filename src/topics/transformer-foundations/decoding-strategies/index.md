---
title: "Decoding Strategies"
seoTitle: "Transformer Decoding: Greedy, Top-k, and Top-p"
description: "How transformer logits become text through greedy decoding, temperature, top-k, top-p, and beam search, and how each strategy selects the next token."
order: 11
prerequisites:
  - title: "Transformer Architecture Intro"
    url: "/topics/transformer-architecture/"
  - title: "Sampling and Monte Carlo Estimation"
    url: "/topics/sampling-and-monte-carlo/"

glossary:
  - term: "Greedy Decoding"
    definition: "A deterministic decoding strategy that selects the highest-probability token at every generation step. It is reproducible but can produce repetitive sequences."
  - term: "Temperature (sampling)"
    definition: "A hyperparameter that scales logits before the softmax during text generation. Temperature below 1 sharpens the distribution (more deterministic), temperature above 1 flattens it (more random), and temperature approaching 0 recovers greedy decoding."
  - term: "Nucleus Sampling (top-p)"
    definition: "A decoding strategy that samples from the smallest set of tokens whose cumulative probability exceeds a threshold p. Unlike top-k, it adapts the number of candidate tokens to the shape of the distribution, including fewer tokens when the model is confident and more when it is uncertain."

exitCriteria:
  - task: "Two tokens have logits $5.0$ and $4.0$. Compute the ratio of their probabilities at $T = 1$, $T = 0.5$, and $T = 2.0$, and say what stays fixed across all three."
    answer: |
      Temperature divides the logits before the softmax, so the ratio is $\exp((z_a - z_b)/T)$ with $z_a - z_b = 1.0$:

      - $T = 1$: $e^{1.0} \approx 2.72$
      - $T = 0.5$: $e^{2.0} \approx 7.39$
      - $T = 2.0$: $e^{0.5} \approx 1.65$

      What stays fixed is the **ranking**. Temperature is a monotone transformation of the logits, so the most probable token is the most probable token at every $T > 0$; only the concentration of mass changes. Two consequences follow. Greedy decoding is temperature-independent, which is why $T \to 0$ recovers it. And any claim of the form "raising the temperature makes the model prefer X over Y" is false as stated — raising the temperature makes the model *sample* Y more often, which is not the same thing.
  - task: "A model outputs: `the` $0.40$, `a` $0.25$, `this` $0.15$, `that` $0.10$, `one` $0.05$, and $0.05$ spread over the rest of the vocabulary. Give the candidate set under top-$k$ with $k=3$ and under nucleus with $p=0.9$. Then repeat both for a distribution where `the` has $0.95$."
    answer: |
      **First distribution.** Top-$k$, $k=3$: $\{$`the`, `a`, `this`$\}$, renormalized to $\{0.50, 0.31, 0.19\}$ (dividing by $0.80$). Nucleus, $p=0.9$: accumulate until the total reaches $0.9$ — $0.40, 0.65, 0.80, 0.90$ — so the set is $\{$`the`, `a`, `this`, `that`$\}$, renormalized to $\{0.44, 0.28, 0.17, 0.11\}$.

      **Second distribution.** Top-$k$, $k=3$: still three tokens, so two near-zero-probability tokens are admitted even though the model is nearly certain. Nucleus, $p=0.9$: `the` alone already exceeds $0.9$, so the set is $\{$`the`$\}$ and sampling collapses to greedy.

      That contrast is the whole argument for nucleus sampling. A fixed $k$ is a statement about the candidate *count*, which is the wrong quantity — it is too permissive when the model is confident and too restrictive when it is uncertain. A fixed $p$ is a statement about how much probability mass to keep, which adapts to the shape of the distribution automatically.
  - task: "Does the choice of decoding strategy change a model's internal activations? Answer for a single forward pass and for multi-step generation, and say why the distinction matters for designing an experiment."
    answer: |
      **Single forward pass: no.** Attention patterns, residual stream states, and MLP activations are deterministic functions of the input and the weights. Decoding happens strictly downstream, consuming the logits. Greedy, nucleus, and beam search all see identical internals.

      **Multi-step generation: yes, indirectly.** The token selected at step $n$ becomes part of the input at step $n+1$. Different selection rules produce different continuations, and those different inputs produce genuinely different internal computations from that point on.

      Why it matters for experimental design: any claim about internals measured on a *single* forward pass is decoding-independent and needs no sampling controls. Any claim measured over *generated* text is confounded by the sampling rule, and the same model with $T = 0.7$ and $T = 1.2$ can produce different rates of whatever behavior you are measuring. If you are studying, say, how often a model produces a certain kind of reasoning, you must fix and report the decoding parameters, and preferably show the result is stable across them — otherwise you may be measuring a property of the sampler.
  - task: "Beam search finds sequences with higher total log-probability than greedy decoding, yet produces text people judge as worse for open-ended generation. Explain the mismatch."
    answer: |
      Beam search optimizes $\sum_i \log P(t_i \mid t_{<i})$, and does so well. The problem is that this objective is not the one we want.

      Human language has entropy: a person writing a sentence does not choose the most predictable next word at every step, and text that does is recognizably degenerate. The highest-probability sequences under a language model are systematically short, generic, and repetitive — a loop like "the cat sat on the mat, the cat sat on the mat" has high per-token probability at every step precisely because it is predictable. Searching harder finds *more* of that, so widening the beam can make open-ended output worse rather than better.

      The mismatch disappears when the task genuinely has a correct answer. In machine translation or structured generation, the high-probability sequence is the right one and there is little value in surprise, which is why beam search remains standard there. The lesson generalizes past decoding: optimizing a proxy harder is only an improvement while the proxy and the goal still agree.

furtherReading:
  - title: "Holtzman et al., *The Curious Case of Neural Text Degeneration*"
    url: "https://arxiv.org/abs/1904.09751"
    note: "Where nucleus sampling comes from, and the argument that the problem is the model's distribution rather than the search."
  - title: "Meister et al., *Locally Typical Sampling*"
    url: "https://arxiv.org/abs/2202.00666"
    note: "An information-theoretic alternative that targets typical rather than high-probability continuations. Not covered here, and it reframes what decoding is for."
  - title: "Welleck et al., *Neural Text Generation with Unlikelihood Training*"
    url: "https://arxiv.org/abs/1908.04319"
    note: "Degeneration attacked at training time instead. Useful for separating what the objective causes from what the decoder causes."
  - title: "Zhang et al., *Trading Off Diversity and Quality in Natural Language Generation*"
    note: "The quality-diversity frontier that every decoding parameter moves along, made explicit and measured."
---

## From Logits to Text

The transformer's forward pass produces a vector of logits over the vocabulary at each position. These logits represent the model's unnormalized scores for what token comes next. But logits are not text. Converting them into a sequence of tokens requires a **decoding strategy**: a rule for selecting tokens from the output distribution and repeating the process autoregressively.

MI researchers mostly study the forward pass directly, analyzing logits and internal representations rather than generated text. But understanding decoding strategies clarifies what output probabilities mean, why generated text sometimes behaves strangely, and what aspects of model behavior are properties of the model versus properties of the decoding procedure.

## From Logits to Probabilities

The softmax function converts a vector of logits $\mathbf{z} \in \mathbb{R}^{|V|}$ into a probability distribution over the vocabulary:

$$P(t_i) = \frac{\exp(z_i)}{\sum_j \exp(z_j)}$$

Each probability $P(t_i)$ is positive, and the probabilities sum to 1. Tokens with higher logits receive higher probabilities. The softmax preserves the ranking of tokens but compresses the differences: a logit difference of 1 corresponds to an odds ratio of $e \approx 2.72$, regardless of the absolute logit values.

All decoding strategies start from these probabilities (or from the logits themselves, in the case of temperature scaling). The strategies differ in how they select a token from this distribution.

## Greedy Decoding Always Picks the Highest-Probability Token

Greedy decoding always selects the token with the highest probability at the current step.

$$t^* = \arg\max_i P(t_i)$$

Greedy decoding is deterministic. Given the same prompt, it always produces the same output. This makes it useful for reproducible analysis but problematic for text generation. Greedy decoding tends to produce repetitive text: once the model enters a pattern like "the cat sat on the mat. The cat sat on the mat," the most probable continuation at each step reinforces the loop. The model assigns high probability to tokens it has just seen, and greedy decoding always follows the highest probability.

## Random Sampling

At the other extreme, we can sample directly from the full probability distribution. Token $t_i$ is selected with probability $P(t_i)$. This produces diverse outputs but can be incoherent, because the long tail of the vocabulary contains many low-probability tokens that are individually unlikely but collectively probable. In a vocabulary of 50,000 tokens, the bottom 49,000 tokens might each have less than 0.01% probability, yet together they account for a substantial fraction of the total. Sampling from the full distribution occasionally selects these tokens, producing non-sequiturs.

The core tension in decoding is between these two failure modes: greedy decoding is too repetitive, and full random sampling is too chaotic. The strategies below navigate this tradeoff.

## Temperature Scaling

> **Temperature:** Temperature scaling divides the logits by a parameter $T > 0$ before applying softmax:
>
> $$P_T(t_i) = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$
>
> $T < 1$ sharpens the distribution (concentrating probability on the top tokens), $T > 1$ flattens it (spreading probability more evenly), $T \to 0$ recovers greedy decoding, and $T \to \infty$ approaches a uniform distribution.

Temperature controls the "confidence" of the sampling. Consider two tokens with logits 5.0 and 4.0. At $T = 1$, their probability ratio is $e^1 \approx 2.7$. At $T = 0.5$, the ratio becomes $e^2 \approx 7.4$: the model is more "decisive." At $T = 2.0$, the ratio is $e^{0.5} \approx 1.6$: the model is more "open-minded."{% sidenote "Temperature is named by analogy to statistical mechanics, where higher temperature means more random particle motion. In the Boltzmann distribution $P(E) \\propto \\exp(-E/kT)$, temperature controls how much the system explores high-energy states. The logit-softmax setup has the same functional form." %}

Temperature does not change the ranking of tokens; the most probable token remains the most probable. It only changes how much probability mass is concentrated on the top tokens versus spread across the rest. In practice, values around $T = 0.7$ to $T = 1.0$ are common for general text generation, with lower temperatures for tasks requiring precision (like code generation) and higher temperatures for creative tasks.

## Top-k Sampling

Top-k sampling restricts the candidate set to the $k$ highest-probability tokens, sets the probability of all other tokens to zero, and renormalizes:

$$P_{\text{top-k}}(t_i) = \begin{cases} P(t_i) / \sum_{j \in S_k} P(t_j) & \text{if } t_i \in S_k \\ 0 & \text{otherwise} \end{cases}$$

where $S_k$ is the set of $k$ tokens with the highest probabilities. This eliminates the long-tail problem: no matter how many low-probability tokens exist, only the top $k$ can be selected.

The limitation of top-k is that $k$ is fixed regardless of the distribution shape. When the model is very confident (one token has 95% probability), $k = 40$ still includes 39 near-zero-probability tokens. When the model is uncertain (probability spread across hundreds of plausible continuations), $k = 40$ arbitrarily cuts off tokens that might be reasonable. A fixed $k$ is too large in the first case and too small in the second.

## Nucleus Sampling (Top-p)

> **Nucleus Sampling:** Nucleus sampling (also called top-p sampling) selects the smallest set of tokens whose cumulative probability exceeds a threshold $p$:
>
> $$S_p = \text{smallest } S \text{ such that } \sum_{t_i \in S} P(t_i) \geq p$$
>
> Tokens outside $S_p$ are zeroed out and the remaining probabilities are renormalized. The set size adapts to the distribution: narrow when the model is confident, wide when it is uncertain.

Nucleus sampling {% cite "holtzman2020nucleus" %} addresses top-k's rigidity by adapting the candidate set to the shape of the distribution. When the model assigns 90% probability to a single token, the nucleus with $p = 0.95$ might contain only 2-3 tokens. When probability is spread across many plausible continuations, the nucleus might contain 50 or more.

Holtzman et al. showed that nucleus sampling produces text whose statistical properties (token frequency distribution, repetition patterns, and coherence) more closely match human-written text than greedy, pure sampling, or top-k alternatives {% cite "holtzman2020nucleus" %}. A typical setting is $p = 0.9$ or $p = 0.95$.

In practice, temperature and nucleus sampling are often combined: first scale the logits by temperature, then apply the top-p filter and renormalize. This gives two knobs for controlling the diversity-quality tradeoff.

## Beam Search

Beam search maintains $B$ candidate sequences (beams) in parallel. At each step, it expands every beam by considering all possible next tokens, scores the resulting sequences by cumulative log-probability, and keeps only the top $B$ candidates:

$$\text{score}(t_1, \ldots, t_n) = \sum_{i=1}^{n} \log P(t_i \mid t_1, \ldots, t_{i-1})$$

With $B = 1$, beam search reduces to greedy decoding. With larger $B$, it explores multiple hypotheses and can find sequences with higher total probability than the greedy choice. Beam search is deterministic (given the same prompt and beam width, it always produces the same output).

Beam search is most useful for tasks with a clear "correct" output, such as machine translation or structured generation. For open-ended text generation, it tends to produce bland, generic text, because the highest-probability sequences are often short and repetitive. It also has higher computational cost than single-sequence strategies, since it runs $B$ forward passes at each step.{% sidenote "Beam search produces the highest-probability sequences, but the highest-probability text is not necessarily the best text. Human language has entropy: people do not always pick the most predictable next word. Beam search optimizes for a criterion (cumulative log-probability) that does not align well with human preferences for interesting, varied text." %}

<details class="pause-and-think">
<summary>Pause and think: Comparing strategies</summary>

Suppose a model produces the following probabilities for the next token: "the" (40%), "a" (25%), "this" (15%), "that" (10%), "one" (5%), with the remaining 5% spread across thousands of tokens.

- **Greedy** always picks "the."
- **Top-k with $k = 3$** samples from {"the," "a," "this"} with renormalized probabilities {50%, 31%, 19%}.
- **Nucleus with $p = 0.9$** includes {"the," "a," "this," "that"} (cumulative: 90%) and samples from {44%, 28%, 17%, 11%}.

Now suppose the distribution shifts to: "the" (95%), with 5% spread across everything else. Top-k with $k = 3$ still includes 3 tokens, even though the model is very confident. Nucleus with $p = 0.9$ includes only "the" (95% already exceeds 0.9), effectively becoming greedy. This adaptation is the key advantage of nucleus sampling.

</details>

## Why MI Mostly Studies the Forward Pass

The forward pass produces logits. The decoding strategy then selects tokens from those logits. This distinction matters: the model's internal representations, attention patterns, and MLP activations are properties of the forward pass. They do not change based on how we sample from the output distribution.

When MI researchers analyze what a model "knows" or "computes," they examine the logits, the residual stream, and the internal activations. These are fixed for a given input regardless of whether we use greedy decoding, nucleus sampling, or beam search. The decoding strategy is a post-hoc choice that affects the generated text but not the model's internal computation on any single forward pass.

Decoding affects multi-step generation because the token selected at step $n$ becomes part of the input at step $n+1$. Different selection rules therefore create different future inputs and, in turn, different internal computations. For a fixed input, however, the forward pass is unchanged by the rule we will use to select its next token.

## Looking Ahead

Decoding turns one forward pass into observable text, but most mechanisms we want to understand lie upstream of that choice. With the full pipeline in view, from [token embeddings and the residual stream](/topics/transformer-architecture/) through attention, multilayer perceptrons, normalization, composition, and sampling, we can now ask [what a mechanistic explanation should account for](/topics/what-is-mech-interp/).
