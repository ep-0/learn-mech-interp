---
title: "Attribution Patching and Path Patching"
description: "Efficient gradient-based approximations to activation patching, and path patching for tracing information flow along specific edges in the computational graph."
order: 3
prerequisites:
  - title: "Activation Patching and Causal Interventions"
    url: "/topics/activation-patching/"
  - title: "Linear Approximation and Taylor Expansion"
    url: "/topics/taylor-expansion-and-linear-approximation/"
  - title: "Backpropagation and Automatic Differentiation"
    url: "/topics/backpropagation-and-autodiff/"

glossary:
  - term: "Attribution Patching"
    definition: "A linearized approximation of activation patching that uses gradients to estimate the causal effect of patching each component, making it computationally feasible to scan all components in a single forward and backward pass."
  - term: "Path Patching"
    definition: "A refined variant of activation patching that isolates the effect of a specific computational path between two components, controlling for all other paths. This enables precise attribution of behavior to individual connections in a circuit."

exitCriteria:
  - task: "Write the attribution patching estimate, name what each factor contributes, and explain why the cost is three passes regardless of how many components you are estimating."
    answer: |
      $$\text{Patch effect of } a_i \approx \nabla_{a_i}\mathcal{L} \cdot (a_i^{\text{clean}} - a_i^{\text{corrupt}}).$$

      - **The gradient** $\nabla_{a_i}\mathcal{L}$: how sensitive the metric is to a perturbation at this site. Sensitivity alone is not enough — a site the metric depends on strongly does not matter if nothing changes there between the two runs.
      - **The activation difference:** how much this site actually differs between clean and corrupted. Magnitude alone is not enough either — a site that changes a lot but that the metric ignores contributes nothing.

      The product is the first-order estimate of what swapping one for the other would do.

      **Why three passes:** one forward pass on the clean prompt caches every $a_i^{\text{clean}}$; one on the corrupted prompt caches every $a_i^{\text{corrupt}}$; one backward pass computes $\nabla_{a_i}\mathcal{L}$ at *every* site simultaneously, because that is what backpropagation does — a single reverse sweep populates gradients throughout the graph. Every remaining step is a dot product on cached tensors. So the cost is fixed while full patching is $O(n)$: for GPT-3's roughly 4.7 million neurons, three passes instead of 4.7 million.
  - task: "You attribution-patch an entire layer's residual stream and get a small estimate; full activation patching at the same site gives a large effect. Explain the disagreement and say what the disagreement is useful for."
    answer: |
      The Taylor expansion is a statement about *small* perturbations: it uses the slope at the current point and assumes the function stays near its tangent. Replacing an entire residual stream is a large perturbation, and everything between that site and the output is nonlinear — softmax in every attention layer, the MLP activation, LayerNorm's input-dependent scale. Far from the linearization point the true function has curved away from its tangent, and the gradient no longer predicts the finite change.

      The extreme case makes it concrete: at a site where small perturbations do nothing but a large one triggers a qualitative change, the local gradient is near zero and attribution reports approximately no effect, while full patching reports a large one.

      This is why the approximation is trustworthy at head and neuron granularity — those writes are small relative to the stream — and untrustworthy for whole layers.

      **The disagreement is useful as a diagnostic.** A large gap between the attribution estimate and the verified patch is direct evidence that the local linear approximation fails at that site, which is itself a finding about the computation. The recommended workflow — sweep with attribution, verify the top candidates with real patching — produces this comparison for free.
  - task: "Activation patching implicates both S-Inhibition heads and Name Mover heads in IOI. State the additional thing path patching established, and why node-level patching could not have shown it."
    answer: |
      Path patching established *which downstream consumer* uses the S-Inhibition output, and the answer was specific: the route into the Name Movers' **queries**, not their values. That supports a mechanistic account — S-Inhibition changes *where* the Name Movers look (steering them away from the duplicated name), rather than changing *what* their value pathway copies.

      Node-level patching could not show this because it replaces a head's entire output in the residual stream. That write is then read by every downstream component through all of its projections at once. The measurement is the net effect of every path leaving the head, and there is no way to attribute it to one edge. A head that supplies critical information to $K$ and irrelevant information to $J$ yields one number covering both.

      The general shift is from **nodes** to **edges**: "is this component important" to "is this connection important." The second is what a circuit claim actually asserts — a circuit is a wiring diagram, and a list of important components is not a wiring diagram. Implementation-wise, the edge is isolated by patching the input to the downstream head's Q, K, or V computation rather than the upstream head's output.
  - task: "ACDC prunes an edge when removing it changes behavior by less than a threshold $\\tau$. Describe what goes wrong at each extreme, and name a property of the algorithm that means even a well-chosen $\\tau$ does not give you the minimal circuit."
    answer: |
      **$\tau$ too high:** aggressive pruning. Edges with modest individual effects are removed, so secondary structure disappears — Backup Name Movers are the canonical loss, since their individual effect in the intact model is small by construction. The circuit is minimal and unfaithful: it no longer reproduces the behavior under the conditions where the backups matter.

      **$\tau$ too low:** almost nothing is pruned. The circuit retains most of the graph and offers little simplification over the full model, which defeats the purpose.

      **Why no $\tau$ gives the minimum:** the algorithm is **greedy**. It walks edges in reverse topological order and commits to each pruning decision permanently, but effects interact. Two edges that are individually below threshold may be jointly essential — prune the first and the second's measured effect rises, or prune in the other order and both survive. The result therefore depends on the traversal order, the chosen graph, the metric, and the ablation baseline, none of which are determined by the task.

      The practical response is to sweep $\tau$ and compare the resulting circuits, treating the sequence of nested circuits as the output rather than any single one.

