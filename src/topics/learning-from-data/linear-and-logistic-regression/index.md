---
title: "Linear and Logistic Regression"
description: "The two workhorse linear models: least-squares regression for real outputs and logistic regression for probabilities, with the decision boundaries they define."
order: 2
status: placeholder
prerequisites:
  - title: "Least Squares and the Pseudoinverse"
    url: "/topics/least-squares-and-the-pseudoinverse/"
  - title: "Optimization and Gradient Descent"
    url: "/topics/optimization-and-gradient-descent/"
  - title: "Estimation and Maximum Likelihood"
    url: "/topics/estimation-and-maximum-likelihood/"
---

## Why this article exists

A linear probe is logistic regression on activations, and its learned weight vector is the direction that interpretability work then interprets. The model has to be understood before its coefficients can be read as a feature.

## What this article will cover

- Linear regression, its closed form, and its probabilistic reading
- The logistic function, log-odds, and the cross-entropy objective
- Decision boundaries as hyperplanes, and the weight vector as a normal direction
- Regularized variants, and how the penalty moves the learned direction
- Reading coefficients: what a weight does and does not mean when inputs are correlated

## Where the curriculum uses it

[Classification Metrics, Thresholds, and ROC](/topics/classification-metrics-and-thresholds/), [Neurons, Layers, and Activation Functions](/topics/neurons-layers-and-activation-functions/).
