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

## What this article will cover

- Confusion matrices, precision, recall, and F-scores
- ROC and precision-recall curves, and when each is the honest one
- AUROC and AUPRC, and what a single scalar hides
- Threshold selection under an operating constraint
- Calibration, and the effect of class imbalance on interpretation

## Where the curriculum uses it

[Probing Classifiers](/topics/probing-classifiers/).
