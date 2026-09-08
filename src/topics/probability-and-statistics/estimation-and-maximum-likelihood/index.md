---
title: "Estimation and Maximum Likelihood"
description: "Estimating parameters from samples, what makes an estimator biased or consistent, and why maximizing likelihood is the objective most training reduces to."
order: 4
status: placeholder
prerequisites:
  - title: "Expectation, Variance, and Covariance"
    url: "/topics/expectation-variance-and-covariance/"
  - title: "Conditional Probability, Independence, and Bayes' Rule"
    url: "/topics/conditional-probability-and-bayes/"
---

## Why this article exists

Training a language model is maximum likelihood estimation, and so is fitting a probe. Seeing the objective this way explains why cross-entropy is the loss and what the trained parameters are estimates of.

## What this article will cover

- Estimators, bias, variance, and consistency
- The likelihood function and the maximum likelihood estimator
- Log-likelihood, and why the log makes it tractable
- Maximum likelihood as minimizing a KL divergence to the data distribution
- Regularization read as a prior, and MAP estimation

## Where the curriculum uses it

[Linear and Logistic Regression](/topics/linear-and-logistic-regression/), [Statistical Uncertainty and Hypothesis Testing](/topics/hypothesis-testing-and-uncertainty/), [Supervised Learning, Generalization, and Overfitting](/topics/supervised-learning-and-generalization/).
