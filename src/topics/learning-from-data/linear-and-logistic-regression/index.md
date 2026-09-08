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

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Linear regression**

- The model, the squared-error objective, and the closed-form solution
- The probabilistic reading: Gaussian noise makes least squares the MLE
- Reading coefficients, and how correlated inputs break that reading

**2. Logistic regression**

- The logistic function, and modeling $\log$-odds as linear
- The cross-entropy objective and its gradient
- No closed form, and why gradient methods are used

**3. Decision boundaries**

- The boundary as a hyperplane, and the weight vector as its normal
- Distance from the boundary as a confidence proxy, and its limits
- This is the object interpretability calls a 'probe direction'

**4. Regularization**

- L2 and L1 variants, and how each moves the learned direction
- Why the regularization strength changes which direction you report as the concept
- Multi-class extension via softmax regression

**5. What the weights mean**

- A direction that separates classes need not be a direction the model uses
- Correlated features and the non-uniqueness of a good separator
- The caution to carry forward into every probing result

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Fit both models on the same data and articulate what each optimizes
- Explain why two probes with equal accuracy can point in different directions
- Connect a probe's weight vector to the geometry of the decision boundary

## Sources to learn from

- Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning*, chapters 3-4 — Both models, with the statistical caveats about coefficient interpretation.
- Murphy, *Probabilistic Machine Learning: An Introduction*, chapters 11 and 10 — Linear and logistic regression with the probabilistic framing made central.
- Bishop, *Pattern Recognition and Machine Learning*, chapter 4 — Linear models for classification, including the geometry of the decision boundary.
- Alain & Bengio, 'Understanding intermediate layers using linear classifier probes' (arXiv:1610.01644) — The origin of linear probing as an interpretability tool.

## Where the curriculum uses it

[Classification Metrics, Thresholds, and ROC](/topics/classification-metrics-and-thresholds/), [Neurons, Layers, and Activation Functions](/topics/neurons-layers-and-activation-functions/).
