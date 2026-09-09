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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Estimators**

- A statistic as a function of a sample, and an estimator as a rule
- Bias, variance, and mean squared error, with the decomposition
- Consistency, and why it is weaker than it sounds

**2. Likelihood**

- The likelihood function as the data's probability read as a function of parameters
- Why it is not a distribution over parameters
- Log-likelihood, and the two reasons the log is taken

**3. Maximum likelihood**

- The MLE as an optimization problem
- A worked example: the MLE for a categorical distribution is the empirical frequency
- Properties: consistency, asymptotic normality, and their conditions

**4. MLE as KL minimization**

- Deriving the equivalence to minimizing $D_{KL}(p_{\text{data}} \| p_\theta)$
- Why this makes cross-entropy the natural loss rather than an arbitrary choice
- The consequence: a language model's loss is an estimate of a divergence

**5. Priors and regularization**

- MAP estimation, and the prior it corresponds to
- L2 penalty as a Gaussian prior, L1 as a Laplace prior
- Where this recurs: the sparsity penalty in a sparse autoencoder

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Derive the MLE for a simple model and check whether it is biased
- Explain, in one paragraph, why language models are trained with cross-entropy
- Translate a regularization penalty into the prior it corresponds to

## Sources to learn from

- Wasserman, *All of Statistics*, chapters 6-9 — Start here. Estimation, MLE, and its asymptotics, stated compactly and correctly.
- Murphy, *Probabilistic Machine Learning: An Introduction*, chapter 4 — The same material with the ML framing and the KL connection made explicit. Freely available.
- Wasserman, *All of Statistics*, the chapter 6-9 exercises — Derive a few estimators end to end and check their bias and variance by hand. The asymptotic statements mean very little until you have done this once.
- MacKay, *Information Theory, Inference, and Learning Algorithms*, chapters 2-3 and 22 — MacKay is unusually good on what likelihood is and is not. Freely available.
- Goodfellow et al., *Deep Learning*, sections 5.4-5.5 — MLE as the foundation of the training objectives you will be interpreting.

## Where the curriculum uses it

[Linear and Logistic Regression](/topics/linear-and-logistic-regression/), [Statistical Uncertainty and Hypothesis Testing](/topics/hypothesis-testing-and-uncertainty/), [Supervised Learning, Generalization, and Overfitting](/topics/supervised-learning-and-generalization/).
