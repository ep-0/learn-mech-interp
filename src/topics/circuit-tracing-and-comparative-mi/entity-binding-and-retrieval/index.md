---
title: "Entity Binding and Retrieval"
description: "How language models associate entities with attributes in context, attach reusable binding identifiers, and retrieve the right value through several competing mechanisms."
order: 6
prerequisites:
  - title: "The IOI Circuit: Discovery and Mechanism"
    url: "/topics/ioi-circuit/"
glossary:
  - term: "Entity Binding"
    definition: "The problem of associating an entity with its context-specific attributes so that the correct pair can be retrieved later without confusing it with other entities."
  - term: "Binding ID"
    definition: "A context-specific identifier represented by corresponding entity-side and attribute-side vectors, allowing later computation to retrieve values by matching the pair."

exitCriteria:
  - task: "State the two causal predictions binding IDs make — factorizability and position independence — and say which competing account each one rules out."
    answer: |
      **Factorizability.** Entity and attribute content can be replaced separately: swap the attribute activation at slot $i$ for slot $i$'s activation from another context, and entity $i$ becomes bound to the new attribute while other pairs stay intact. This rules out the account where an entity–attribute pair is stored as one indivisible representation. If "Ann-loves-pie" were a single unit, there would be no attribute component to replace on its own.

      **Position independence.** Retrieval follows the identifier, not the slot: permute the entity and attribute representations while preserving matching IDs and the associations survive. This rules out the positional account — "the second person maps to the second food" — which would break as soon as positions are rearranged.

      Together they pin down a specific claim: association is carried by a *transportable code* attached to content, not by content itself and not by location. That is a much more constrained hypothesis than "the model tracks the pairs," and each prediction has a clean way to fail.

      Both held in the Pythia and LLaMA models tested — a finite set of checkpoints on controlled binding tasks, not all transformers.
  - task: "Replacing Ann's full activation with Pete's makes the model answer *jam*. Explain why this does not establish a binding-ID mechanism, and describe an intervention that would."
    answer: |
      The full activation carries everything at that position at once: Pete's identity, Pete's attributes, whatever positional information the site encodes, and any binding code. Moving all of it and observing that the answer becomes Pete's attribute is consistent with the binding account and equally consistent with several rivals — that the site stores an inseparable person-food pair, or that the answer was transplanted directly, or that retrieval is positional and you moved what sits at that position.

      The experiment has established Cause with no Isolate: a large effect and no evidence for the *level of abstraction* the interpretation claims.

      **A discriminating intervention:** change the identifier while holding content fixed. Attach Ann's binding vector to the representation of *jam* and leave both content components alone. The binding account predicts the model now answers *jam* for Ann; every account where association is carried by content or position predicts otherwise, since neither the content nor the position moved.

      The stronger version composes sources that do not contain the answer, so no source could have supplied it. That is the general recipe for testing a variable rather than transplanting a result — the same discipline as RAVEL's Cause-and-Isolate pairing.
  - task: "Interpolations between valid binding vectors usually still work as identifiers; random vectors of comparable scale usually do not. Say what this establishes about the code, and what capacity failure the geometry predicts."
    answer: |
      **What it establishes:** the identifiers occupy a *continuous subspace with meaningful distances*, not a discrete set of labels. If binding IDs were one-hot slots, the midpoint of two valid IDs would be a meaningless vector, and it is not. The scale-matched random control does the essential work here: it shows the effect comes from the direction lying in the binding subspace, not from adding a vector of the right magnitude.

      That nearby identifiers are harder for the model to distinguish than distant ones sharpens the picture. Retrieval is a separation problem: it succeeds when downstream computation can tell two points apart, and degrades continuously as they converge.

      **The predicted capacity failure:** as more entities are bound in one context, their identifiers must be packed into the same usable region, so typical separation falls and collisions or near-collisions become more likely. The prediction is graded rather than a cliff — errors should first appear as confusions between the *most similar* identifiers rather than as uniform degradation — and it says the failure should look like attribute swapping between specific pairs, not general forgetting.

      This is a falsifiable structural prediction, which is what makes the continuous-subspace claim more than a description.
  - task: "Retrieval combines positional, lexical, and reflexive routes, with the mixture varying by task and position. Explain why observing positional retrieval in a short synthetic list does not establish it for longer text."
    answer: |
      Because the mixture is a function of the setting, and a short list is the setting where the positional route works best. Positional retrieval degrades as lists grow and is noisiest in middle positions, so a two- or three-item list is close to its best case — and correspondingly close to the worst case for detecting the other routes, which have nothing to contribute when position alone suffices.

      So the finding generalizes to "in this regime, position dominates," and the natural extrapolation — that the model retrieves positionally — is exactly the inference the data cannot support.

      This compounds a second problem: a behavioral answer underdetermines the mechanism. The same correct token can be produced by different mixtures, so getting the answer right tells you nothing about which route produced it.

      **What earns the general claim** is what the mixture study did: nine models, ten binding tasks, longer contexts interleaved with unrelated text, and a causal model reaching about 95% agreement with the next-token distributions across all of them. Varying the regime is the point — a mechanism claim needs the conditions under which each route dominates, not one condition where one route happens to be enough.

