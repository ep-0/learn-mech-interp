---
title: "Chain-of-Thought Faithfulness"
description: "Whether the reasoning a model writes down is the reasoning it used, the tests that answer that question behaviorally, and what follows for monitoring reasoning models."
order: 1
status: placeholder
prerequisites:
  - title: "In-Context Learning and Prompting"
    url: "/topics/in-context-learning/"
  - title: "What Is Mechanistic Interpretability?"
    url: "/topics/what-is-mech-interp/"
---

## Why this article exists

A model that explains its reasoning is offering evidence about its own computation, and that evidence is frequently false: models produce fluent justifications while the actual cause of the answer was a cue they never mention. Whether chains of thought can be trusted is now a live safety question, because monitoring a model's stated reasoning is one of the cheapest oversight mechanisms available and depends entirely on this property.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The question**

- Faithfulness defined: does the stated reasoning describe the process that produced the answer
- Distinguishing faithfulness from plausibility, and from accuracy
- Why a fluent explanation is weak evidence on its own

**2. The evidence that it often is not faithful**

- Biasing cues that change the answer and go unmentioned in the reasoning
- Post-hoc rationalization, with concrete examples
- The systematic nature of the failure, which rules out treating it as noise

**3. Tests**

- Truncation and early answering
- Adding mistakes to the chain and seeing whether the conclusion follows
- Paraphrase and filler-token controls
- How these compare to intervening on activations directly

**4. Reasoning models**

- Whether reinforcement learning on outcomes makes reasoning more or less faithful
- Evidence that optimizing against a chain-of-thought monitor degrades it
- The monitorability argument, and the tax it implies

**5. What this means for interpretability**

- Behavioral faithfulness tests as the cheap first pass
- Where causal methods on activations are required instead
- The connection to self-report methods elsewhere in this curriculum

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Prompting techniques for improving reasoning accuracy
- Reasoning benchmarks and their construction
- Formal verification of reasoning traces

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Design a faithfulness test for a given chain of thought and say what result would falsify faithfulness
- Explain why a model can be more accurate with chain of thought while its stated reasoning is unfaithful
- State the argument for chain-of-thought monitorability and the strongest objection to it

## Sources to learn from

- Turpin et al., *Language Models Don't Always Say What They Think* (arXiv:2305.04388) — The clearest demonstration of unfaithfulness, with the biasing-cue design that later work reuses.
- Lanham et al., *Measuring Faithfulness in Chain-of-Thought Reasoning* (arXiv:2307.13702) — The battery of tests, and the finding that faithfulness varies systematically with model size.
- Baker et al., *Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation* (arXiv:2503.11926) — Optimizing against a monitor destroys the property the monitor depends on. The most consequential result here.
- Test it yourself: take a reasoning trace, perturb a step so the stated logic no longer supports the conclusion, and see whether the answer changes — Cheap to run on any model with a visible scratchpad, and it will calibrate how much weight to put on stated reasoning faster than the papers will.
- Korbak et al., *Chain of Thought Monitorability: A New and Fragile Opportunity for AI Safety* (arXiv:2507.11473) — The position statement from across several labs, arguing monitorability is worth protecting deliberately.
