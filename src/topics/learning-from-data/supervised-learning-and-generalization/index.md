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

## What this article will cover

- Hypothesis classes, empirical risk, and the training objective
- Train, validation, and test splits, and how test sets get contaminated
- Overfitting, underfitting, and the capacity-error tradeoff
- Regularization, early stopping, and cross-validation
- Why a high-accuracy probe is not automatically evidence about the model

## Where the curriculum uses it

[Distribution Shift and Held-Out Evaluation](/topics/distribution-shift-and-evaluation/), [Training Deep Networks: SGD, Adam, and Schedules](/topics/training-dynamics-and-optimizers/).