furtherReading:
  - title: "Nanda, *Attribution Patching: Activation Patching at Industrial Scale*"
    url: "https://www.neelnanda.io/mechanistic-interpretability/attribution-patching"
    note: "The original write-up, unusually honest about where the approximation fails."
  - title: "Conmy et al., *Towards Automated Circuit Discovery for Mechanistic Interpretability*"
    url: "https://arxiv.org/abs/2304.14997"
    note: "ACDC in full, including the ablation and threshold choices that decide what circuit you get."
  - title: "Syed, Rager & Conmy, *Attribution Patching Outperforms Automated Circuit Discovery*"
    url: "https://arxiv.org/abs/2310.10348"
    note: "Edge attribution patching, and the comparison that made gradient methods the default for large graphs."
  - title: "Goldowsky-Dill et al., *Localizing Model Behavior with Path Patching*"
    url: "https://arxiv.org/abs/2304.05969"
    note: "Path patching stated carefully, including what a path is and is not evidence for."
---

## The Scalability Problem

[Activation patching](/topics/activation-patching/) is the foundation of causal interpretability: replace an activation, measure the effect, and establish which components matter. But it has a fundamental scaling problem. Each component tested requires a separate forward pass through the model. In GPT-2 Small, testing all 144 attention heads and 12 MLP layers means 156 forward passes. In GPT-3, with roughly 4.7 million neurons, individually testing every neuron is computationally infeasible.

The cost creates a methodological bottleneck: screen only a tractable subset and risk missing structure, or spend enough compute to patch every candidate. A first-order approximation makes a model-wide sweep possible with a small number of passes.

**Attribution patching** estimates many patching effects from gradients {% cite "nanda2023attribution" %}. **Path patching** asks which connections carry an effect between components {% cite "conmy2023ioi" %}. Both trade exactness or simplicity for scale and resolution.

## Attribution Patching: The Gradient Approximation

Attribution patching approximates the effect of patching every component without performing each patch. A first-order Taylor approximation combines how sensitive the metric is to an activation (the gradient) with how much that activation differs between clean and corrupted runs (the activation difference). Their product estimates the patching effect.{% sidenote "Attribution patching is closely related to 'gradient times input' attribution methods from the broader interpretability literature. Instead of multiplying the gradient by the input itself, it uses the *difference* between clean and corrupted activations, focusing the attribution on task-relevant changes rather than absolute activation magnitudes." %}

Formally, the estimated patching effect for activation $a_i$ is:

