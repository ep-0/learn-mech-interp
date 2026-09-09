---
title: "Grokking and Progress Measures"
description: "The modular-arithmetic circuit reverse-engineered in full, the Fourier algorithm the network actually learned, and the progress measures that explain a sudden jump in generalization."
order: 3
status: placeholder
prerequisites:
  - title: "The IOI Circuit: Discovery and Mechanism"
    url: "/topics/ioi-circuit/"
  - title: "Training Deep Networks: SGD, Adam, and Schedules"
    url: "/topics/training-dynamics-and-optimizers/"
---

## Why this article exists

This is the field's one completely solved case: a network trained on modular addition, its algorithm read off the weights, and the reading confirmed by predicting the behavior. It also explains grokking, where test accuracy jumps long after training accuracy saturates, by showing that a smooth internal transition was hiding behind a discontinuous-looking metric. If you want to see what a finished mechanistic explanation looks like, it is this.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The setup and the puzzle**

- Modular addition on a small vocabulary, trained to memorization and beyond
- Grokking: test accuracy rising long after training accuracy is perfect
- Why the loss curve alone makes this look like a phase change

**2. The algorithm the network found**

- Embeddings that are sparse in the Fourier basis, discovered rather than assumed
- Trigonometric identities implementing addition through rotation
- Reading the algorithm off the weights, then confirming it by ablating everything else

**3. Progress measures**

- Metrics computed from internals rather than from the loss
- Restricted loss and excluded loss, and what each isolates
- The three phases: memorization, circuit formation, cleanup

**4. Why the jump is an artifact of the metric**

- A smooth internal transition producing a sharp behavioral one
- The general lesson for emergence claims, which are usually claims about a metric
- What this predicts about other apparently sudden capabilities

**5. How far it generalizes**

- Other algorithmic tasks that have been reverse-engineered since
- Why this level of completeness has not been reached in a language model
- What would have to change for it to be

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- The optimization theory of grokking, including weight decay and the lottery-ticket framing
- Emergence in large models as a scaling-laws topic
- Fourier analysis as a subject beyond what the circuit uses

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- State the algorithm the network learned precisely enough to implement it yourself
- Explain why a progress measure can be smooth while accuracy is not
- Say what makes this circuit fully solved and the IOI circuit not

## Sources to learn from

- Nanda et al., *Progress Measures for Grokking via Mechanistic Interpretability* (arXiv:2301.05217) — The paper. Work through the Fourier analysis with the notebook open; it is the single best exercise in the curriculum.
- Power et al., *Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets* (arXiv:2201.02177) — The original observation, before anyone knew what caused it.
- Chughtai, Chan & Nanda, *A Toy Model of Universality* (arXiv:2302.03025) — The same approach on group composition, and a test of whether different seeds find the same algorithm.
- Schaeffer, Miranda & Koyejo, *Are Emergent Abilities of Large Language Models a Mirage?* (arXiv:2304.15004) — The metric argument at scale. Read it directly after the progress-measure sections; it is the same point made about frontier models.

## Where the curriculum uses it

[How Circuits Form During Training](/topics/circuit-formation-during-training/).
