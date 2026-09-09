---
title: "Embeddings"
description: "How token IDs become residual-stream vectors, how input embeddings relate to the unembedding, and what their geometry does and does not tell us."
order: 3
prerequisites:
  - title: "Transformer Architecture Intro"
    url: "/topics/transformer-architecture/"
  - title: "Embeddings and Distributed Representations"
    url: "/topics/embeddings-and-distributed-representations/"

glossary:
  - term: "Token Embedding"
    definition: "The learned vector assigned to a vocabulary token at the input of a transformer. It supplies token identity to the residual stream before contextual processing begins."
  - term: "Embedding Matrix"
    definition: "A learned matrix with one row per vocabulary token. Looking up a token ID selects the corresponding row."
  - term: "Unembedding"
    definition: "The learned linear map from the final residual representation to vocabulary logits. Each vocabulary token has an output direction, and a subsequent softmax converts the logits into probabilities."
  - term: "Weight Tying"
    definition: "Sharing parameters between the input embedding matrix and the output unembedding matrix, usually by setting the unembedding to the transpose of the embedding matrix."

exitCriteria:
  - task: "A model uses weight tying, $W_U = W_E^T$. What quantity is $\\mathbf{e}_t W_U$, what would you expect its largest entry to be, and why does computing it not tell you what the model predicts for token $t$?"
    answer: |
      It is the vector of logits you would get by unembedding token $t$'s input row directly, skipping every layer — the **direct path** through the network. Under tying, entry $j$ is $\mathbf{e}_t \cdot \mathbf{e}_j$, so the largest entry is almost always $j = t$ itself, since a vector's largest inner product with a set of vectors including itself is usually with itself.

      It is not the model's prediction because it omits everything in between. The real computation is $\text{Norm}(\mathbf{r}^L) W_U$ where $\mathbf{r}^L$ is the embedding *plus* every attention and MLP write. The direct path is one term of that sum, and in a trained model it is typically a poor predictor on its own — which is the point, since a model whose prediction equalled its direct path would be doing no contextual work at all.
  - task: "Show that the model's preference between two candidate tokens $a$ and $b$ is a projection of the final residual state onto a single direction. Then say why that fact is what makes direct logit attribution possible."
    answer: |
      The logits are $z_{i,a} = \mathbf{h}_i W_U[:,a] + b_{U,a}$ and likewise for $b$. Subtracting:

      $$z_{i,a} - z_{i,b} = \mathbf{h}_i\left(W_U[:,a] - W_U[:,b]\right) + (b_{U,a} - b_{U,b}).$$

      The bias term is a constant for the pair, so the input-dependent part is a dot product of $\mathbf{h}_i$ with the fixed direction $W_U[:,a] - W_U[:,b]$ — the "$a$ minus $b$" direction in residual space.

      This is what DLA needs. The final residual state is a *sum* of component writes, and a dot product is linear, so the logit difference decomposes exactly into one scalar per component: each component's contribution is its own write projected onto that same direction. Without the reduction of a vocabulary comparison to a single direction, there would be no per-component number to attribute. (The final normalization is the wrinkle — DLA holds its scale fixed for the input in question.)
  - task: "You want to test whether an attention head reads token identity. Contrast replacing the input token with replacing that position's embedding vector, and say what question each experiment actually answers."
    answer: |
      **Replacing the embedding** changes only the vector written at that position at layer 0. Tokenization, sequence length, and positional information all stay fixed. This isolates the question: *does the head's behavior depend on the identity information carried by that row of $W_E$?*

      **Replacing the input token** re-runs the tokenizer. The substitution can change the number of tokens (one word becoming two subword pieces), which shifts every downstream position, changes what positional encodings apply, and changes every activation in the sequence. The question it answers is the coarser one: *does the model behave differently on this input than on that one?*

      They are different experiments and can disagree. If a swap changes behavior only in the token version, the effect may be attributable to re-tokenization rather than to identity — which is why the embedding-level intervention is the cleaner instrument when the head's read is what you are testing.
  - task: "A colleague reports that dimension 417 of the embedding matrix encodes formality. Explain why this claim is almost certainly not well-formed, and what claim in its neighborhood would be."
    answer: |
      The residual stream has no privileged basis. Rotate it by $R$ and compensate by replacing every reading matrix $W$ with $R^{-1}W$ and every writing matrix with $WR$, and the model computes exactly the same function while every individual coordinate of $W_E$ changes. "Dimension 417" is therefore a property of an arbitrary parameterization, not of the model — the same trained network expressed in a rotated basis has a different dimension 417 and is the same model.

      The well-formed version is a claim about a **direction**: there is a unit vector $\mathbf{d}$ such that $\mathbf{e}_t \cdot \mathbf{d}$ tracks formality across tokens, and downstream components read along $\mathbf{d}$. That claim survives rotation, because the direction rotates with the basis. It also comes with obligations the coordinate claim does not: you must exhibit $\mathbf{d}$, show what reads it, and show that intervening along it changes behavior.