$$
\text{Patch effect of } a_i \approx \nabla_{a_i}\mathcal{L} \cdot (a_i^{\text{clean}} - a_i^{\text{corrupt}})
$$

The gradient $\nabla_{a_i}\mathcal{L}$ captures the local sensitivity of the metric to perturbations at $a_i$. The difference $(a_i^{\text{clean}} - a_i^{\text{corrupt}})$ captures how much the activation actually changes between the two runs. Their dot product estimates how much the metric would change if we replaced the corrupted activation with the clean one at that location.

The efficiency gain is dramatic. Full activation patching requires $O(n)$ forward passes, where $n$ is the number of components. Attribution patching requires exactly two forward passes (one clean, one corrupted) plus one backward pass (to compute gradients). That is three passes total, regardless of model size. For GPT-3 with 4.7 million neurons, this means 3 passes instead of 4.7 million.

## When the Approximation Holds

The accuracy of attribution patching depends on whether the first-order (linear) approximation captures the true relationship between activation changes and metric changes.

**Where it works well.** Transformers are, as Nanda puts it, "shockingly linear objects" {% cite "nanda2023attribution" %}. For small activations like individual attention head outputs and individual neurons, the linear approximation is often surprisingly accurate. The patching effect at this scale is genuinely close to linear in the activation perturbation, so the gradient captures most of what matters. Attribution patching at the head level and neuron level typically agrees well with full activation patching on the same components.

**Where it breaks down.** For large activations such as entire residual streams at a layer, the approximation degrades. Nonlinearities from softmax, MLP activation functions, and LayerNorm all violate the linearity assumption. These nonlinearities mean that the effect of patching an entire layer's residual stream is not well-approximated by a gradient. The Taylor expansion assumes small perturbations, and patching an entire residual stream is a large perturbation.{% sidenote "One way to understand this: the gradient gives you the slope of the function at a point. For a linear function, the slope is constant, so the prediction is exact regardless of perturbation size. For a nonlinear function, the slope changes as you move away from the evaluation point, and the prediction becomes increasingly inaccurate for larger perturbations." %}

**The practical implication.** Attribution patching is best used as a fast screening tool, not as a substitute for actual activation patching. The recommended workflow is: sweep the entire model with attribution patching to identify the most promising components in a single pass, then verify the top candidates with full activation patching. Think of it as a microscope's low-magnification mode, scan the whole slide quickly, then switch to high magnification on the interesting regions.

<details class="pause-and-think">
<summary>Pause and think: When would attribution patching be misleading?</summary>

Consider a component whose patching effect is highly nonlinear, for instance, a component where small perturbations have no effect but large perturbations cause a phase transition in model behavior. What would attribution patching report for this component, and how would it compare to full activation patching?

Attribution patching would report a small effect because the gradient at the evaluation point is near zero, while full activation patching would reveal a large finite-change effect. A substantial disagreement is therefore evidence that the local linear approximation is inadequate at that location.

</details>

## Path Patching: From Components to Connections

Standard activation patching replaces a component's entire output, combining every downstream use of that write. Head $H$ might supply task-relevant information to head $K$ while also affecting head $J$ through an irrelevant route. A whole-output patch measures their net effect but does not identify which downstream consumer uses the information.

Path patching asks a more targeted question: is the specific connection from $H$ to $K$ important? Instead of replacing $H$'s entire output in the residual stream, path patching replaces only the component of $H$'s output that flows into a specific downstream consumer $K$.{% sidenote "Implementing path patching is more involved than standard activation patching. You need to identify how a downstream head reads from the residual stream (through its QKV projections) and selectively patch only the contribution from the upstream head. In practice, this is done by patching the input to the downstream head's query, key, or value computation rather than the upstream head's output directly." %}

The conceptual shift is from **nodes** to **edges** in the computational graph:

- **Activation patching** tests nodes: "Is component $H$ important?"
- **Path patching** tests edges: "Is the connection $H \to K$ important?"

In the [IOI circuit](/topics/ioi-circuit/), activation patching implicates both S-Inhibition and Name Mover heads {% cite "wang2022ioi" %}. Path patching narrows the hypothesis to the route into Name Mover *queries*, supporting an account in which S-Inhibition changes where Name Movers attend rather than what their value pathway copies.

