---
title: "Layer Normalization"
description: "How layer normalization controls activation scale, where it sits in a transformer, and why its input-dependent scaling complicates circuit analysis."
order: 7
prerequisites:
  - title: "Transformer Architecture Intro"
    url: "/topics/transformer-architecture/"
  - title: "Normalization and Residual Connections"
    url: "/topics/normalization-and-residual-connections/"

glossary:
  - term: "Layer Normalization"
    definition: "A normalization technique that rescales activations within each token's representation vector to have zero mean and unit variance, then applies learned affine parameters. Applied before each sublayer in pre-norm transformers, it stabilizes training but introduces a nonlinearity that couples all residual stream dimensions."
  - term: "RMSNorm"
    definition: "A simplified variant of layer normalization that normalizes by the root mean square of activations without centering by the mean. Used in LLaMA, Gemma, and other modern architectures for its computational efficiency and comparable performance."

exitCriteria:
  - task: "In a pre-norm transformer, name the activation at which the residual stream is exactly the sum of all previous component writes, and explain why the post-norm architecture does not offer the same object."
    answer: |
      The pre-normalization residual stream — `hook_resid_pre` in TransformerLens. In pre-norm the update rule is $\mathbf{r}^{l+1} = \mathbf{r}^l + \text{Sublayer}(\text{LN}(\mathbf{r}^l))$. Normalization sits *inside* the branch, applied to what the sublayer reads, and never touches the stream itself. So the stream at any depth is exactly $\mathbf{e} + \sum(\text{writes so far})$, and any linear readout of it decomposes exactly into per-component terms.

      In post-norm the rule is $\mathbf{r}^{l+1} = \text{LN}(\mathbf{r}^l + \text{Sublayer}(\mathbf{r}^l))$: the normalization is applied to the stream after the addition, at every layer. The stream is then a normalized function of a sum rather than a sum, and the additive decomposition is destroyed at each step rather than only at the point of reading. This is a large part of why MI research works almost entirely on pre-norm models.
  - task: "A component's write happens to scale the whole residual vector at that position by a factor of $2$ without changing its direction. What does the next sublayer see as input, and what has been lost?"
    answer: |
      It sees essentially the same input as before. With $\mathbf{x} \mapsto c\mathbf{x}$ for $c > 0$, the mean becomes $c\mu$ and the standard deviation becomes $c\sigma$, so

      $$\frac{c\mathbf{x} - c\mu}{\sqrt{c^2\sigma^2 + \epsilon}} \approx \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2}},$$

      exactly equal up to the $\epsilon$ term, and then the learned affine $\gamma, \beta$ applies identically. The doubling is invisible downstream.

      What is lost is the **overall scale**, one scalar. This matters for interpretation in both directions. A component that writes a large-norm vector has not necessarily had a large effect on what the next block reads. And a claim that some quantity is encoded in the *magnitude* of the residual stream describes something no normalized sublayer can read directly — though it survives along the skip path to the final unembedding, which is why norm-growth phenomena still show up in the logits.
  - task: "TransformerLens offers `fold_ln`. State precisely what it does and what it does not do, and name an analysis that would be wrong if you confused the two."
    answer: |
      It **does** absorb the learned affine parameters $\gamma$ and $\beta$ into the adjacent weight matrices and biases. This is an exact reparameterization: the model computes the same function, and the weights you inspect are now the ones that act on the centered-and-scaled vector, so a claim about a row of $W_Q$ is a claim about what the head actually reads.

      It **does not** remove the input-dependent part — the centering by $\mu$ and the division by $\sigma$, both of which are functions of the current residual state and cannot be folded into any fixed parameter.

      The analysis that goes wrong: treating the folded model as globally linear and concluding that a head's effect on the logits is a fixed linear map of its input, independent of the rest of the stream. The scale factor $1/\sigma$ changes with the input, so two components' effects are not independent even after folding. Any argument that composes fixed matrices across layers — the $W_E W_Q W_K^T W_E^T$ style — is using this approximation and should say so.
  - task: "State the high-dimensional argument for why layer normalization can be ignored to first order, then construct a case where it fails."
    answer: |
      The argument: $\mu$ and $\sigma^2$ are averages over all $d$ coordinates. Changing one coordinate by a typical-sized amount moves $\mu$ by roughly $1/d$ of that amount and moves $\sigma$ by a comparably small term. In a stream of width $768$ or more, the resulting change in the normalization factor is small enough that the coupling between coordinates can be neglected at first order, and the residual stream can be treated as if each write's downstream effect were independent.

      It fails in two ways, both of which appear in real analyses:

      1. **A write spread across many coordinates.** The $1/d$ suppression applies per coordinate. A component that writes a moderate amount to every dimension can change $\sigma$ substantially, because the contributions add rather than average away.
      2. **A large write.** An intervention that changes the residual norm materially — a steering vector applied at a large coefficient, or an ablation of a high-norm component — changes $1/\sigma$ by a factor that no first-order argument covers.

      The check is cheap and worth doing: record $\sigma$ before and after the intervention and report the ratio.