furtherReading:
  - title: "Jurafsky & Martin, *Speech and Language Processing* (3rd ed.), the vector semantics chapter"
    url: "https://web.stanford.edu/~jurafsky/slp3/"
    note: "The static word-embedding tradition this article compresses into a paragraph, including the analogy results and how they were measured."
  - title: "Ethayarajh, *How Contextual are Contextualized Word Representations?* (EMNLP 2019)"
    note: "Anisotropy: contextual embeddings occupy a narrow cone, which distorts every cosine similarity computed on them. This article does not mention it, and it affects most similarity claims you will read."
  - title: "Gurnee & Tegmark, *Language Models Represent Space and Time*"
    url: "https://arxiv.org/abs/2310.02207"
    note: "Structure recoverable from embeddings and early layers, and a concrete example of the probing methodology applied to representation content."
  - title: "Cancedda, *Spectral Filters, Dark Signals, and Attention Sinks*"
    note: "The high-norm outlier dimensions of real embedding matrices, which are invisible in the idealized picture here and matter when you compute with them."
---

## From an Integer to a Model State

Suppose a tokenizer turns `The bank` into two token IDs, 464 and 3331. Those integers are arbitrary labels. Adding them, taking their average, or comparing their numerical distance says nothing about the text. Before the transformer can compute with them, it replaces each ID with a learned vector.

Let the vocabulary contain $V$ tokens and let the residual stream have width $d_{\text{model}}$. The **embedding matrix** is

$$
W_E \in \mathbb{R}^{V \times d_{\text{model}}}.
$$

For token ID $t$, the lookup returns row $t$:

$$
\mathbf{e}_t = W_E[t,:].
$$

> **Token Embedding:** A token embedding is the learned $d_{\text{model}}$-dimensional vector placed into the residual stream for one vocabulary token.

For a sequence $(t_0,t_1,\ldots,t_{n-1})$, the model performs all $n$ lookups and stacks the results into an $n \times d_{\text{model}}$ matrix. A lookup is equivalent to multiplying a one-hot vocabulary vector by $W_E$, but implementations index the row directly because multiplying by a mostly zero vector would waste computation.

The matrix is learned with the rest of the model. Through the input lookup path, gradients update the rows selected by tokens in the batch, so frequently used tokens receive more of these direct updates than rare tokens. If the input and output weights are tied, the output loss also updates the shared matrix through its vocabulary-wide logit calculation. Tokenization determines the objects the embedding matrix can represent: a vocabulary may include complete words, word fragments, punctuation, bytes, or special control tokens.

<details class="pause-and-think">
<summary>Pause and think: What does the token ID encode?</summary>

If token 800 has ID 800 and token 801 has ID 801, should their embeddings be close because their IDs differ by one?

No. The IDs only select rows. Their ordering is a tokenizer implementation detail, and training is free to place the two rows anywhere in the residual space. Similarity must be measured between the learned vectors, not between token IDs.

</details>

## One Token Vector, Many Contextual Meanings

The lookup for a token is context independent. Every occurrence of the same token ID begins with the same row of $W_E$. The token `bank` therefore starts from one vector whether the text concerns money or a river. Positional information may change the initial state by position, but it does not resolve the word's meaning by itself.

Attention and multilayer perceptrons (MLPs) turn that starting vector into a **contextual representation**. After several layers, the state at `bank` can incorporate surrounding tokens such as `loan` or `river`. Calling every hidden state an “embedding” obscures this distinction. In this curriculum, *token embedding* means the learned input lookup, while *activation* or *residual-stream state* means the context-dependent vector inside the network.

A token embedding should not be read as a complete dictionary definition. It only needs to supply information that helps the whole trained network predict tokens. The model can store some associations in $W_E$, compute others in later layers, and represent a property across several directions. Two embeddings with a high cosine similarity may share predictive roles, but a low similarity does not establish that the model treats the tokens as unrelated.

The tokenizer creates another source of caution. A word may split into several tokens, and the same character sequence may tokenize differently depending on a preceding space or other context. There may be no single row corresponding to the human concept we want to study.

