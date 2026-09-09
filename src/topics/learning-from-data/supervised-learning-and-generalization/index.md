---
title: "Supervised Learning, Generalization, and Overfitting"
description: "Fitting a function from labeled examples, the gap between training and held-out error, and the capacity controls that manage it."
order: 1
status: placeholder
prerequisites:
  - title: "Estimation and Maximum Likelihood"
    url: "/topics/estimation-and-maximum-likelihood/"
  - title: "Sampling and Monte Carlo Estimation"
    url: "/topics/sampling-and-monte-carlo/"
---

## Why this article exists

Every probe in this curriculum is a supervised model fit on activations, and the standard question asked of a probe, whether it found structure in the model or memorized the dataset, is the generalization question.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The setup**

- Inputs, labels, a hypothesis class, and a loss
- Empirical risk versus true risk, and the gap between them
- Why the choice of hypothesis class is the modeling decision

**2. Splits and leakage**

- Train, validation, test, and what each is allowed to influence
- Concrete leakage routes: tuning on test, duplicated examples, prompt-set overlap
- Why probing datasets leak unusually easily

**3. Capacity**

- Underfitting and overfitting, with learning curves
- The bias-variance decomposition, derived
- Double descent mentioned, and the honest statement that the classical picture is incomplete

**4. Controlling capacity**

- Regularization, early stopping, and cross-validation
- Choosing model complexity to match data size
- The specific case of a linear probe: few parameters, but on a very expressive representation

**5. What a probe's accuracy establishes**

- High accuracy proves the information is linearly decodable, and nothing more
- Control tasks and selectivity as the standard fix
- The gap between decodable and used, which the causal articles later close

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Design a probing experiment whose train/test split cannot leak
- Explain what a control task measures and why probe accuracy alone is insufficient
- Read a learning curve and diagnose whether more data or more capacity is needed

## Sources to learn from

- Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning*, chapters 2 and 7 — Start here. Supervised learning and model assessment. Chapter 7 is the one on generalization. Freely available.
- Murphy, *Probabilistic Machine Learning: An Introduction*, chapter 4.5 and chapter 5 — Overfitting, regularization, and model selection in modern notation.
- Prince, *Understanding Deep Learning*, chapter 8 — Measuring performance, including double descent, which the older texts here predate entirely. Free, with exercises and runnable notebooks.
- Hewitt & Liang, 'Designing and Interpreting Probes with Control Tasks' (arXiv:1909.03368) — The paper that made probe selectivity standard. Short and essential for this curriculum.
- Belinkov, 'Probing Classifiers: Promises, Shortcomings, and Advances' (arXiv:2102.12452) — A survey of what probing does and does not establish.

## Where the curriculum uses it

[Distribution Shift and Held-Out Evaluation](/topics/distribution-shift-and-evaluation/), [Training Deep Networks: SGD, Adam, and Schedules](/topics/training-dynamics-and-optimizers/).