furtherReading:
  - title: "Xiong et al., *On Layer Normalization in the Transformer Architecture*"
    url: "https://arxiv.org/abs/2002.04745"
    note: "The gradient analysis behind the pre-norm versus post-norm choice, rather than the summary of its conclusion."
  - title: "Zhang & Sennrich, *Root Mean Square Layer Normalization*"
    url: "https://arxiv.org/abs/1910.07467"
    note: "RMSNorm, used by most current open models, with the ablation showing which part of LayerNorm was doing the work."
  - title: "Brody, Alon & Yahav, *On the Expressivity Role of LayerNorm in Transformers' Attention*"
    url: "https://arxiv.org/abs/2305.02582"
    note: "LayerNorm as a computational component rather than a training aid: it projects onto a hyperplane and scales, and that geometry has consequences this article treats only as an obstacle."
  - title: "Anthropic, *Privileged Bases in the Transformer Residual Stream*"
    url: "https://transformer-circuits.pub/2023/privileged-basis/index.html"
    note: "Outlier dimensions and why the residual stream is less basis-free in practice than in theory. Directly complicates the folding trick described here."
---

## Why Normalize the Residual Stream?

Deep transformers are difficult to optimize when the scale of the residual stream drifts across layers. Attention scores can saturate, nonlinearities can move into poorly conditioned regimes, and gradients can become unstable. Layer normalization gives each sublayer an input with a controlled scale, though normalization-free transformers can work when the architecture and initialization are designed for them.