## From the Residual Stream Back to Tokens

The embedding matrix maps vocabulary tokens into the residual stream at the input boundary. The **unembedding matrix** maps the final representation back to vocabulary space at the output boundary. With a final normalization, the two steps are

$$
\mathbf{h}_i = \text{Norm}_{\text{final}}(\mathbf{r}^L_i),
\qquad
\mathbf{z}_i = \mathbf{h}_i W_U + \mathbf{b}_U,
\qquad
W_U \in \mathbb{R}^{d_{\text{model}} \times V}.
$$

> **Unembedding:** The unembedding is the learned affine readout that converts the model's final residual representation into one logit per vocabulary token.

Column $j$ of $W_U$ is the **unembedding direction** for token $j$. Its logit is $z_{i,j}=\mathbf{h}_i W_U[:,j]+b_{U,j}$, so moving $\mathbf{h}_i$ along that column raises the token's score. Softmax converts all $V$ logits into probabilities. Because softmax depends on their relative values, raising every logit by the same amount changes no probability.

A [decoding strategy](/topics/decoding-strategies/) turns those probabilities into a generated token. Greedy decoding selects the highest-probability token, while sampling methods trade determinism for diversity.

For two candidate tokens $a$ and $b$, the model's preference before softmax is captured by a logit difference:

$$
z_{i,a}-z_{i,b}
=
\mathbf{h}_i\left(W_U[:,a]-W_U[:,b]\right)
+\left(b_{U,a}-b_{U,b}\right).
$$

This equation turns a vocabulary comparison into a direction in residual space. [Direct logit attribution](/topics/direct-logit-attribution/) uses that geometry to measure how individual component writes align with an output preference, while the [logit lens](/topics/logit-lens-and-tuned-lens/) applies the final readout to intermediate residual states.

The input row $W_E[j,:]$ and output column $W_U[:,j]$ have compatible shapes but need not be the same learned vector. Input embeddings answer “which token is present?” at the start of the network; unembedding directions answer “what evidence favors this output token?” at the end.

Many language models use **weight tying**, setting

$$
W_U = W_E^T.
$$

The same parameter vector then represents token $j$ at the input and reads evidence for token $j$ at the output. Weight tying reduces the parameter count and has improved language-model performance in several settings {% cite "press2017outputembedding" %}. It also makes a token's input and output geometry directly related. An interpretability analysis must check the model configuration rather than assume tying: untied matrices and output biases change the relationship between the two vocabulary interfaces.

<details class="pause-and-think">
<summary>Pause and think: What does tying make exact?</summary>

If $W_U=W_E^T$, does a token embedding pass unchanged through the network and predict that same token?

No. Tying only shares the vectors at the two boundaries. Attention, MLPs, residual additions, and normalization transform the state between them. The direct projection $\mathbf{e}_t W_U$ is inspectable, but it is only one path through the full computation.

</details>

## Embeddings in Mechanistic Interpretability

Embeddings are the first writes to the residual stream, so circuit analyses often treat them as the leaves of a computation graph. If a circuit ends at “the embedding of the earlier name token,” it has traced the relevant computation back to token identity. [Query-key (QK) and output-value (OV) circuit analysis](/topics/qk-ov-circuits/) makes this explicit by composing attention weights with $W_E$ and $W_U$.

In a simplified model without positional terms, an attention head's token-to-token query-key map is

$$
W_E W_Q W_K^T W_E^T.
$$

Entry $(a,b)$ measures the embedding-only contribution to the attention score from destination token $a$ and source token $b$. The corresponding output-value map can show which source tokens the head tends to promote at the output. These matrices are useful summaries in small, shallow models. In a deep model, later heads read contextual residual states rather than bare token embeddings, so the same matrices describe only the direct embedding path.

Embedding interventions also require a precise counterfactual. Replacing token $a$'s embedding with token $b$'s changes token identity while leaving the discrete input and tokenizer output unchanged. Replacing the input token itself can additionally change tokenization, sequence length, positions, and every downstream activation. Those experiments answer different questions.

Coordinate-level interpretations are especially fragile. Rotating the residual-stream basis and rotating all connected weights inversely can leave the model's function unchanged while changing every individual coordinate of $W_E$. Directions and their interactions with downstream reads are more meaningful than claims about embedding dimension 417 in isolation.

## Looking Ahead

A row of $W_E$ says which token is present, but a sequence model must also distinguish where it appears. [Positional Embeddings](/topics/positional-embeddings/) covers the main ways transformers inject order and distance, including methods that never add a positional vector to the residual stream.