furtherReading:
  - title: "Feng & Steinhardt, *How Do Language Models Bind Entities in Context?*"
    url: "https://arxiv.org/abs/2310.17191"
    note: "The binding-ID account with the causal predictions and their tests."
  - title: "Prakash et al., *Language Models Use Lookbacks to Track Beliefs*"
    url: "https://arxiv.org/abs/2505.14685"
    note: "The lookback mechanism in a harder setting, including false-belief tracking."
  - title: "Dai et al., *Representational Analysis of Binding in Language Models*"
    url: "https://arxiv.org/abs/2409.05448"
    note: "A competing account of the same phenomenon. Comparing the two is the best available exercise in judging mechanistic evidence."
---

## The Binding Problem

Consider the context “Pete loves jam, and Ann loves pie,” followed by “Ann loves”. Predicting *pie* requires more than representing the four content words. The model must preserve which person goes with which food. If it represented only a bag of entities and attributes, *jam* and *pie* would be equally available.

This is the **binding problem**: how can a distributed representation associate several variables with their current values without confusing the pairs? The problem appears whenever a model tracks people and properties, objects and locations, variables and values, or characters and beliefs.

> **Entity Binding:** Associating an entity with its context-specific attributes so that later computation can retrieve the correct pair rather than merely detect that both items occurred.

The [IOI circuit](/topics/ioi-circuit/) solves a related reference problem by detecting a duplicated name, suppressing it, and copying the other name. Binding research asks a broader representational question: what internal code lets a model distinguish several entity–attribute pairs, and how does the model dereference that code later? These accounts should not be collapsed into one mechanism because they were established on different models, tasks, and intervention sites.

## Content Plus an Identifier

Feng and Steinhardt found evidence for a **binding ID mechanism** across the sufficiently large Pythia and LLaMA models they tested {% cite "feng2024binding" %}. An entity representation contains information about the entity itself plus a context-specific identifier. Its associated attribute receives a matching identifier.

For entity $e_i$ and attribute $a_i$, a simplified decomposition is

$$
\mathbf{h}(e_i) \approx \mathbf{c}_E(e_i) + \mathbf{b}^E_i,
\qquad
\mathbf{h}(a_i) \approx \mathbf{c}_A(a_i) + \mathbf{b}^A_i,
$$

where $\mathbf{c}$ carries content and $\mathbf{b}^E_i,\mathbf{b}^A_i$ are the entity-side and attribute-side vectors corresponding to abstract binding ID $i$. The same ID does not permanently belong to Ann or pie. It is assigned by the current context, much like a temporary variable name.

> **Binding ID:** A temporary abstract identifier represented by corresponding entity-side and attribute-side vectors. Matching identifiers allow retrieval without requiring the pair to occupy fixed absolute positions.

The proposal is not that the equations reconstruct every activation exactly. They describe the component manipulated by the paper’s causal interventions: replacing or moving the inferred binding component changes which content is retrieved while preserving much of the content representation.

## Two Causal Predictions

Binding IDs imply two tests that distinguish them from copying an entire entity–attribute representation {% cite "feng2024binding" %}.

**Factorizability** means entity and attribute content can be replaced separately. Replace the attribute activation at slot $i$ with the activation from slot $i$ in another context, and entity $i$ should become bound to the new attribute while the other pairs remain intact. This first test moves content and its slot-specific identifier together; finer interventions later change the inferred identifier while preserving content.

**Position independence** means retrieval follows the identifier rather than a fixed slot. Permuting entity and attribute representations while preserving the matching IDs should preserve the associations. A mechanism that stores “the second person maps to the second food” would fail this test when positions are rearranged.

