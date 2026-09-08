---
title: "Classification Metrics, Thresholds, and ROC"
description: "Precision, recall, ROC and PR curves, calibration, and how a threshold choice interacts with a rare positive class."
order: 3
status: placeholder
prerequisites:
  - title: "Linear and Logistic Regression"
    url: "/topics/linear-and-logistic-regression/"
---

## Why this article exists

Detection results, whether for sleeper agents, deception, or harmful intent, live or die on the operating point. A probe with strong AUROC can be useless at the false-positive rate a deployment can tolerate.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The confusion matrix**

- True and false positives and negatives, and the rates derived from them
- Precision, recall, specificity, F1, and what each ignores
- Accuracy's failure under class imbalance, with numbers

**2. Curves**

- ROC as TPR against FPR across thresholds
- Precision-recall, and why it is the honest curve when positives are rare
- AUROC and AUPRC as summaries, and what a single scalar conceals

**3. Choosing a threshold**

- Fixing an operating point by a false-positive budget
- TPR at a fixed low FPR as the metric that matters for monitoring
- Why a reported AUROC of 0.99 can coexist with a useless deployment

**4. Calibration**

- Reliability diagrams and expected calibration error
- Platt scaling and isotonic regression as post-hoc fixes
- Why a calibrated probe is more useful than a slightly more accurate uncalibrated one

**5. Reporting**

- Confidence intervals on these metrics, which are usually omitted
- Per-subgroup breakdowns, and the shifts they reveal
- The minimum a detection claim in this field should report

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Compute precision at a fixed FPR from a score distribution and a base rate
- Explain when to prefer a PR curve to an ROC curve, with the reason
- State what a deception-detection result must report before it can be assessed

## Sources to learn from

- Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning*, section 9.2.5 and chapter 7 — ROC and model assessment in the statistical framing.
- Saito & Rehmsmeier, 'The Precision-Recall Plot Is More Informative than the ROC Plot' (PLOS ONE, 2015) — The argument, with the imbalanced-data demonstrations.
- Guo et al., 'On Calibration of Modern Neural Networks' (arXiv:1706.04599) — Calibration, why deep networks lose it, and the standard fixes.
- Goldowsky-Dill et al., 'Detecting Strategic Deception Using Linear Probes' (arXiv:2502.03407) — Read the evaluation section for how these metrics are used, and argued over, in practice.

## Where the curriculum uses it

[Probing Classifiers](/topics/probing-classifiers/).