## Automated Circuit Discovery

Path patching, applied systematically, becomes a tool for automated circuit discovery. Conmy et al. developed the **ACDC algorithm** (Automatic Circuit DisCovery) to do exactly this {% cite "conmy2023ioi" %}.

<figure>
  <img src="images/acdc-circuit-discovery.png" alt="Left: the full computational graph of GPT-2 Small with hundreds of nodes and edges, with the ACDC-recovered circuit highlighted in red. Right: the extracted circuit shown as a clean graph with labeled nodes representing attention heads grouped by function (Duplicate Token, Induction, S-Inhibition, Name Mover, Backup Name Mover).">
  <figcaption>Automated circuit discovery with ACDC on the IOI task in GPT-2 Small. The full computational graph (left) is pruned to a sparse circuit (right) that closely matches the manually discovered IOI circuit. From Conmy et al., <em>Towards Automated Circuit Discovery for Mechanistic Interpretability</em>. {%- cite "conmy2023ioi" -%}</figcaption>
</figure>

ACDC starts with a chosen computational graph and treats its edges as candidate connections. It then tests edges in an order and prunes those whose removal falls below a selected effect threshold. What remains is a sparse circuit candidate. Because effects can interact, the greedy result need not be globally minimal and can depend on the graph, metric, baseline, ordering, and threshold.

The algorithm proceeds in topological order, working backward from the output:

1. Start with all edges in the computational graph
2. For each edge (in reverse topological order), temporarily remove it
3. If the model's behavior on the task is unchanged, permanently prune the edge
4. If behavior degrades, keep the edge
5. The surviving edges define the circuit

The threshold for "unchanged" is a tunable parameter, creating a tradeoff between faithfulness (keeping all edges that matter) and minimality (removing as many as possible). A strict threshold keeps more edges and produces a more faithful but less interpretable circuit. A loose threshold prunes aggressively and produces a more minimal but potentially less faithful circuit.

ACDC was validated on the IOI task, where it recovered a circuit closely matching the one Wang et al. found through manual analysis {% cite "wang2022ioi" %}. The key advantage is speed: ACDC can screen thousands of edges in hours, while manual circuit discovery took months.

<details class="pause-and-think">
<summary>Pause and think: Choosing the pruning threshold</summary>

ACDC prunes an edge if removing it changes the model's behavior by less than a threshold $\tau$. What happens if $\tau$ is set too high? What happens if it is set too low?

If $\tau$ is too high, edges that contribute modestly to the task are pruned, and the resulting circuit may miss secondary components like Backup Name Movers. The circuit becomes more minimal but less faithful. If $\tau$ is too low, the circuit retains many irrelevant edges and provides little simplification over the full model. The goal is to find the threshold where the circuit captures the primary mechanism without excessive noise. In practice, researchers often sweep across multiple threshold values and compare the resulting circuits.

</details>

## Combining the Tools

Attribution, activation, and path patching answer related questions at different costs. One useful workflow applies them in stages:{% sidenote "This sequence is a practical heuristic, not a required recipe. The right validation depends on the model, task, intervention size, and claim being made." %}

1. **Attribution patching** for broad screening. Sweep the entire model to identify which components show the largest estimated patching effects. This narrows the search from thousands of components to a manageable set of candidates.

2. **Activation patching** for confirmation. Run full patching on the top candidates to verify that the gradient approximation was accurate. This catches components where the linear approximation was misleading.

3. **Path patching** for mechanistic understanding. Once the key components are identified, trace the connections between them. This reveals not just which components participate in the circuit but how information flows between them.

Attribution patching may localize an effect to layer 9; activation patching can test head 9.9 directly; path patching can then ask whether that head receives S-Inhibition information through its queries and copies a name through its OV circuit. Each intervention narrows the causal claim.

To see this full toolkit applied to the most ambitious circuit analysis ever attempted, continue to [The IOI Circuit: Discovery and Mechanism](/topics/ioi-circuit/).