The [residual stream](/topics/transformer-architecture/#the-residual-stream) remains an exact sum of component updates in a pre-norm transformer, but later sublayers read a normalized version of that sum. Their responses are therefore not linear functions of the earlier contributions. Direct additive decompositions are exact at the point of addition and approximate when used to describe downstream effects.

For mechanistic interpretability (MI), normalization complicates an otherwise clean picture of the residual stream as a sum of component writes. We therefore need to understand both what layer normalization computes and when an analysis may safely approximate it.

## What Layer Normalization Does

> **Layer Normalization:** Given an input vector $\mathbf{x} \in \mathbb{R}^d$, layer normalization computes:
>
> $$\text{LN}(\mathbf{x}) = \gamma \odot \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta$$
>
> where $\mu = \frac{1}{d}\sum_i x_i$ is the mean, $\sigma^2 = \frac{1}{d}\sum_i (x_i - \mu)^2$ is the variance, $\gamma$ and $\beta$ are learned per-dimension scale and shift parameters, $\epsilon$ is a small constant for numerical stability, and $\odot$ denotes element-wise multiplication.

The operation has two stages {% cite "ba2016layernorm" %}. First, the input is centered (subtract the mean) and rescaled (divide by the standard deviation), producing a vector with zero mean and unit variance. Second, the learned parameters $\gamma$ and $\beta$ apply an element-wise affine transformation, allowing the model to undo the normalization in directions where it is not helpful.

Layer normalization operates *within* one token's vector, independently of other positions and examples in the batch.{% sidenote "Batch normalization instead estimates statistics across a batch. Layer normalization avoids making a token's representation depend on which other examples happen to share its batch." %} Apart from the small $\epsilon$ term, multiplying the whole input by a positive scalar leaves the normalized result unchanged before the learned affine transform. A sublayer reading only the normalized vector cannot directly recover that overall scale.

## Why Transformers Need It

The residual stream accumulates updates from every attention head and MLP. Without some control from initialization, architecture, or normalization, its scale can drift with depth. Later sublayers may then receive poorly scaled inputs: attention logits can enter saturated regimes, nonlinearities can operate far from their useful range, and gradients can become hard to optimize.

Layer normalization constrains the scale of activations entering each sublayer. In a pre-norm transformer, each attention and MLP block receives an input with controlled variance even if the raw residual stream grows. This is one widely used route to stable optimization in deep transformers. A model trained with normalization generally cannot have those operations removed after training, because the rest of its weights were learned around normalized inputs.

## Pre-Norm vs. Post-Norm

The original transformer {% cite "vaswani2017attention" %} placed layer normalization *after* each residual connection (post-norm):

$$\mathbf{r}^{l+1} = \text{LN}(\mathbf{r}^l + \text{Sublayer}(\mathbf{r}^l))$$

Most modern architectures, including GPT-2 and its descendants, instead place layer normalization *before* each sublayer (pre-norm):

$$\mathbf{r}^{l+1} = \mathbf{r}^l + \text{Sublayer}(\text{LN}(\mathbf{r}^l))$$

The difference matters for training stability. With post-norm, the gradients must flow back through the layer normalization at every layer, which can create optimization difficulties. With pre-norm, the residual connection provides an unimpeded gradient path from the output back to the input, making training more stable {% cite "xiong2020prenorm" %}. Pre-norm models can typically be trained with larger learning rates and converge more reliably.{% sidenote "Xiong et al. showed theoretically that in pre-norm transformers, the gradients are well-behaved at initialization, while post-norm transformers require careful learning rate warmup to avoid divergence. This is why most modern LLMs use pre-norm, and it is the architecture assumed in most MI research." %}

For mechanistic interpretability, the pre-norm placement has a practical advantage: the residual stream *after* each sublayer addition is the raw sum of all previous contributions, not a normalized version. This is why MI researchers typically analyze the pre-layer-norm residual stream (the `hook_resid_pre` activation in TransformerLens), where the additive decomposition holds exactly. The normalization only affects what each sublayer *sees as input*, not the residual stream itself.

## RMSNorm

> **RMSNorm:** A variant of layer normalization that drops the mean-centering step and normalizes by the root mean square:
>
> $$\text{RMSNorm}(\mathbf{x}) = \gamma \odot \frac{\mathbf{x}}{\sqrt{\frac{1}{d}\sum_i x_i^2 + \epsilon}}$$

RMSNorm {% cite "zhang2019rmsnorm" %} simplifies layer normalization by removing the mean subtraction. This saves computation and removes invariance to adding the same constant to every coordinate. Its root-mean-square denominator still depends on every dimension, so changing one coordinate can rescale all the others. The original study found performance comparable to layer normalization in its experiments; results still depend on the architecture and training setup.

RMSNorm is used in LLaMA, Gemma, and several other modern architectures. For MI purposes, it introduces the same fundamental complication as full layer normalization: the division by a norm that depends on all dimensions creates a nonlinear coupling. The practical treatment is the same.

## Why Layer Norm Matters for MI

Layer normalization creates three specific complications for mechanistic interpretability.

**It makes downstream effects nonlinear.** The raw pre-norm residual stream is still an exact sum of component writes. But each sublayer receives $\text{LN}(\mathbf{r})$, so its response to one write depends on the rest of the residual state. A logit-lens projection of one fixed state is a well-defined readout, and direct logit attribution can hold the final normalization scale fixed for that input. What becomes approximate is treating each earlier component as if it independently caused its projected share of the downstream result.

**It couples all dimensions.** Changing one coordinate of $\mathbf{x}$ changes both $\mu$ and $\sigma$, which shifts the normalized value of other coordinates. A write from one attention head can therefore change how subsequent blocks read the combined residual state, even though the writes themselves still add exactly.

**It removes overall scale from each sublayer's input.** The raw residual stream still retains its norm along the skip path, but a normalized attention or MLP block cannot directly read that single scalar. Most information available to the block lies in the centered direction of the vector.

### How Researchers Handle It

In practice, layer normalization is treated as a manageable approximation rather than a fundamental obstacle. Several strategies are common:

**Analyzing pre-LN activations.** In pre-norm transformers, the residual stream before layer normalization (`hook_resid_pre` in TransformerLens) is the raw sum of all previous contributions. The additive decomposition is exact at this point. Researchers typically analyze this representation.

**Folding fixed parameters into weights.** TransformerLens provides a `fold_ln` option that absorbs learned affine parameters into adjacent weights and biases. This exact reparameterization makes some analyses cleaner, but it does not remove the input-dependent normalization itself. Centering and scaling still depend on the current residual state and must be retained or approximated explicitly.{% sidenote "Folding changes where fixed parameters are written in the computation; it does not turn layer normalization into a globally linear operation. Always distinguish an exact parameter reorganization from an approximation that freezes input-dependent statistics." %}

**The high-dimensional argument.** Changing one coordinate by a typical-sized amount affects the mean and variance by terms that shrink with $d$. This can make normalization's cross-coordinate coupling small in wide residual streams. It is not a blanket guarantee: an update spread across many coordinates, or one large enough to change the vector norm materially, can change the normalization factor appreciably.

<details class="pause-and-think">
<summary>Pause and think: Why does the linear decomposition work?</summary>

If layer normalization couples all dimensions, why does the linear decomposition of the residual stream still work well enough for techniques like direct logit attribution to give meaningful results?

One reason is dimensionality: no typical coordinate dominates the mean or variance in a wide residual stream. Another is empirical, many interventions of interest do not change the residual norm enough to overturn a first-order analysis. Neither condition is automatic, so the approximation should be checked when an intervention is large or a result depends on small differences.

</details>

## Looking Ahead

The next article, [QK and OV Circuits](/topics/qk-ov-circuits/), deliberately sets layer normalization aside to present the clean linear algebra of attention head decomposition. This is the standard practice in MI research: develop the theory under the linear approximation, then account for LN effects when precision matters. Later articles on [DLA](/topics/direct-logit-attribution/) and the [logit lens](/topics/logit-lens-and-tuned-lens/) will note specifically where the LN approximation affects their conclusions.