The tested interventions support both predictions in the studied models. They provide stronger evidence than a probe that merely decodes the correct pair, because they alter the proposed binding variable and check the resulting association.

<details class="pause-and-think">
<summary>Pause and think: Content or binding?</summary>

Suppose replacing Ann’s full activation with Pete’s makes the model answer *jam*. Why does this fail to establish a binding-ID mechanism?

The replacement moves Pete’s identity, attributes, position-dependent information, and any binding code together. A binding-ID test must change which pieces are associated while preserving their content, such as attaching Ann’s identifier to the representation of jam.

</details>

## A Continuous Binding Space

The inferred IDs do not behave like a small set of discrete one-hot labels. Linear interpolations between valid binding vectors often still produce usable identifiers, whereas random vectors with comparable scale usually do not {% cite "feng2024binding" %}. Nearby identifiers are also harder for the model to distinguish than distant ones.

This behavior supports a continuous binding subspace with meaningful distances. A context can assign different points in that space to different pairs, and retrieval succeeds when the points are separated enough for downstream computation to tell them apart. The geometry also predicts a capacity failure: packing more entities into the same usable region makes collisions or near-collisions more likely.

The evidence is broad across the tested model families but not unrestricted. The experiments use controlled binding tasks, and “every sufficiently large tested model” is a statement about a finite set of Pythia and LLaMA checkpoints, not all transformer language models.

## Binding Is Not Yet Retrieval

Attaching identifiers explains how pairs can be represented, but the model still needs to recover the requested entity or attribute. Later work finds that models combine several retrieval routes rather than relying on one universal pointer {% cite "gurarieh2026mixing" %}.

**Positional retrieval** uses a pair’s ordering or contextual slot. It works well for short lists but becomes noisy as lists grow, especially for items in middle positions.

**Lexical retrieval** uses the bound counterpart as a cue. If the question asks who loves pie, the representation of *pie* helps retrieve *Ann*. This route depends on content rather than only the pair’s ordinal position.

**Reflexive retrieval** follows a more direct pointer from one representation to its partner. It supplies another route when positional information is unreliable.

Across nine models and ten binding tasks, a causal model combining the three mechanisms matched the models’ next-token distributions at about 95% agreement and generalized to longer contexts interleaved with unrelated text {% cite "gurarieh2026mixing" %}. The mixture changes with task and position, so observing a positional mechanism in a short synthetic list does not establish that the same route dominates in longer text.

## Lookbacks for Belief Tracking

Belief tracking adds another layer to the binding problem. A story can describe where an object really is, what one character saw, and what another character falsely believes. Answering a question about the second character requires retrieving the state associated with that character’s information rather than the latest state in the story.

Prakash et al. identify **lookback mechanisms** in which low-rank ordering identifiers are colocated in state-token representations {% cite "prakash2025lookbacks" %}. A binding lookback retrieves the state identifier associated with the requested character and object. An answer lookback then retrieves the corresponding state token. When the story explicitly describes who can see whom, a visibility lookback updates the relevant belief before the final retrieval.

The mechanism composes several pointer-like operations:

1. Identify the character and object named by the question.
2. Retrieve the state identifier bound to that pair.
3. Incorporate visibility information when the story requires it.
4. Retrieve the token associated with the resulting state.

This account concerns controlled Theory of Mind stories in the studied model, not unrestricted evidence that language models possess human-like theories of mind. Its contribution is a causal proposal for how a particular state-tracking computation is implemented.

## Capacity, Redundancy, and Alternative Accounts

Binding mechanisms fail in structured ways. Positional retrieval weakens with list length and in middle positions, while lexical and reflexive routes can compensate. A behavioral answer alone therefore underdetermines the mechanism: the same correct token may be supported by different mixtures of retrieval paths.

Interventions must also distinguish a binding variable from correlated content. Moving a full residual vector can transplant the answer itself. A stronger experiment changes an identifier while leaving content fixed, combines evidence from sources that do not contain the final answer, or predicts failures when identifiers become crowded.

Entity binding supplies a reusable level between individual attention heads and complete task behavior. [Circuit tracing](/topics/circuit-tracing/) can ask which components create, transport, and dereference the identifiers, while [universality studies](/topics/universality/) can test whether the same representational strategy recurs across architectures and training regimes.
